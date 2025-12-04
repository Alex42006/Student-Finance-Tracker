import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

interface JwtPayload {
  userId: number;
  isAdmin: boolean;
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawHeader = req.headers.authorization;
    if (!rawHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = rawHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
