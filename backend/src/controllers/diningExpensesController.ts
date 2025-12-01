import { Request, Response } from "express";
import prisma from "../prisma/client";

// Get all Dining transactions 
export const getDiningTransactionsByUser = async (req: Request, res: Response) => {
  const userID = Number(req.params.userID);

  if (!userID) {
    return res.status(400).json({ error: "Missing or invalid userID" });
  }

  try {
    const diningTransactions = await prisma.transaction.findMany({
      where: {
        userID,
        category: "Dining",
        type: "expense",
      },
      orderBy: { loggedAt: "desc" },
    });

    res.status(200).json(diningTransactions);
  } catch (error) {
    console.error("Error fetching dining transactions:", error);
    res.status(500).json({ error: "Failed to fetch dining transactions" });
  }
};

// Get this month's total 
export const getDiningMonthlyTotal = async (req: Request, res: Response) => {
  const userID = Number(req.query.userID);

  if (!userID) {
    return res.status(400).json({ error: "Missing or invalid userID" });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const result = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userID,
        category: "Dining",
        type: "expense",
        loggedAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    });

    const total = result._sum.amount ?? 0;
    res.status(200).json({ total });
  } catch (error) {
    console.error("Error fetching dining monthly total:", error);
    res.status(500).json({ error: "Failed to fetch dining monthly total" });
  }
};

// Add one Dining expense
export const addDiningExpense = async (req: Request, res: Response) => {
  let { userID, amount } = req.body;

  userID = Number(userID);
  amount = Number(amount);

  if (!userID || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      error: "Missing or invalid userID or amount",
    });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userID,
        amount,
        category: "Dining",
        type: "expense",
      },
    });

    res.status(201).json({
      message: "Dining expense added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error adding dining expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
