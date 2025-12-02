import { Router } from "express";
import { getAllUsers, deleteUser } from "../controllers/adminController";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/users", requireAdmin, getAllUsers);
router.delete("/users/:id", requireAdmin, deleteUser);

export default router;
