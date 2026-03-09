import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const missingFields = [];
    if (!name?.trim()) missingFields.push("name");
    if (!email?.trim()) missingFields.push("email");
    if (!phone?.trim()) missingFields.push("phone");
    if (!password?.trim()) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const phoneDigits = phone.trim().replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 12) {
      return res.status(400).json({ message: "Phone number must be 10-12 digits" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      password,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "can_not_say",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || "",
      subscribedPlans: user.subscribedPlans || [],
      subscription: user.subscription || null,
      token,
      createdAt: user.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "User with this email already exists" });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error during signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "can_not_say",
      { expiresIn: "30d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || "",
      subscribedPlans: user.subscribedPlans || [],
      subscription: user.subscription || null,
      token,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("subscribedPlans");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || "",
      subscribedPlans: user.subscribedPlans || [],
      subscription: user.subscription || null,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/verify
router.get("/verify", protect, (req, res) => {
  res.json({ valid: true, user: { id: req.user.id, role: req.user.role } });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// PUT /api/auth/profile  (update own profile)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("subscribedPlans");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || "",
      subscribedPlans: user.subscribedPlans || [],
      subscription: user.subscription || null,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
