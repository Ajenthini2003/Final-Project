import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    default: null,
  },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ["card", "bank_transfer", "cash", "online"],
    default: "card",
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  description: { type: String, default: "" },
  transactionId: { type: String, default: "" },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
