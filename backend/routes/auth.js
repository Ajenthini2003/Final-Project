// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
  console.log("📝 Signup request received:", { 
    body: req.body,
    headers: req.headers['content-type']
  });
  
  try {
    const { name, email, phone, password } = req.body;

    // 🔍 DEBUG: Log each field individually with details
    console.log("🔍 Field values:", {
      name: name ? `"${name}" (length: ${name.length})` : "undefined/null",
      email: email ? `"${email}" (length: ${email.length})` : "undefined/null",
      phone: phone ? `"${phone}" (length: ${phone.length})` : "undefined/null",
      password: password ? `✓ (length: ${password.length})` : "undefined/null"
    });

    // Validate required fields with detailed feedback
    const missingFields = [];
    if (!name || name.trim() === "") missingFields.push("name");
    if (!email || email.trim() === "") missingFields.push("email");
    if (!phone || phone.trim() === "") missingFields.push("phone");
    if (!password || password.trim() === "") missingFields.push("password");

    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields);
      
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missing: {
          name: !name || name.trim() === "",
          email: !email || email.trim() === "",
          phone: !phone || phone.trim() === "",
          password: !password || password.trim() === ""
        },
        received: {
          name: name || null,
          email: email || null,
          phone: phone || null,
          password: password ? "✓" : "✗"
        }
      });
    }

    // Trim all string fields
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      console.log("❌ Invalid email format:", trimmedEmail);
      return res.status(400).json({ 
        message: "Invalid email format",
        field: "email"
      });
    }

    // Validate phone format (basic - should contain only digits and be 10-12 chars)
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 12) {
      console.log("❌ Invalid phone format:", trimmedPhone);
      return res.status(400).json({ 
        message: "Phone number must be 10-12 digits",
        field: "phone"
      });
    }

    // Validate password length
    if (password.length < 8) {
      console.log("❌ Password too short:", password.length);
      return res.status(400).json({ 
        message: "Password must be at least 8 characters",
        field: "password"
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      console.log("❌ User already exists:", trimmedEmail);
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // Create user with trimmed data
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      password: password // Will be hashed by pre-save hook
    });

    console.log("✅ User created successfully:", {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'can_not_say',
      { expiresIn: "30d" }
    );

    // Return user data without password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || '',
      subscribedPlans: user.subscribedPlans || [],
      token,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: "User with this email already exists",
        field: "email"
      });
    }

    // Handle validation errors from mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors
      });
    }

    res.status(500).json({ 
      message: "Server error during signup", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  console.log("📝 Login request received for:", req.body.email);
  
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ 
        message: "Email and password are required",
        missing: {
          email: !email,
          password: !password
        }
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user with password field included
    const user = await User.findOne({ email: trimmedEmail }).select('+password');
    
    if (!user) {
      console.log("❌ User not found:", trimmedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password using the model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", trimmedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for:", trimmedEmail);

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'can_not_say',
      { expiresIn: "30d" }
    );

    // Return user data without password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || '',
      subscribedPlans: user.subscribedPlans || [],
      token,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('subscribedPlans');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || '',
      subscribedPlans: user.subscribedPlans || [],
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Verify token
// @route   GET /api/auth/verify
router.get("/verify", protect, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

export default router;