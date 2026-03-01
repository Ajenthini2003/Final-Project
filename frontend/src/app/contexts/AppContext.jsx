// src/app/contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";


// import { plansApi } from "../../api/endpoints/plans";
// import { usersApi } from "../../api/endpoints/users";
// import { bookingsApi } from "../../api/endpoints/bookings";
// import { paymentsApi } from "../../api/endpoints/payments";

const AppContext = createContext();

// Mock plans data
const MOCK_PLANS = [
  { 
    _id: "plan1", 
    name: "Basic Plan", 
    price: 999, 
    description: "Basic repair coverage for essential home maintenance", 
    features: [
      "AC Repair & Service", 
      "Plumbing Repairs", 
      "Electrical Fixes",
      "Basic Appliance Repair",
      "24/7 Customer Support"
    ], 
    duration: "Monthly",
    popular: false,
    savings: "Save 15%"
  },
  { 
    _id: "plan2", 
    name: "Premium Plan", 
    price: 1999, 
    description: "Premium repair coverage with priority service", 
    features: [
      "All Basic Plan Features",
      "All Appliance Repairs",
      "Priority Scheduling",
      "Emergency Services",
      "Annual Maintenance Check",
      "5% Off All Services"
    ], 
    duration: "Monthly",
    popular: true,
    savings: "Save 25%"
  },
  { 
    _id: "plan3", 
    name: "Family Plan", 
    price: 2999, 
    description: "Complete family coverage for your entire home", 
    features: [
      "All Premium Plan Features",
      "Unlimited Service Calls",
      "Multi-home Coverage",
      "Dedicated Account Manager",
      "Extended Warranties",
      "10% Off All Services",
      "Free Annual Inspection"
    ], 
    duration: "Monthly",
    popular: false,
    savings: "Save 35%"
  },
  { 
    _id: "plan4", 
    name: "Annual Basic", 
    price: 9990, 
    description: "Yearly basic plan at a discounted rate", 
    features: [
      "All Basic Plan Features",
      "2 Months Free",
      "Priority Support",
      "Quarterly Maintenance"
    ], 
    duration: "Yearly",
    popular: false,
    savings: "Save 20%"
  },
  { 
    _id: "plan5", 
    name: "Annual Premium", 
    price: 19990, 
    description: "Yearly premium plan with maximum savings", 
    features: [
      "All Premium Plan Features",
      "3 Months Free",
      "VIP Priority Support",
      "Bi-monthly Maintenance",
      "Free Emergency Calls"
    ], 
    duration: "Yearly",
    popular: false,
    savings: "Save 30%"
  }
];

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "booking-1",
    userId: "user1",
    serviceId: "1",
    serviceName: "Electrical Wiring Repair",
    date: "2024-02-20",
    time: "10:00 AM",
    status: "completed",
    price: 2500,
    technician: "John Doe",
    rating: 4.5
  },
  {
    id: "booking-2",
    userId: "user2",
    serviceId: "4",
    serviceName: "Leakage Repair",
    date: "2024-02-22",
    time: "2:00 PM",
    status: "upcoming",
    price: 2000,
    technician: "Jane Smith"
  },
  {
    id: "booking-3",
    userId: "user1",
    serviceId: "10",
    serviceName: "AC Gas Refill",
    date: "2024-02-25",
    time: "11:30 AM",
    status: "pending",
    price: 4000,
    technician: "Mike Johnson"
  }
];

// Mock payments data
const MOCK_PAYMENTS = [
  {
    id: "payment-1",
    userId: "user1",
    amount: 2500,
    date: "2024-02-20",
    method: "Credit Card",
    status: "paid",
    description: "Electrical Wiring Repair"
  },
  {
    id: "payment-2",
    userId: "user1",
    amount: 999,
    date: "2024-02-01",
    method: "Bank Transfer",
    status: "paid",
    description: "Basic Plan Subscription"
  },
  {
    id: "payment-3",
    userId: "user2",
    amount: 2000,
    date: "2024-02-22",
    method: "Cash",
    status: "pending",
    description: "Leakage Repair"
  }
];

export function AppProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [subscribedPlans, setSubscribedPlans] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [plansError, setPlansError] = useState(null);

  const plansFetched = useRef(false);
  const subscriptionsFetched = useRef(false);

  // Fetch plans
  const fetchPlans = useCallback(async () => {
    if (plansFetched.current) return;
    
    setLoading(true);
    
    try {
      console.log(" Loading plans from mock data");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set mock plans
      setPlans(MOCK_PLANS);
      setPlansError(null);
      
      console.log(" Plans loaded successfully");
    } catch (err) {
      console.error("Failed to load plans:", err);
      setPlansError(500);
      // Fallback plans
      setPlans(MOCK_PLANS.slice(0, 2));
    } finally {
      setLoading(false);
      plansFetched.current = true;
    }
  }, []);

  // Fetch user subscriptions
  const fetchSubscriptions = useCallback(async () => {
    if (!user?._id || subscriptionsFetched.current) return;
    
    try {
      console.log(` Loading subscriptions for user: ${user._id}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo users, give them some subscribed plans
      if (user._id === "user-demo" || user.email === "demo@fixmate.lk") {
        // Give demo user the Basic Plan as subscribed
        setSubscribedPlans([MOCK_PLANS[0]]);
      } else {
        // For regular users, start with empty subscriptions
        setSubscribedPlans([]);
      }
      
      console.log(" Subscriptions loaded successfully");
    } catch (err) {
      console.error("Failed to load subscriptions:", err);
      setSubscribedPlans([]);
    } finally {
      subscriptionsFetched.current = true;
    }
  }, [user]);

  // Load mock bookings and payments
  const loadUserData = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      console.log(` Loading user data for: ${user._id}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Filter mock data for the current user
      const userBookings = MOCK_BOOKINGS.filter(b => b.userId === user._id);
      const userPayments = MOCK_PAYMENTS.filter(p => p.userId === user._id);
      
      setBookings(userBookings);
      setPayments(userPayments);
      
      console.log(" User data loaded successfully");
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  }, [user]);

  // Trigger fetches based on auth state
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchSubscriptions();
      loadUserData();
    } else {
      setSubscribedPlans([]);
      setBookings([]);
      setPayments([]);
      subscriptionsFetched.current = false;
    }
  }, [isAuthenticated, user, fetchSubscriptions, loadUserData]);

  const subscribeToPlan = useCallback(async (planId) => {
    if (!user?._id) return;
    
    try {
      console.log(` Subscribing to plan: ${planId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const plan = plans.find(p => p._id === planId || p.id === planId);
      
      if (plan) {
        // Check if already subscribed
        const alreadySubscribed = subscribedPlans.some(p => p._id === planId || p.id === planId);
        
        if (!alreadySubscribed) {
          setSubscribedPlans(prev => [...prev, plan]);
          addNotification(`Successfully subscribed to ${plan.name}!`, "subscription");
          
          // Add a payment record for the subscription
          const payment = {
            id: `payment-${Date.now()}`,
            userId: user._id,
            amount: plan.price,
            date: new Date().toISOString().split('T')[0],
            method: "Credit Card",
            status: "paid",
            description: `${plan.name} Subscription`
          };
          
          setPayments(prev => [...prev, payment]);
          
          console.log(` Subscribed to ${plan.name}`);
        } else {
          addNotification(`You're already subscribed to ${plan.name}`, "info");
        }
      }
    } catch (err) {
      console.error("Subscription failed:", err);
      addNotification("Subscription failed. Please try again.", "error");
    }
  }, [user, plans, subscribedPlans]);

  const unsubscribeFromPlan = useCallback(async (planId) => {
    if (!user?._id) return;
    
    try {
      console.log(` Unsubscribing from plan: ${planId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const plan = plans.find(p => p._id === planId || p.id === planId);
      
      if (plan) {
        setSubscribedPlans(prev => prev.filter(p => p._id !== planId && p.id !== planId));
        addNotification(`Unsubscribed from ${plan.name}`, "subscription");
        console.log(` Unsubscribed from ${plan.name}`);
      }
    } catch (err) {
      console.error("Unsubscription failed:", err);
      addNotification("Unsubscription failed. Please try again.", "error");
    }
  }, [user, plans]);

  const addBooking = useCallback(async (bookingData) => {
    if (!user?._id) return;
    
    try {
      console.log(" Creating new booking:", bookingData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newBooking = { 
        ...bookingData, 
        id: `booking-${Date.now()}`,
        userId: user._id,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      setBookings(prev => [...prev, newBooking]);
      addNotification(`Service booked successfully for ${bookingData.date} at ${bookingData.time}`, "service");
      
      console.log(" Booking created:", newBooking);
      
      return newBooking;
    } catch (err) {
      console.error("Failed to create booking:", err);
      addNotification("Failed to create booking. Please try again.", "error");
      throw err;
    }
  }, [user]);

  const updateBooking = useCallback(async (id, updates) => {
    try {
      console.log(` Updating booking: ${id}`, updates);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBookings(prev => prev.map(b => 
        b.id === id ? { ...b, ...updates } : b
      ));
      
      addNotification("Booking updated successfully", "info");
      console.log(` Booking updated: ${id}`);
    } catch (err) {
      console.error("Failed to update booking:", err);
      addNotification("Failed to update booking", "error");
    }
  }, []);

  const cancelBooking = useCallback(async (id) => {
    try {
      console.log(` Cancelling booking: ${id}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBookings(prev => prev.map(b => 
        b.id === id ? { ...b, status: "cancelled" } : b
      ));
      
      addNotification("Booking cancelled successfully", "info");
      console.log(` Booking cancelled: ${id}`);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      addNotification("Failed to cancel booking", "error");
    }
  }, []);

  const addPayment = useCallback(async (paymentData) => {
    if (!user?._id) return;
    
    try {
      console.log(" Processing payment:", paymentData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPayment = { 
        ...paymentData, 
        id: `payment-${Date.now()}`,
        userId: user._id,
        date: new Date().toISOString().split('T')[0],
        status: "paid"
      };
      
      setPayments(prev => [...prev, newPayment]);
      
      const amountStr = paymentData.amount?.toLocaleString?.() || paymentData.amount;
      addNotification(`Payment of Rs. ${amountStr} successful!`, "payment");
      
      console.log("🟢 Payment processed:", newPayment);
      
      return newPayment;
    } catch (err) {
      console.error("Payment failed:", err);
      addNotification("Payment failed. Please try again.", "error");
      throw err;
    }
  }, [user]);

  const addNotification = useCallback((message, type = "info") => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      userId: user?._id,
      message,
      date: new Date().toISOString(),
      read: false,
      type,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, [user]);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    user,
    loading,
    plans,
    subscribedPlans,
    subscribeToPlan,
    unsubscribeFromPlan,
    bookings,
    addBooking,
    updateBooking,
    cancelBooking,
    payments,
    addPayment,
    notifications,
    addNotification,
    markNotificationRead,
    clearAllNotifications,
    plansError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}