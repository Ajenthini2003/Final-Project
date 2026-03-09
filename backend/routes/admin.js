import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";
import { getAdminStats, getRecentBookings } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, admin);

router.get("/stats", getAdminStats);
router.get("/recent-bookings", getRecentBookings);

export default router;
