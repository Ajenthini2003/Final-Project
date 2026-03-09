import jwt from "jsonwebtoken"; // Library used to create and verify JWT tokens
import User from "../models/User.js";  // MongoDB model representing the User collection

// Function to generate JWT token
const generateToken = (id) => {
  // Creates a token containing user ID
  // Token expires in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET || 'can_not_say', { expiresIn: "30d" });
};

// signup function  it is user registration api
export const signup = async (req, res) => {
  try {
    // Extract data sent from the client frontend
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

    // Check if a user with the same email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      phone,
      password, // Password will be hashed in the User model
    });

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    // Send user details along with token in the response
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
    // Return 500 status if there is a server error
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// LOGIN function
export const login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user by email in the database
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token if login is successful
    const token = generateToken(user._id);

    // Send user details and token in the response
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
    // Return 500 status if there is a server error
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET CURRENT USER function
export const getMe = async (req, res) => {
  try {
    // Get the user ID from the request (attached by authentication middleware)
    // Fetch user details from the database
    const user = await User.findById(req.user.id).populate('subscribedPlans');

    // If user is not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details in the response
    res.json(user);
  } catch (error) {
    // Return 500 status if there is a server error
    res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
export default { signup, login, getMe };