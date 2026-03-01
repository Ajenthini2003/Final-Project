import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin, technician, adminOrTechnician } from "../middleware/roleMiddleware.js"; // ✅ Updated import
import {
  getPlans,
  subscribeToPlan,
  unsubscribeFromPlan,
  getMyPlans,
  createPlan,
  updatePlan,
  deletePlan
} from "../controllers/planController.js";

const router = express.Router();

// Public routes - anyone can view plans
router.get("/", getPlans);

// All routes below require authentication
router.use(protect);

// User routes
router.get("/my-plans", getMyPlans);
router.post("/:id/subscribe", subscribeToPlan);
router.post("/:id/unsubscribe", unsubscribeFromPlan);

// Admin only routes - using your existing 'admin' middleware
router.post("/", admin, createPlan);        // ✅ Using 'admin' middleware
router.put("/:id", admin, updatePlan);       // ✅ Using 'admin' middleware
router.delete("/:id", admin, deletePlan);    // ✅ Using 'admin' middleware

export default router;