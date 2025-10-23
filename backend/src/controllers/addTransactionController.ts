import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addTransaction = async (req: Request, res: Response) => {
  const { userID, amount, category, type } = req.body;

  if (!userID || !amount || !category || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transaction = await prisma.addTransaction.create({
      data: { userID, amount, category, type },
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
