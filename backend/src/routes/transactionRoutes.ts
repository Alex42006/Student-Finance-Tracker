import { Router } from "express";
import { Transaction, GetAllTransactions, GetTransactionById, UpdateTransaction, DeleteTransaction} from "../controllers/transactionController";

const router = Router();

// CREATE
router.post("/add", Transaction);

// READ all
router.get("/", GetAllTransactions);

// READ one by ID
router.get("/:id", GetTransactionById);

// UPDATE
router.put("/:id", UpdateTransaction);

// DELETE
router.delete("/:id", DeleteTransaction);

export default router;

