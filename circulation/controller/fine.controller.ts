import prisma from "../config/prisma-client.ts";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

// Fixed-amount presets. "Late" is handled separately since it's computed from `days`.
const FINE_PRESETS: Record<string, number> = {
  Damaged: 300,
  Lost: 700,
};
const LATE_FINE_PER_DAY = 50;

const issueFine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, reason, days } = req.body;
    const issuedBy = req.user?.id;

    if (!userId || !reason) {
      res.status(400).json({ message: "userId and reason are required" });
      return;
    }

    let amount: number;
    if (reason === "Late") {
      if (!days || days <= 0) {
        res.status(400).json({ message: "days is required and must be greater than 0 for a Late fine" });
        return;
      }
      amount = LATE_FINE_PER_DAY * days;
    } else if (reason in FINE_PRESETS) {
      amount = FINE_PRESETS[reason];
    } else {
      res.status(400).json({ message: `reason must be one of: ${Object.keys(FINE_PRESETS).join(", ")}, Late` });
      return;
    }

    const fine = await prisma.fine.create({
      data: { userId, amount, reason, issuedBy: issuedBy! },
    });

    res.status(201).json(fine);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to issue fine";
    res.status(500).json({ message });
  }
};

export { issueFine };
