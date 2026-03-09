import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getFeaturedServices,
} from "../controllers/serviceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/featured", getFeaturedServices);
router.get("/category/:category", getServicesByCategory);
router.get("/:id", getServiceById);

// Admin only routes
router.post("/", protect, admin, createService);
router.put("/:id", protect, admin, updateService);
router.delete("/:id", protect, admin, deleteService);

export default router;