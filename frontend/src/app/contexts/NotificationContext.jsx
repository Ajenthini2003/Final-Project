// /frontend/src/app/contexts/NotificationContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";

// Create and export the context
export const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage or API on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        updateUnreadCount(parsed);
      } catch (error) {
        console.error("Error parsing notifications:", error);
        initializeSampleNotifications();
      }
    } else {
      initializeSampleNotifications();
    }
  }, []);

  const initializeSampleNotifications = () => {
    const sampleNotifications = [
      {
        id: "notif-1",
        title: "Welcome to FixMaster!",
        message: "Thank you for joining our platform. Start exploring our services.",
        createdAt: new Date().toISOString(),
        read: false,
        type: "welcome"
      },
      {
        id: "notif-2",
        title: "Special Offer",
        message: "Get 20% off on your first service booking. Use code: FIRST20",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        read: false,
        type: "promo"
      },
      {
        id: "notif-3",
        title: "Maintenance Tips",
        message: "Check out our blog for AC maintenance tips to keep your unit running efficiently.",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        type: "info"
      }
    ];
    setNotifications(sampleNotifications);
    updateUnreadCount(sampleNotifications);
  };

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    updateUnreadCount(notifications);
  }, [notifications]);

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};