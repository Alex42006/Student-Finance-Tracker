import express from "express";
import {
  getDiningMonthlyTotal,
  getDiningTransactionsByUser,
  addDiningExpense,
} from "../controllers/diningExpensesController";

const router = express.Router();

router.get("/dining/total", getDiningMonthlyTotal);
router.get("/dining/:userID", getDiningTransactionsByUser);
router.post("/dining/add", addDiningExpense);

export default router;
