import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPayments,
  getMyPayments,
  subscribeToPlan,
  unsubscribeFromPlan,
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(protect);

router.get("/", getPayments);          // admin=all, user=own
router.get("/my", getMyPayments);
router.post("/subscribe/:planId", subscribeToPlan);
router.post("/unsubscribe/:planId", unsubscribeFromPlan);

export default router;
