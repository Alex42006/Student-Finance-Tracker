import { Router } from "express";
import {
  CreateFinancialAid,
  GetAllFinancialAid,
  GetFinancialAidById,
  UpdateFinancialAid,
  DeleteFinancialAid
} from "../controllers/financialAidController";

const router = Router();

router.post("/add", CreateFinancialAid);
router.get("/", GetAllFinancialAid);
router.get("/:id", GetFinancialAidById);
router.put("/:id", UpdateFinancialAid);
router.delete("/:id", DeleteFinancialAid);

export default router;
