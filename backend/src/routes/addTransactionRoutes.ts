import { Router } from "express";
import { addTransaction } from "../controllers/addTransactionController";

const router = Router();
router.post("/add", addTransaction);

export default router;
