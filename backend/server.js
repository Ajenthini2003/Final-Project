import express from "express";            //Web server create
import cors from "cors";                 //Cross-Origin Resource Sharing (frontend from request)
import dotenv from "dotenv";             // files variables load from .env
import mongoose from "mongoose";
import connectDB from "./config/database.js";

// Load environment
dotenv.config();

// Check if MONGO_URI is set
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not set in environment variables!");
  process.exit(1);      //if not mongo-uri there,exit and error show
} else {
  console.log(" MONGO_URI found");             //if uri there, success
}

import authRoutes from "./routes/auth.js";     //signup,login related ,authentication routes
import userRoutes from "./routes/users.js";     //user profile,update related
import planRoutes from "./routes/plans.js";     //✅ ADD THIS - repair plans routes

const app = express();     //create express app

// CORS configuration
app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true 
}));

app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';
  
  res.json({ 
    status: "healthy",
    mongodb: dbStatusText,
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get("/", (req, res) => res.json({ 
  message: "FixMate API is running",
  version: "1.0.0",
  endpoints: {
    health: "/health",
    auth: "/api/auth",
    users: "/api/users",
    plans: "/api/plans"      //✅ ADD THIS to endpoints list
  }
}));

// Use ONLY the routes you need
app.use("/api/auth", authRoutes);   //authentication related endpoints
app.use("/api/users", userRoutes);   //user management endpoints
app.use("/api/plans", planRoutes);   //✅ ADD THIS - repair plans endpoints

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: [
      "/health",
      "/api/auth",
      "/api/users",
      "/api/plans"      //✅ ADD THIS to available endpoints
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n Server started successfully!`);
      console.log(`=================================`);
      console.log(` Listening on: http://localhost:${PORT}`);
      console.log(`=================================`);
      console.log(` API endpoints:`);
      console.log(`   ➜ Health:   http://localhost:${PORT}/health`);
      console.log(`   ➜ Auth:     http://localhost:${PORT}/api/auth`);
      console.log(`   ➜ Users:    http://localhost:${PORT}/api/users`);
      console.log(`   ➜ Plans:    http://localhost:${PORT}/api/plans`);      //✅ ADD THIS
      console.log(`=================================`);
      console.log(` Database: ${mongoose.connection.readyState === 1 ? 'Connected ' : 'Disconnected ❌'}`);
      console.log(`=================================\n`);
    });

  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
};

startServer();