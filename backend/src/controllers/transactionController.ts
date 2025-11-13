import { Request, Response } from "express";
import prisma from "../prisma/client";

// CREATE transaction
export const Transaction = async (req: Request, res: Response) => {
  const { userID, amount, category, type } = req.body;

  if (!userID || !amount || !category || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: { userID: Number(userID), amount: Number(amount), category, type },
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
// GET all transactions
export const GetAllTransactions = async (req: Request, res: Response) => {
  const { userID } = req.query;

  try {
    const transactions = await prisma.transaction.findMany({
      where: userID ? { userID: Number(userID) } : {},
      orderBy: { loggedAt: "desc" },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// GET single transaction by ID
export const GetTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// UPDATE transaction
export const UpdateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, category, type } = req.body;

  try {
    const data: Record<string, any> = {};
    if (amount !== undefined) data.amount = Number(amount);
    if (category !== undefined) data.category = category;
    if (type !== undefined) data.type = type;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields provided to update" });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json({
      message: "Transaction updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// DELETE transaction
export const DeleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

