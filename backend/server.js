import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database.js";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not set in .env!");
  process.exit(1);
}

import authRoutes        from "./routes/auth.js";
import userRoutes        from "./routes/users.js";
import planRoutes        from "./routes/plans.js";
import serviceRoutes     from "./routes/services.js";
import bookingRoutes     from "./routes/bookings.js";
import paymentRoutes     from "./routes/payments.js";
import technicianRoutes  from "./routes/technicians.js";
import adminRoutes       from "./routes/admin.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health",     (req, res) => res.json({ status: "healthy", mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
app.get("/api/health", (req, res) => res.json({ status: "healthy", mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
app.get("/",           (req, res) => res.json({ message: "FixMate API is running", version: "2.0.0" }));

app.use("/api/auth",        authRoutes);
app.use("/api/users",       userRoutes);
app.use("/api/plans",       planRoutes);
app.use("/api/services",    serviceRoutes);
app.use("/api/bookings",    bookingRoutes);
app.use("/api/payments",    paymentRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/admin",       adminRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found: " + req.method + " " + req.url }));
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "development" ? err.message : "Internal error" });
});

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log("\nFixMate Server running on http://localhost:" + PORT);
      console.log("Routes: /api/auth, /api/plans, /api/services, /api/bookings, /api/payments, /api/technicians, /api/admin\n");
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
};
startServer();
