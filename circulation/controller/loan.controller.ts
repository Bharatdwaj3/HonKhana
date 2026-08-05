import prisma from "../config/prisma-client.ts";
//import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { CATALOG_SERVICE_URL, INTERNAL_SERVICE_SECRET } from "../config/env.config.ts";

import type { Response as ExpressResponse } from "express";

const LOAN_PERIOD_DAYS = 14;
const MAX_RENEWALS = 2;
const FINE_PER_DAY = 50;
const MAX_UNPAID_FINES = 1000;
const MAX_ACTIVE_LOANS: Record<string, number> = {
  student: 3,
  faculty: 5,
  admin: 0,
};

// Adds isOverdue / daysOverdue to a loan without storing them in the DB —
// always accurate since it's computed against the current time on every read.
const withOverdueInfo = (loan: any) => {
  const isOverdue = !loan.returnedAt && loan.dueAt < new Date();
  const daysOverdue = isOverdue
    ? Math.ceil((new Date().getTime() - loan.dueAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  return { ...loan, isOverdue, daysOverdue };
};

const adjustBookCopies = async (bookId: number, delta: number): Promise<Response> => {
  return fetch(`${CATALOG_SERVICE_URL}/api/v1/book/${bookId}/copies`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": INTERNAL_SERVICE_SECRET,
    },
    body: JSON.stringify({ delta }),
  }) as unknown as Response;
};

const getBook = async (bookId: number) => {
  const res = await fetch(`${CATALOG_SERVICE_URL}/api/v1/book/${bookId}`);
  if (!res.ok) return null;
  return res.json();
};

const borrowBook = async (req: AuthRequest, res: ExpressResponse): Promise<void> => {
  try {
    const { bookId } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role || "";

    if (!bookId) {
      res.status(400).json({ message: "bookId is required" });
      return;
    }

    const maxActive = MAX_ACTIVE_LOANS[userRole] ?? 0;
    if (maxActive === 0) {
      res.status(403).json({ message: "Your role is not permitted to borrow books" });
      return;
    }

    const book = await getBook(Number(bookId));
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    if (book.availableCopies < 1) {
      res.status(409).json({ message: "No copies currently available" });
      return;
    }

    // Cap check: block if the user already has too many active (unreturned) loans for their role
    const activeLoanCount = await prisma.loan.count({
      where: { userId, returnedAt: null },
    });
    if (activeLoanCount >= maxActive) {
      res.status(403).json({ message: `You have reached the maximum of ${maxActive} active loans` });
      return;
    }

    // Cap check: block if the user's total unpaid fines are over the threshold.
    // Unpaid amounts can come from two places — late-return fines already on a loan,
    // and admin-issued fines in the separate `fine` table.
    const unpaidLoanFines = await prisma.loan.aggregate({
      where: { userId, fineAmount: { gt: 0 } },
      _sum: { fineAmount: true },
    });
    const unpaidIssuedFines = await prisma.fine.aggregate({
      where: { userId, paid: false },
      _sum: { amount: true },
    });
    const totalUnpaid = (unpaidLoanFines._sum.fineAmount || 0) + (unpaidIssuedFines._sum.amount || 0);
    if (totalUnpaid > MAX_UNPAID_FINES) {
      res.status(403).json({ message: `You have unpaid fines of ${totalUnpaid} — please clear them before borrowing` });
      return;
    }

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + LOAN_PERIOD_DAYS);

    const loan = await prisma.loan.create({
      data: { bookId: book.id, userId: userId!, dueAt },
    });

    const catalogRes = await adjustBookCopies(book.id, -1);
    if (!catalogRes.ok) {
      await prisma.loan.delete({ where: { id: loan.id } });
      res.status(502).json({ message: "Could not reserve a copy right now — please try again" });
      return;
    }

    res.status(201).json(loan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to borrow book";
    res.status(500).json({ message });
  }
};

const returnBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loanId = Number(req.params.id);
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) {
      res.status(404).json({ message: "Loan not found" });
      return;
    }
    if (loan.returnedAt) {
      res.status(409).json({ message: "This book was already returned" });
      return;
    }
    if (loan.userId !== userId && !isAdmin) {
      res.status(403).json({ message: "You can only return your own loans" });
      return;
    }

    const returnedAt = new Date();
    const daysLate = Math.max(0, Math.ceil((returnedAt.getTime() - loan.dueAt.getTime()) / (1000 * 60 * 60 * 24)));
    const fineAmount = daysLate * FINE_PER_DAY;

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: { returnedAt, fineAmount },
    });
    const catalogRes = await adjustBookCopies(loan.bookId, 1);
    if (!catalogRes.ok) {
      console.error(`Loan ${loanId} returned, but Catalog copy count was not incremented. Needs manual fix.`);
    }

    res.status(200).json(updatedLoan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to return book";
    res.status(500).json({ message });
  }
};

const listMyLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.user?.id },
      orderBy: { borrowedAt: "desc" },
    });
    res.status(200).json(loans.map(withOverdueInfo));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch loans";
    res.status(500).json({ message });
  }
};

const listAllLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await prisma.loan.findMany({ orderBy: { borrowedAt: "desc" } });
    res.status(200).json(loans.map(withOverdueInfo));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch loans";
    res.status(500).json({ message });
  }
};

// Only currently-overdue loans: not yet returned, past their due date.
// Filtered at the DB level rather than fetched-then-filtered in JS.
const listOverdueLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await prisma.loan.findMany({
      where: {
        returnedAt: null,
        dueAt: { lt: new Date() },
      },
      orderBy: { dueAt: "asc" },
    });
    res.status(200).json(loans.map(withOverdueInfo));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch overdue loans";
    res.status(500).json({ message });
  }
};

export { borrowBook, returnBook, listMyLoans, listAllLoans, listOverdueLoans, renewBook };

const renewBook = async (req: AuthRequest, res: ExpressResponse): Promise<void> => {
  try {
    const loanId = Number(req.params.id);
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) {
      res.status(404).json({ message: "Loan not found" });
      return;
    }
    if (loan.returnedAt) {
      res.status(409).json({ message: "This book was already returned" });
      return;
    }
    if (loan.userId !== userId && !isAdmin) {
      res.status(403).json({ message: "You can only renew your own loans" });
      return;
    }

    if (loan.renewalCount >= MAX_RENEWALS) {
      res.status(400).json({ message: `You have reached the maximum of ${MAX_RENEWALS} renewals for this loan` });
      return;
    }

    const newDueAt = new Date(loan.dueAt);
    newDueAt.setDate(newDueAt.getDate() + LOAN_PERIOD_DAYS);

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: { dueAt: newDueAt, renewalCount: { increment: 1 } },
    });

    res.status(200).json(updatedLoan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to renew book";
    res.status(500).json({ message });
  }
};
