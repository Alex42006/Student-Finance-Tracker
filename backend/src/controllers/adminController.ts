import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        isAdmin: true
      }
    });

    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({ where: { id } });

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
