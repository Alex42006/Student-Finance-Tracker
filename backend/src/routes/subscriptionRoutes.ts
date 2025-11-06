import { Router } from "express";
import { addSubscription, getSubscriptionsByUser, updateSubscription, deleteSubscription } from "../controllers/subscriptionController";

const router = Router();

router.post("/addSubscription", addSubscription);
router.get("/getSubscriptionsByUser/:userID", getSubscriptionsByUser)
router.put("/updateSubscription/:id", updateSubscription)
router.delete("/deleteSubscription/:id", deleteSubscription)

export default router;
