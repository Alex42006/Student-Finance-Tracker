import { Router } from "express";
import {
  getMealSwipeByUser,
  updateMealSwipes,
  deleteMealSwipes
} from "../controllers/mealSwipeController";

const router = Router();

router.get("/getMealSwipeByUser/:userID", getMealSwipeByUser);
router.post("/update", updateMealSwipes);
router.delete("/delete/:id", deleteMealSwipes);

export default router;
