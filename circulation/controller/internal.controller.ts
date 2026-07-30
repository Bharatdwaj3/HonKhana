import prisma from '../config/prisma-client.ts';
import type { Request, Response } from 'express';

// Returns borrow counts per book across ALL loans (past + present),
// used by the catalog service to rank "Trending" books.
export const getLoanCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const counts = await prisma.loan.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
    });

    const result = counts.map((c) => ({
      bookId: c.bookId,
      count: c._count.bookId,
    }));

    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch loan counts';
    res.status(500).json({ message });
  }
};
