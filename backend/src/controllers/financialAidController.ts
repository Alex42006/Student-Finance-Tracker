import { Request, Response } from "express";
import prisma from "../prisma/client";

// CREATE
export const CreateFinancialAid = async (req: Request, res: Response) => {
  const {
    userID,
    aidType,
    amountAwarded,
    termSeason,
    termYear,
    disbursementDate,
    repeats,
    repeatInterval
  } = req.body;

  if (!userID || !aidType || !amountAwarded || !termSeason || !termYear || !disbursementDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const financialAid = await prisma.financialAid.create({
      data: {
        userID: Number(userID),
        aidType,
        amountAwarded: Number(amountAwarded),
        termSeason,
        termYear: Number(termYear),
        disbursementDate: new Date(disbursementDate),
        repeats: Boolean(repeats),
        repeatInterval: repeats ? repeatInterval : null
      },
    });

    res.status(201).json({ message: "Financial aid created", financialAid });
  } catch (error) {
    console.error("Error creating financial aid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET ALL
export const GetAllFinancialAid = async (req: Request, res: Response) => {
  const { userID } = req.query;

  try {
    const financialAid = await prisma.financialAid.findMany({
      where: userID ? { userID: Number(userID) } : {},
      orderBy: { disbursementDate: "desc" },
    });

    res.status(200).json(financialAid);
  } catch (error) {
    console.error("Error fetching financial aid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET single
export const GetFinancialAidById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const financialAid = await prisma.financialAid.findUnique({
      where: { id: Number(id) },
    });

    if (!financialAid) {
      return res.status(404).json({ error: "Financial aid record not found" });
    }

    res.status(200).json(financialAid);
  } catch (error) {
    console.error("Error fetching financial aid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE
export const UpdateFinancialAid = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    aidType,
    amountAwarded,
    termSeason,
    termYear,
    disbursementDate,
    repeats,
    repeatInterval
  } = req.body;

  try {
    const data: Record<string, any> = {};

    if (aidType !== undefined) data.aidType = aidType;
    if (amountAwarded !== undefined) data.amountAwarded = Number(amountAwarded);
    if (termSeason !== undefined) data.termSeason = termSeason;
    if (termYear !== undefined) data.termYear = Number(termYear);
    if (disbursementDate !== undefined)
      data.disbursementDate = new Date(disbursementDate);
    if (repeats !== undefined) data.repeats = Boolean(repeats);
    data.repeatInterval = repeats ? repeatInterval : null;

    const updated = await prisma.financialAid.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json({ message: "Financial aid updated", updated });
  } catch (error) {
    console.error("Error updating financial aid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE
export const DeleteFinancialAid = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.financialAid.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Financial aid deleted" });
  } catch (error) {
    console.error("Error deleting financial aid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
