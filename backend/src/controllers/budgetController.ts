import { Request, Response } from "express";
import prisma from "../prisma/client";

// CREATE
export const AddBudget = async (req: Request, res: Response) => {
  const { userID, category, limitAmount, period, goalAmount, goalDeadline } = req.body;

  if (!userID || !category || !limitAmount || !period) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const budget = await prisma.budget.create({
      data: {
        userID: Number(userID),
        category,
        limitAmount: Number(limitAmount),
        spentAmount: 0,
        period,
        goalAmount: goalAmount ? Number(goalAmount) : null,
        goalDeadline: goalDeadline ? new Date(goalDeadline) : null,
      },
    });

    res.status(201).json({ message: "Budget created", budget });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET all by user
export const GetBudgetsByUser = async (req: Request, res: Response) => {
  const userID = Number(req.params.userID);

  try {
    const budgets = await prisma.budget.findMany({
      where: { userID },
      orderBy: { id: "asc" },
    });

    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE
export const UpdateBudget = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, limitAmount, period, goalAmount, goalDeadline } = req.body;

  const data: Record<string, any> = {};

  if (category !== undefined) data.category = category;
  if (limitAmount !== undefined) data.limitAmount = Number(limitAmount);
  if (period !== undefined) data.period = period;
  if (goalAmount !== undefined) data.goalAmount = goalAmount ? Number(goalAmount) : null;
  if (goalDeadline !== undefined)
    data.goalDeadline = goalDeadline ? new Date(goalDeadline) : null;

  try {
    const updated = await prisma.budget.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json({ message: "Budget updated", updated });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE
export const DeleteBudget = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.budget.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
