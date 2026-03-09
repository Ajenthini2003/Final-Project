// src/app/pages/DashboardPage.jsx  —  REAL DATA
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getServices } from "../../api";
import {
  CalendarIcon, ClockIcon, CheckCircleIcon, CreditCardIcon,
  WrenchIcon, BellIcon, UserIcon, MapPinIcon,
} from "@heroicons/react/24/outline";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const statusColors = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  "in-progress": "bg-purple-100 text-purple-700",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings = [], subscribedPlans = [], notifications = [] } = useApp();

  const [services, setServices]   = useState([]);
  const [loadingSvc, setLoadingSvc] = useState(true);

  // Fetch services for the "Popular Services" section
  useEffect(() => {
    getServices()
      .then(data => setServices(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setServices([]))
      .finally(() => setLoadingSvc(false));
  }, []);

  // Stats derived from real booking data
  const totalBookings     = bookings.length;
  const activeBookings    = bookings.filter(b => ["pending","confirmed","in-progress"].includes(b.status)).length;
  const completedServices = bookings.filter(b => b.status === "completed").length;
  const totalSpent        = bookings.reduce((s, b) => s + (b.price || b.totalAmount || 0), 0);

  const upcoming = bookings
    .filter(b => ["pending","confirmed"].includes(b.status))
    .sort((a, b) => new Date(a.scheduledDate || a.date) - new Date(b.scheduledDate || b.date))
    .slice(0, 3);

  const recent = bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible" variants={stagger}>

      {/* Welcome banner */}
      <motion.div variants={fade}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name || "User"}! 👋</h1>
          <p className="text-blue-100">Here's an overview of your service activity.</p>
        </div>
        <button onClick={() => navigate("/book-service")}
          className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
          Book New Service
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings",    value: totalBookings,              icon: <CalendarIcon className="w-6 h-6 text-white" />,    color: "bg-blue-500",   path: "/history" },
          { label: "Active Bookings",   value: activeBookings,             icon: <ClockIcon className="w-6 h-6 text-white" />,       color: "bg-green-500",  path: "/history" },
          { label: "Completed",         value: completedServices,          icon: <CheckCircleIcon className="w-6 h-6 text-white" />, color: "bg-purple-500", path: "/history?status=completed" },
          { label: "Total Spent",       value: `Rs. ${totalSpent.toLocaleString()}`, icon: <CreditCardIcon className="w-6 h-6 text-white" />, color: "bg-orange-500", path: "/payments" },
        ].map(s => (
          <motion.div key={s.label} variants={fade} whileHover={{ y: -4 }}
            onClick={() => navigate(s.path)}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 cursor-pointer hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active plans */}
      {subscribedPlans.length > 0 && (
        <motion.div variants={fade}
          className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white cursor-pointer"
          onClick={() => navigate("/plans")}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Active Plans</h2>
            <span className="text-sm underline opacity-80">View All →</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {subscribedPlans.slice(0, 3).map(p => (
              <div key={p._id} className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-purple-100 mt-1">Rs. {p.price?.toLocaleString()} / {p.duration}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming appointments */}
      <motion.div variants={fade} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          <button onClick={() => navigate("/history")} className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
        </div>
        {upcoming.length === 0 ? (
          <div className="text-center py-10">
            <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No upcoming appointments</p>
            <button onClick={() => navigate("/book-service")}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Book a Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(b => (
              <div key={b._id || b.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-gray-900 text-sm">{b.serviceId?.name || b.serviceName || "Service"}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>
                    {b.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{b.scheduledDate || b.date} {b.scheduledTime || b.time ? `at ${b.scheduledTime || b.time}` : ""}</span>
                  </div>
                  {(b.technicianId?.name || b.technicianName) && (
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>{b.technicianId?.name || b.technicianName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent bookings */}
      <motion.div variants={fade} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          <button onClick={() => navigate("/history")} className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
        </div>
        {recent.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <WrenchIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No bookings yet. Book your first service!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recent.map(b => (
              <div key={b._id || b.id}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/history")}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{b.serviceId?.name || b.serviceName || "Service"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.description || ""}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{b.scheduledDate || b.date}</span>
                  <span className="font-bold text-blue-600">Rs. {(b.price || b.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Popular services */}
      <motion.div variants={fade} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Popular Services</h2>
          <button onClick={() => navigate("/services")} className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingSvc
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse h-36" />
              ))
            : services.map(s => (
                <div key={s._id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-blue-100 rounded-xl"><WrenchIcon className="w-5 h-5 text-blue-600" /></div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.isActive !== false ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{s.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-blue-600">Rs. {(s.price || 0).toLocaleString()}</span>
                    <button
                      onClick={() => navigate("/book-service", { state: { selectedService: s } })}
                      disabled={s.isActive === false}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                      Book
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </motion.div>

      {/* Floating action button */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/book-service")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 z-30">
        <WrenchIcon className="w-6 h-6" />
      </motion.button>

    </motion.div>
  );
}
