import prisma from "../config/prisma-client.ts";
import type { Response, Request } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

const listBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await prisma.book.findMany({ where: { deletedAt: null } });
    res.status(200).json(books);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
};

const getBook = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const book = await prisma.book.findUnique({ where: { id: Number(req.params.id) } });
    if (!book || book.deletedAt) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
};

const registerBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, author, publisher, isbn, genre, totalCopies, coverUrl } = req.body;

    if (!title || !author || !isbn) {
      res.status(400).json({ message: "title, author, and isbn are required" });
      return;
    }

    const copies = Number(totalCopies) || 1;

    const book = await prisma.book.create({
      data: {
        title, author, publisher, isbn, genre,
        totalCopies: copies,
        availableCopies: copies,
        coverUrl,
        addedByUserId: req.user?.id,
      },
    });
    res.status(201).json(book);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ message: "A book with this ISBN already exists" });
      return;
    }
    const message = error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
};

const updateBook = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { title, author, publisher, isbn, genre, totalCopies, coverUrl } = req.body;
    const book = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: { title, author, publisher, isbn, genre, totalCopies, coverUrl },
    });
    res.status(200).json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
};

const removeBook = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const book = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: { deletedAt: new Date() },
    });
    res.status(200).json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
};

const adjustCopies = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { delta } = req.body; 
    const book = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: { availableCopies: { increment: Number(delta) } },
    });
    res.status(200).json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to adjust copies";
    res.status(500).json({ message });
  }
};

export { listBooks, getBook, registerBook, updateBook, removeBook, adjustCopies };