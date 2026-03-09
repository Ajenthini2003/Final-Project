// src/app/contexts/AppContext.jsx  —  ALL REAL API CALLS
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getRepairPlans, getMyPlans,
  getMyBookings, createBooking as apiCreateBooking,
  updateBooking as apiUpdateBooking, cancelBooking as apiCancelBooking,
  getMyPayments,
  subscribeToPlanAPI, unsubscribeFromPlanAPI,
} from "../../api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading]               = useState(false);
  const [plans, setPlans]                   = useState([]);
  const [subscribedPlans, setSubscribedPlans] = useState([]);
  const [bookings, setBookings]             = useState([]);
  const [payments, setPayments]             = useState([]);
  const [notifications, setNotifications]   = useState([]);
  const [plansError, setPlansError]         = useState(null);

  // ── Load plans (public) ─────────────────────────────────────────────────
  const fetchPlans = useCallback(async () => {
    try {
      const data = await getRepairPlans();
      setPlans(Array.isArray(data) ? data : []);
      setPlansError(null);
    } catch {
      setPlansError(500);
      setPlans([]);
    }
  }, []);

  // ── Load user's subscriptions ───────────────────────────────────────────
  const fetchSubscriptions = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await getMyPlans();
      setSubscribedPlans(Array.isArray(data) ? data : []);
    } catch {
      setSubscribedPlans([]);
    }
  }, [user]);

  // ── Load user's bookings ────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  }, [user]);

  // ── Load user's payments ────────────────────────────────────────────────
  const fetchPayments = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await getMyPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setPayments([]);
    }
  }, [user]);

  // ── Trigger on auth change ─────────────────────────────────────────────
  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      setLoading(true);
      Promise.all([fetchSubscriptions(), fetchBookings(), fetchPayments()])
        .finally(() => setLoading(false));
    } else {
      setSubscribedPlans([]);
      setBookings([]);
      setPayments([]);
    }
  }, [isAuthenticated, user?._id]);

  // ── Subscribe to plan ──────────────────────────────────────────────────
  const subscribeToPlan = useCallback(async (planId) => {
    try {
      await subscribeToPlanAPI(planId);
      await fetchSubscriptions();
      await fetchPayments();
      const plan = plans.find(p => p._id === planId || p.id === planId);
      addNotification(`Successfully subscribed to ${plan?.name || "plan"}!`, "subscription");
    } catch (err) {
      addNotification(err?.response?.data?.message || "Subscription failed. Please try again.", "error");
      throw err;
    }
  }, [plans, fetchSubscriptions, fetchPayments]);

  // ── Unsubscribe from plan ──────────────────────────────────────────────
  const unsubscribeFromPlan = useCallback(async (planId) => {
    try {
      await unsubscribeFromPlanAPI(planId);
      await fetchSubscriptions();
      const plan = plans.find(p => p._id === planId || p.id === planId);
      addNotification(`Unsubscribed from ${plan?.name || "plan"}`, "subscription");
    } catch (err) {
      addNotification(err?.response?.data?.message || "Unsubscription failed.", "error");
      throw err;
    }
  }, [plans, fetchSubscriptions]);

  // ── Create booking ─────────────────────────────────────────────────────
  const addBooking = useCallback(async (bookingData) => {
    try {
      const newBooking = await apiCreateBooking(bookingData);
      setBookings(prev => [newBooking, ...prev]);
      addNotification(`Service booked successfully for ${bookingData.date} at ${bookingData.time}`, "service");
      return newBooking;
    } catch (err) {
      addNotification(err?.response?.data?.message || "Failed to create booking. Please try again.", "error");
      throw err;
    }
  }, []);

  // ── Update booking ─────────────────────────────────────────────────────
  const updateBooking = useCallback(async (id, updates) => {
    try {
      const updated = await apiUpdateBooking(id, updates);
      setBookings(prev => prev.map(b => (b._id === id || b.id === id) ? updated : b));
      addNotification("Booking updated successfully", "info");
    } catch (err) {
      addNotification("Failed to update booking", "error");
      throw err;
    }
  }, []);

  // ── Cancel booking ─────────────────────────────────────────────────────
  const cancelBooking = useCallback(async (id) => {
    try {
      const updated = await apiCancelBooking(id);
      setBookings(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, status: "cancelled" } : b));
      addNotification("Booking cancelled successfully", "info");
    } catch (err) {
      addNotification(err?.response?.data?.message || "Failed to cancel booking", "error");
      throw err;
    }
  }, []);

  // ── Notifications (local UI only) ─────────────────────────────────────
  const addNotification = useCallback((message, type = "info") => {
    const n = {
      id: `notif-${Date.now()}`,
      userId: user?._id,
      message,
      date: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications(prev => [n, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== n.id)), 6000);
  }, [user]);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearAllNotifications = useCallback(() => setNotifications([]), []);

  // refresh helpers exposed for pages that need manual reload
  const refreshBookings = fetchBookings;
  const refreshPayments = fetchPayments;

  return (
    <AppContext.Provider value={{
      loading,
      plans, plansError,
      subscribedPlans, subscribeToPlan, unsubscribeFromPlan,
      bookings, addBooking, updateBooking, cancelBooking, refreshBookings,
      payments, refreshPayments,
      notifications, addNotification, markNotificationRead, clearAllNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
