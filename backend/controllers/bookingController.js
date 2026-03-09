import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

// GET /api/bookings  (admin = all, user = own)
export const getBookings = async (req, res) => {
  try {                               //if admin can see all bookings if user only his booking
    const filter = req.user.role === "admin" ? {} : { userId: req.user.id };
    const bookings = await Booking.find(filter)
      .populate("serviceId", "name category price")
      .populate("technicianId", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/bookings/my  (current user's bookings)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("serviceId", "name category price imageUrl")
      .populate("technicianId", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId")
      .populate("technicianId", "name phone email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only owner or admin can view   authorization 
    if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);          //return bookings to frontend
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/bookings  (create booking + payment record)
export const createBooking = async (req, res) => {
  try {
    const {
      serviceId, serviceName, technicianId, technicianName,
      date, time, address, phone, description, price, paymentMethod,
    } = req.body;

    if (!serviceId || !date || !time || !address || !phone || !price) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      serviceId,
      serviceName,
      technicianId: technicianId || null,
      technicianName: technicianName || "",
      date,
      time,
      address,
      phone,
      description: description || "",
      price,
      paymentMethod: paymentMethod || "card",
      status: "confirmed",       // confirmed because they paid upfront
      paymentStatus: "paid",
    });

    // Create payment record linked to this booking
    await Payment.create({
      userId: req.user.id,
      bookingId: booking._id,
      amount: price,
      method: paymentMethod || "card",
      status: "paid",
      description: `Payment for: ${serviceName}`,
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/bookings/:id  (update status etc)
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Mark associated payment as refunded
    await Payment.findOneAndUpdate(
      { bookingId: booking._id },
      { status: "refunded" }
    );

    res.json({ success: true, message: "Booking cancelled and refund initiated", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/bookings/:id  (admin only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
