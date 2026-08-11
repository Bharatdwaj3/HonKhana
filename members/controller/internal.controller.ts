import prisma from '../config/prisma-client.ts';
import type { Request, Response } from 'express';

// Internal-only: returns just enough info for another service to send an
// email or display a name — never returns password/refreshToken/etc.
export const getUserContact = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, email: true, username: true },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user contact info';
    res.status(500).json({ message });
  }
};

// Internal-only: same as getUserContact, but looked up by email instead of id.
// Used by other services' seed scripts to resolve a real userId.
export const getUserByEmail = async (req: Request<{ email: string }>, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.params.email },
      select: { id: true, email: true, username: true },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user by email';
    res.status(500).json({ message });
  }
};
