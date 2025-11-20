import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getMealSwipeByUser = async (req: Request, res: Response) => {
  const userID = Number(req.params.userID);

  try {
    const mealSwipe = await prisma.mealSwipe.findFirst({ where: { userID } });
    res.json(mealSwipe || null);
  } catch (error) {
    console.error("Error fetching meal swipes:", error);
    res.status(500).json({ error: "Failed to fetch meal swipe data" });
  }
};

// Create or update meal swipes
export const updateMealSwipes = async (req: Request, res: Response) => {
  let { userID, swipesTotal, swipesUsed, diningDollars } = req.body;

  userID = Number(userID);
  swipesTotal = Number(swipesTotal || 0);
  swipesUsed = Number(swipesUsed || 0);
  diningDollars = Number(diningDollars || 0);

  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }

  try {
    const exist = await prisma.mealSwipe.findFirst({ where: { userID } });

    let mealSwipe;
    if (exist) {
      mealSwipe = await prisma.mealSwipe.update({
        where: { id: exist.id },
        data: {
          swipesTotal,
          swipesUsed,
          diningDollars,
        },
      });
    } else {
      mealSwipe = await prisma.mealSwipe.create({
        data: {
          userID,
          swipesTotal,
          swipesUsed,
          diningDollars,
        },
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


export const deleteMealSwipes = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.mealSwipe.delete({ where: { id } });
    res.json({ message: "Meal swipe record deleted" });
  } catch (error) {
    console.error("Error deleting meal swipe record:", error);
    res.status(500).json({ error: "Failed to delete meal swipe data" });
  }
};
