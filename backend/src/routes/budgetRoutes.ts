import { Router } from "express";
import {
  AddBudget,
  GetBudgetsByUser,
  UpdateBudget,
  DeleteBudget
} from "../controllers/budgetController";

const router = Router();

router.post("/addBudget", AddBudget);
router.get("/getBudgetsByUser/:userID", GetBudgetsByUser);
router.put("/updateBudget/:id", UpdateBudget);
router.delete("/deleteBudget/:id", DeleteBudget);

export default router;
