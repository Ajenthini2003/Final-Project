import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // technicians are stored as Users with role=technician
    default: null,
  },
  serviceName: { type: String, required: true },
  technicianName: { type: String, default: "" },
  date: { type: String, required: true },   // "YYYY-MM-DD"
  time: { type: String, required: true },   // "10:00 AM"
  address: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  paymentMethod: { type: String, default: "card" },
  notes: { type: String, default: "" },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
