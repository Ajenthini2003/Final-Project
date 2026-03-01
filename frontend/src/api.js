// /frontend/src/api.js
import axios from "axios";
import { USE_MOCK_DATA, API_URL } from "./config";

// Mock data for development
const mockPlans = [
  {
    _id: "mock-plan-1",
    name: "Basic Care",
    description: "Essential coverage for occasional repairs",
    price: 999,
    duration: "month",
    features: ["2 service calls/month", "Basic diagnostics", "5% parts discount"]
  },
  {
    _id: "mock-plan-2",
    name: "Pro Protection",
    description: "Complete coverage for peace of mind",
    price: 1999,
    duration: "month",
    features: ["4 service calls/month", "Priority scheduling", "15% parts discount", "24/7 support"]
  },
  {
    _id: "mock-plan-3",
    name: "Family Shield",
    description: "Ultimate protection for your entire home",
    price: 2999,
    duration: "month",
    features: ["Unlimited calls", "Same-day service", "25% parts discount", "Priority support"]
  }
];

const mockServices = [
  {
    _id: "mock-srv-1",
    name: "AC Repair",
    description: "Professional AC repair and maintenance service.",
    price: 1500,
    duration: "2 hours",
    category: "ac",
    rating: 4.5,
    bookings: 150,
    features: ["Professional technician", "Quality guaranteed", "6-month warranty"],
    emergency: false,
    tags: ["AC", "Cooling", "Maintenance"]
  },
  {
    _id: "mock-srv-2",
    name: "Plumbing Service",
    description: "Expert plumbing repairs and installations.",
    price: 1200,
    duration: "1.5 hours",
    category: "plumbing",
    rating: 4.8,
    bookings: 200,
    features: ["Licensed plumber", "Quality parts", "Work guaranteed"],
    emergency: true,
    tags: ["Plumbing", "Leaks", "Drains"]
  },
  {
    _id: "mock-srv-3",
    name: "Electrical Repairs",
    description: "Licensed electricians for all your electrical needs.",
    price: 1300,
    duration: "1.5 hours",
    category: "electrical",
    rating: 4.7,
    bookings: 175,
    features: ["Licensed electrician", "Safety certified", "Warranty included"],
    emergency: true,
    tags: ["Electrical", "Wiring", "Safety"]
  },
  {
    _id: "mock-srv-4",
    name: "Appliance Repair",
    description: "Fix all home appliances.",
    price: 1400,
    duration: "2 hours",
    category: "appliance",
    rating: 4.6,
    bookings: 120,
    features: ["Expert technician", "Genuine parts", "Service warranty"],
    emergency: false,
    tags: ["Appliances", "Repair", "Maintenance"]
  },
  {
    _id: "mock-srv-5",
    name: "Carpentry Services",
    description: "Custom furniture, repairs, and installations.",
    price: 1600,
    duration: "3 hours",
    category: "carpentry",
    rating: 4.9,
    bookings: 85,
    features: ["Skilled carpenter", "Custom work", "Quality materials"],
    emergency: false,
    tags: ["Carpentry", "Furniture", "Woodwork"]
  }
];

// Add mock technicians data
const mockTechnicians = [
  {
    _id: "mock-tech-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "0771234561",
    role: "technician",
    specialization: "ac",
    experience: 5,
    rating: 4.8,
    availability: true,
    skills: ["AC Repair", "Maintenance", "Installation"],
    currentLoad: 2
  },
  {
    _id: "mock-tech-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "0771234562",
    role: "technician",
    specialization: "plumbing",
    experience: 8,
    rating: 4.9,
    availability: true,
    skills: ["Pipe Repair", "Installation", "Emergency Plumbing"],
    currentLoad: 1
  },
  {
    _id: "mock-tech-3",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    phone: "0771234563",
    role: "technician",
    specialization: "electrical",
    experience: 6,
    rating: 4.7,
    availability: false,
    skills: ["Wiring", "Circuit Repair", "Safety Inspection"],
    currentLoad: 3
  }
];

// Create axios instance with base URL
const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log API Base URL
console.log("API Base URL:", API_URL);

// Test the connection immediately (only if not using mock data)
if (!USE_MOCK_DATA) {
  API.get('/health')
    .then(() => console.log("Backend connection successful"))
    .catch(err => {
      console.error("Backend connection failed:", err.message);
      console.error("TIP: Make sure backend server is running on:", API_URL.replace('/api', ''));
      console.error("TIP: The full URL tried was:", API_URL + '/health');
      console.error("TIP: Your backend should have an endpoint at: /api/health or /health");
    });
} else {
  console.log("Using MOCK DATA mode - backend connection not required");
}

// Request interceptor - Add token to headers
API.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token added to request");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
API.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    if (USE_MOCK_DATA) {
      console.log("Mock mode - suppressing error");
      return Promise.resolve({ data: [] });
    }
    
    if (error.response) {
      console.error(`[API Error] ${error.response.status}: ${error.config?.url}`, error.response.data);
      
      if (error.response.status === 401) {
        console.log("Unauthorized - clearing localStorage and redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("[API Error] No response received from server");
      console.error("URL:", error.config?.url);
      console.error("BaseURL:", error.config?.baseURL);
      console.error("Full URL:", error.config?.baseURL + error.config?.url);
      console.error("Error:", error.message);
      
      if (error.message.includes('Network Error')) {
        console.error("TIP: Make sure backend server is running");
        console.error("TIP: Check if backend is running on:", API_URL.replace('/api', ''));
        console.error("TIP: Verify CORS is enabled on backend");
      }
    } else {
      console.error("[API Error] Request setup error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper to check if we should use mock data
const shouldUseMock = () => USE_MOCK_DATA;

// ============ AUTH API ============
export const loginUser = async (credentials) => {
  if (shouldUseMock()) {
    console.log("Mock login:", credentials);
    return {
      user: {
        _id: "mock-user-1",
        name: credentials.email?.split('@')[0] || "Demo User",
        email: credentials.email || "demo@example.com",
        role: "user",
        phone: "0771234567"
      },
      token: "mock-token-" + Date.now()
    };
  }
  
  try {
    console.log("Logging in user:", credentials.email);
    const response = await API.post("/auth/login", credentials);
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const signupUser = async (userData) => {
  if (shouldUseMock()) {
    console.log("Mock signup:", userData);
    return {
      user: {
        _id: "mock-user-" + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "user"
      },
      token: "mock-token-" + Date.now()
    };
  }
  
  try {
    console.log("Signing up user:", userData.email);
    return await API.post("/auth/signup", userData);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  if (shouldUseMock()) {
    console.log("Mock logout");
    return { success: true };
  }
  
  try {
    console.log("Logging out user");
    return await API.post("/auth/logout");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  if (shouldUseMock()) {
    console.log("Mock get current user");
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  
  try {
    console.log("Getting current user");
    return await API.get("/auth/me");
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

// ============ PLANS API ============
export const getRepairPlans = async () => {
  if (shouldUseMock()) {
    console.log("Returning mock plans");
    return mockPlans;
  }
  
  try {
    console.log("Fetching all repair plans...");
    const response = await API.get("/plans");
    console.log("Plans fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

export const addRepairPlan = async (planData) => {
  if (shouldUseMock()) {
    console.log("Mock add plan:", planData);
    return { ...planData, _id: 'mock-plan-' + Date.now() };
  }
  
  try {
    console.log("Adding new plan:", planData.name);
    const response = await API.post("/plans", planData);
    console.log("Plan added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding repair plan:", error);
    throw error;
  }
};

// ============ SERVICES API ============
export const getServices = async () => {
  if (shouldUseMock()) {
    console.log("Returning mock services");
    return mockServices;
  }
  
  try {
    console.log("Fetching all services...");
    return await API.get("/services");
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// ============ BOOKINGS API ============
export const getBookings = async (userId) => {
  if (shouldUseMock()) {
    console.log("Returning mock bookings for user:", userId);
    return [];
  }
  
  try {
    console.log(`Fetching bookings for user: ${userId}`);
    return await API.get(`/bookings/user/${userId}`);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  if (shouldUseMock()) {
    console.log("Mock create booking:", bookingData);
    return { ...bookingData, id: 'mock-bk-' + Date.now() };
  }
  
  try {
    console.log("Creating new booking");
    return await API.post("/bookings", bookingData);
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// ============ TECHNICIANS API ============
export const getTechnicians = async (filters = {}) => {
  if (shouldUseMock()) {
    console.log("Returning mock technicians with filters:", filters);
    let filteredTechs = [...mockTechnicians];
    
    if (filters.specialization) {
      filteredTechs = filteredTechs.filter(t => t.specialization === filters.specialization);
    }
    if (filters.availability !== undefined) {
      filteredTechs = filteredTechs.filter(t => t.availability === filters.availability);
    }
    
    return filteredTechs;
  }
  
  try {
    console.log("Fetching technicians...");
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/technicians${queryParams ? `?${queryParams}` : ''}`;
    return await API.get(url);
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};

export const getTechnicianById = async (id) => {
  if (shouldUseMock()) {
    console.log("Fetching mock technician by ID:", id);
    const technician = mockTechnicians.find(t => t._id === id);
    if (!technician) {
      throw new Error("Technician not found");
    }
    return technician;
  }
  
  try {
    console.log(`Fetching technician ${id}...`);
    return await API.get(`/technicians/${id}`);
  } catch (error) {
    console.error(`Error fetching technician ${id}:`, error);
    throw error;
  }
};

export const createTechnician = async (technicianData) => {
  if (shouldUseMock()) {
    console.log("Mock create technician:", technicianData);
    return {
      ...technicianData,
      _id: 'mock-tech-' + Date.now(),
      rating: 0,
      currentLoad: 0
    };
  }
  
  try {
    console.log("Creating new technician:", technicianData.name);
    return await API.post("/technicians", technicianData);
  } catch (error) {
    console.error("Error creating technician:", error);
    throw error;
  }
};

export const updateTechnician = async (id, technicianData) => {
  if (shouldUseMock()) {
    console.log("Mock update technician:", id, technicianData);
    return {
      ...technicianData,
      _id: id
    };
  }
  
  try {
    console.log(`Updating technician ${id}...`);
    return await API.put(`/technicians/${id}`, technicianData);
  } catch (error) {
    console.error(`Error updating technician ${id}:`, error);
    throw error;
  }
};

export const deleteTechnician = async (id) => {
  if (shouldUseMock()) {
    console.log("Mock delete technician:", id);
    return { success: true, message: "Technician deleted successfully" };
  }
  
  try {
    console.log(`Deleting technician ${id}...`);
    return await API.delete(`/technicians/${id}`);
  } catch (error) {
    console.error(`Error deleting technician ${id}:`, error);
    throw error;
  }
};

export const updateTechnicianAvailability = async (id, availability) => {
  if (shouldUseMock()) {
    console.log("Mock update technician availability:", id, availability);
    return {
      _id: id,
      availability: availability
    };
  }
  
  try {
    console.log(`Updating technician ${id} availability to:`, availability);
    return await API.patch(`/technicians/${id}/availability`, { availability });
  } catch (error) {
    console.error(`Error updating technician availability ${id}:`, error);
    throw error;
  }
};

export const getTechnicianSchedule = async (id, date) => {
  if (shouldUseMock()) {
    console.log("Mock get technician schedule:", id, date);
    return {
      technicianId: id,
      date: date || new Date().toISOString().split('T')[0],
      bookings: []
    };
  }
  
  try {
    console.log(`Fetching schedule for technician ${id} on ${date}...`);
    const queryParams = date ? `?date=${date}` : '';
    return await API.get(`/technicians/${id}/schedule${queryParams}`);
  } catch (error) {
    console.error(`Error fetching technician schedule ${id}:`, error);
    throw error;
  }
};

export default API;