// Run with: node seed/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@fixmate.lk" });
    if (existing) {
      console.log("  Admin already exists:", existing.email);
      console.log("   Use email: admin@fixmate.lk");
      console.log("   Use password: Admin@1234");
      process.exit(0);
    }

    const admin = await User.create({
      name: "FixMate Admin",
      email: "admin@fixmate.lk",
      phone: "0771234567",
      password: "Admin@1234",
      role: "admin",
      address: "Colombo, Sri Lanka",
    });

    console.log(" Admin created successfully!");
    console.log("================================");
    console.log("  Email:    admin@fixmate.lk");
    console.log("  Password: Admin@1234");
    console.log("  Role:     admin");
    console.log("================================");
    console.log("Login at: http://localhost:5173/admin-login");

    process.exit(0);
  } catch (err) {
    console.error(" Seed error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
