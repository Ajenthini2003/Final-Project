import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";
import {
  getBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use(protect); // all booking routes require login

router.get("/", getBookings);           // admin=all, user=own
router.get("/my", getMyBookings);       // current user's bookings
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.put("/:id/cancel", cancelBooking);
router.delete("/:id", admin, deleteBooking);

export default router;
