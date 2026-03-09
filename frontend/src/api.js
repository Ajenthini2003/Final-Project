// src/api.js  —  ALL REAL API CALLS, NO MOCK DATA
import axios from "axios";
import { API_URL } from "./config";

const API = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap response.data automatically; handle 401
API.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────
export const loginUser        = (data)    => API.post("/auth/login", data);
export const signupUser       = (data)    => API.post("/auth/signup", data);
export const logoutUser       = ()        => API.post("/auth/logout");
export const getCurrentUser   = ()        => API.get("/auth/me");
export const updateMyProfile  = (data)    => API.put("/auth/profile", data);

// ── PLANS ─────────────────────────────────────────────────────────────────
export const getRepairPlans   = ()        => API.get("/plans");
export const getMyPlans       = ()        => API.get("/plans/my-plans");
export const createPlan       = (data)    => API.post("/plans", data);
export const updatePlan       = (id, data)=> API.put(`/plans/${id}`, data);
export const deletePlan       = (id)      => API.delete(`/plans/${id}`);
export const subscribeToPlanAPI   = (id)  => API.post(`/plans/${id}/subscribe`);
export const unsubscribeFromPlanAPI = (id)=> API.post(`/plans/${id}/unsubscribe`);

// ── SERVICES ──────────────────────────────────────────────────────────────
export const getServices          = ()          => API.get("/services");
export const getFeaturedServices  = ()          => API.get("/services").then(data => Array.isArray(data) ? data.filter(s => s.isActive !== false).slice(0, 6) : []);
export const getServiceById       = (id)        => API.get(`/services/${id}`);
export const getServicesByCategory= (cat)       => API.get(`/services/category/${cat}`);
export const createService        = (data)      => API.post("/services", data);
export const updateService        = (id, data)  => API.put(`/services/${id}`, data);
export const deleteService        = (id)        => API.delete(`/services/${id}`);

// ── BOOKINGS ──────────────────────────────────────────────────────────────
export const getMyBookings    = ()            => API.get("/bookings/my");
export const getAllBookings    = ()            => API.get("/bookings");
export const getBookingById   = (id)          => API.get(`/bookings/${id}`);
export const createBooking    = (data)        => API.post("/bookings", data);
export const updateBooking    = (id, data)    => API.put(`/bookings/${id}`, data);
export const cancelBooking    = (id)          => API.put(`/bookings/${id}/cancel`);
export const deleteBooking    = (id)          => API.delete(`/bookings/${id}`);

// ── PAYMENTS ─────────────────────────────────────────────────────────────
export const getMyPayments    = ()        => API.get("/payments/my");
export const getAllPayments    = ()        => API.get("/payments");

// ── TECHNICIANS ───────────────────────────────────────────────────────────
export const getTechnicians       = (filters = {}) => {
  const q = new URLSearchParams(filters).toString();
  return API.get(`/technicians${q ? `?${q}` : ""}`);
};
export const getTechnicianById        = (id)        => API.get(`/technicians/${id}`);
export const createTechnician         = (data)      => API.post("/technicians", data);
export const updateTechnician         = (id, data)  => API.put(`/technicians/${id}`, data);
export const deleteTechnician         = (id)        => API.delete(`/technicians/${id}`);
export const updateTechnicianAvailability = (id, av)=> API.patch(`/technicians/${id}/availability`, { availability: av });

// ── USERS (admin) ─────────────────────────────────────────────────────────
export const getAllUsers       = ()            => API.get("/users");
export const getUserById       = (id)          => API.get(`/users/${id}`);
export const updateUser        = (id, data)    => API.put(`/users/${id}`, data);
export const deleteUser        = (id)          => API.delete(`/users/${id}`);

// ── ADMIN STATS ───────────────────────────────────────────────────────────
export const getAdminStats          = ()  => API.get("/admin/stats");
export const getAdminRecentBookings = ()  => API.get("/admin/recent-bookings");

export default API;
