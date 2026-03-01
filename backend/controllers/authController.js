// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: "30d" });
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    console.log("📝 Signup request received:", req.body);
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: "All fields are required",
        missing: {
          name: !name,
          email: !email,
          phone: !phone,
          password: !password
        }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    console.log("✅ User created:", user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || '',
      subscribedPlans: user.subscribedPlans || [],
      token
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    console.log("📝 Login request received for:", req.body.email);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password using the model method
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for:", email);

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address || '',
      subscribedPlans: user.subscribedPlans || [],
      token
    });
  } catch (error) {
    console.error(" Login error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('subscribedPlans');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(" Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
export default { signup, login, getMe };