import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";
import {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  updateAvailability,
  deleteTechnician,
} from "../controllers/technicianController.js";

const router = express.Router();

// Public - anyone can view technicians
router.get("/", getTechnicians);
router.get("/:id", getTechnicianById);

// Protected
router.patch("/:id/availability", protect, updateAvailability);

// Admin only
router.post("/", protect, admin, createTechnician);
router.put("/:id", protect, admin, updateTechnician);
router.delete("/:id", protect, admin, deleteTechnician);

export default router;
