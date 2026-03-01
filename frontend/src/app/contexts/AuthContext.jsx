// src/app/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        
        if (token && storedUser) {
          // Verify token with backend
          try {
            const response = await api.get("/auth/verify");
            if (response.data.valid) {
              setUser(JSON.parse(storedUser));
            } else {
              // Token invalid, clear storage
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("user");
            }
          } catch (error) {
            // Token verification failed, but we'll still set the user from storage
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async ({ email, password, remember = false }) => {
    setLoading(true);
    try {
      console.log("Auth: Attempting login for", email);
      
      // Validate inputs
      if (!email?.trim() || !password?.trim()) {
        throw new Error("Email and password are required");
      }

      // Make API call
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      // The response data is the user object directly
      const userData = response.data;

      // Check if we got a valid user object with token
      if (!userData || !userData.token) {
        throw new Error("Invalid response from server");
      }

      // Store in appropriate storage based on remember me
      if (remember) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      // Update state
      setUser(userData);

      toast.success(`Welcome back, ${userData.name || 'User'}!`);
      return { success: true, data: userData };

    } catch (error) {
      console.error("Auth: Login error:", error);
      
      let message = "Login failed";
      if (error.response) {
        message = error.response.data?.message || "Server error";
      } else if (error.request) {
        message = "Unable to connect to server. Please check your connection.";
      } else {
        message = error.message || "Login failed";
      }

      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    try {
      console.log("Auth: Attempting signup for", userData.email);

      // Validate inputs
      if (!userData?.email?.trim() || !userData?.password?.trim() || !userData?.name?.trim()) {
        throw new Error("Name, email, and password are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password strength
      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Validate phone
      if (!userData.phone?.trim()) {
        throw new Error("Phone number is required");
      }

      // Make API call
      const response = await api.post("/auth/signup", {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone.trim(),
        password: userData.password,
      });

      // The response data is the user object directly
      const newUser = response.data;

      // Check if we got a valid user object with token
      if (!newUser || !newUser.token) {
        throw new Error("Invalid response from server");
      }

      // Store in localStorage
      localStorage.setItem("token", newUser.token);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Update state
      setUser(newUser);

      toast.success("Account created successfully!");
      return { success: true, data: newUser };

    } catch (error) {
      console.error("Auth: Signup error:", error);

      let message = "Signup failed";
      if (error.response) {
        message = error.response.data?.message || "Server error";
        
        if (error.response.status === 400) {
          if (error.response.data?.missing) {
            const missingFields = Object.entries(error.response.data.missing)
              .filter(([_, isMissing]) => isMissing)
              .map(([field]) => field)
              .join(', ');
            message = `Missing required fields: ${missingFields}`;
          } else {
            message = error.response.data?.message || "Invalid input data";
          }
        } else if (error.response.status === 409) {
          message = "User with this email already exists";
        }
      } else if (error.request) {
        message = "Unable to connect to server. Please check your connection.";
      } else {
        message = error.message || "Signup failed";
      }

      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        await api.post("/auth/logout").catch(() => {});
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear all storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Update state
      setUser(null);

      toast.success("Logged out successfully");
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put("/auth/profile", profileData);
      
      const updatedUser = response.data;

      if (!updatedUser) {
        throw new Error("Profile update failed");
      }

      // Update stored user
      const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);

      toast.success("Profile updated successfully");
      return { success: true, data: updatedUser };

    } catch (error) {
      console.error("Profile update error:", error);

      let message = "Profile update failed";
      if (error.response) {
        message = error.response.data?.message || "Server error";
      } else if (error.request) {
        message = "Unable to connect to server";
      } else {
        message = error.message;
      }

      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    initialLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;