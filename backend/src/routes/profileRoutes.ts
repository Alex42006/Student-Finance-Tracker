import { Router } from "express";
import { updateEmail, updatePassword, deleteAccount } from "../controllers/profileController";

const router = Router();

router.put("/email", updateEmail);
router.put("/password", updatePassword);
router.delete("/delete", deleteAccount);

export default router;
