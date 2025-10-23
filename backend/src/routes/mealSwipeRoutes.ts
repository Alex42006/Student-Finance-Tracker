import { Router } from "express";
import { updateMealSwipes } from "../controllers/mealSwipeController";

const router = Router();
router.post("/update", updateMealSwipes);

export default router;