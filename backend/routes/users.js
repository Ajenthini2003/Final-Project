// backend/routes/users.js
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/roleMiddleware.js";

const router = express.Router();

//.............. USER CRUD......................... 

// @desc    Get all users (admin only)
// @route   GET /api/users
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if user is owner or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
router.put("/:id", protect, async (req, res) => {
  try {
    // Check if user is owner or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//  TECHNICIAN CRUD 

// @desc    Get all technicians
// @route   GET /api/users/technicians
router.get("/technicians/all", protect, async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select("-password");
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Create technician (admin only)
// @route   POST /api/users/technicians
router.post("/technicians", protect, admin, async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const technician = await User.create({
      name,
      email,
      phone,
      password,
      address,
      role: 'technician'
    });

    res.status(201).json({
      _id: technician._id,
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      role: technician.role,
      address: technician.address
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update technician (admin only)
// @route   PUT /api/users/technicians/:id
router.put("/technicians/:id", protect, admin, async (req, res) => {
  try {
    const technician = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.json(technician);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//     Delete technician (admin only)
//    DELETE /api/users/technicians/:id
router.delete("/technicians/:id", protect, admin, async (req, res) => {
  try {
    const technician = await User.findById(req.params.id);
    
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    await technician.deleteOne();
    res.json({ message: "Technician removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get technician by ID
// @route   GET /api/users/technicians/:id
router.get("/technicians/:id", protect, async (req, res) => {
  try {
    const technician = await User.findOne({ 
      _id: req.params.id, 
      role: 'technician' 
    }).select("-password");

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.json(technician);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;