import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";

export const updateEmail = async (req: Request, res: Response) => {
    const { userId, newEmail } = req.body;
  
    if (!userId || !newEmail) {
      return res.status(400).json({ error: "Missing fields" });
    }
  
    const existing = await prisma.user.findUnique({
      where: { email: newEmail }
    });
  
    if (existing && existing.id !== userId) {
      return res.status(400).json({ error: "Username already in use" });
    }
  
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail }
    });
  
    res.json({ message: "Email updated successfully" });
  };
  

export const updatePassword = async (req: Request, res: Response) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed }
  });

  res.json({ message: "Password updated successfully" });
};

export const deleteAccount = async (req: Request, res: Response) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
  
    try {
      const id = Number(userId);
  
      await prisma.transaction.deleteMany({ where: { userID: id } });
      await prisma.mealSwipe.deleteMany({ where: { userID: id } });
      await prisma.subscription.deleteMany({ where: { userID: id } });
      await prisma.financialAid.deleteMany({ where: { userID: id } });
      await prisma.budget.deleteMany({ where: { userID: id } });
  
      await prisma.user.delete({
        where: { id },
      });
  
      return res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete account error:", error);
      return res.status(500).json({ error: "Failed to delete account" });
    }
  };
  