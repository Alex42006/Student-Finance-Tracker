import { Router } from "express";
import { Transaction } from "../controllers/transactionController";

const router = Router();
router.post("/add", Transaction);

export default router;
