import { Request, Response } from "express";
import prisma from "../prisma/client";

export const updateMealSwipes = async (req: Request, res: Response) => {
  const { userID, swipesTotal, swipesUsed } = req.body;

  if (!userID || swipesTotal == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const exist = await prisma.mealSwipe.findFirst({ where: { userID } });

    let mealSwipe;
    if (exist) {
      mealSwipe = await prisma.mealSwipe.update({
        where: { id: exist.id },
        data: { swipesTotal, swipesUsed },
      });
    } else {
      mealSwipe = await prisma.mealSwipe.create({
        data: { userID, swipesTotal, swipesUsed },
      });
    }

    res.status(200).json({
      message: "Meal swipes updated successfully",
      mealSwipe,
    });
  } catch (error) {
    console.error("Error updating meal swipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
