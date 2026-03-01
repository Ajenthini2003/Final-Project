import mongoose from "mongoose";
import dotenv from "dotenv";
import Plan from "../models/Plan.js";

dotenv.config();

const plans = [
  {
    name: "Basic Plan",
    description: "Essential coverage for occasional repairs",
    price: 999,
    duration: "month",
    features: [
      "2 service calls/month",
      "Basic diagnostics",
      "5% parts discount"
    ],
    popular: false
  },
  {
    name: "Premium Plan",
    description: "Complete coverage for peace of mind",
    price: 1999,
    duration: "month",
    features: [
      "4 service calls/month",
      "Priority scheduling",
      "15% parts discount",
      "24/7 support"
    ],
    popular: true
  },
  {
    name: "Family Shield",
    description: "Ultimate protection for your entire home",
    price: 2999,
    duration: "month",
    features: [
      "Unlimited calls",
      "Same-day service",
      "25% parts discount",
      "Priority support"
    ],
    popular: false
  }
];

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Plan.deleteMany();
    console.log("📦 Cleared existing plans");

    await Plan.insertMany(plans);
    console.log("🎉 Plans seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedPlans();