// /frontend/src/app/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchIcon,
  CreditCardIcon,
  BellIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,  // ✅ Correct icon for email/mail
} from "@heroicons/react/24/outline";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { Link } from "react-router-dom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Stat Card Component for Users
const UserStatCard = ({ title, value, icon, color, link }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
    >
      <Link to={link} className="block">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </Link>
    </motion.div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <WrenchIcon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          service.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {service.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">Rs. {service.price}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

// Booking Card Component
const BookingCard = ({ booking }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-600',
    confirmed: 'bg-green-100 text-green-600',
    completed: 'bg-blue-100 text-blue-600',
    cancelled: 'bg-red-100 text-red-600'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
          <p className="text-sm text-gray-600 mt-1">{booking.description}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[booking.status]}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.date} at {booking.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>Technician: {booking.technicianName}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.address}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">Rs. {booking.price}</span>
        {booking.status === 'pending' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Cancel
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Main DashboardPage Component
const DashboardPage = () => {
  const { user } = useAuth();
  const { bookings = [], payments = [], subscribedPlans = [] } = useApp();
  const notificationContext = useContext(NotificationContext);
  const notifications = notificationContext?.notifications || [];
  
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedServices: 0,
    totalSpent: 0,
    activePlans: 0
  });

  // Mock data for demonstration (replace with real data from context)
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      serviceName: "AC Repair",
      description: "Split AC not cooling properly",
      date: "2026-03-15",
      time: "10:00 AM",
      status: "confirmed",
      technicianName: "John Doe",
      address: "123 Main St, Colombo",
      price: 2500
    },
    {
      id: 2,
      serviceName: "Plumbing Service",
      description: "Leaking kitchen sink",
      date: "2026-03-10",
      time: "2:00 PM",
      status: "completed",
      technicianName: "Jane Smith",
      address: "456 Park Ave, Colombo",
      price: 1800
    },
    {
      id: 3,
      serviceName: "Electrical Repair",
      description: "Power outlet not working",
      date: "2026-03-05",
      time: "11:30 AM",
      status: "completed",
      technicianName: "Mike Johnson",
      address: "789 Lake Rd, Colombo",
      price: 2200
    }
  ]);

  const [availableServices, setAvailableServices] = useState([
    {
      id: 1,
      name: "AC Repair & Service",
      description: "Professional AC repair, maintenance, and gas refill services",
      price: 1500,
      available: true
    },
    {
      id: 2,
      name: "Plumbing Services",
      description: "Expert plumbing repairs, leak fixes, and installations",
      price: 1200,
      available: true
    },
    {
      id: 3,
      name: "Electrical Repairs",
      description: "Licensed electricians for all electrical work",
      price: 1300,
      available: true
    },
    {
      id: 4,
      name: "Appliance Repair",
      description: "Fix washing machines, refrigerators, and other appliances",
      price: 1400,
      available: false
    }
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 1,
      serviceName: "AC Repair",
      date: "2026-03-20",
      time: "9:00 AM",
      technicianName: "John Doe"
    },
    {
      id: 2,
      serviceName: "Plumbing Service",
      date: "2026-03-22",
      time: "2:00 PM",
      technicianName: "Jane Smith"
    }
  ]);

  useEffect(() => {
    // Calculate user stats from real data
    setUserStats({
      totalBookings: recentBookings.length,
      activeBookings: recentBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
      completedServices: recentBookings.filter(b => b.status === 'completed').length,
      totalSpent: recentBookings.reduce((sum, b) => sum + b.price, 0),
      activePlans: subscribedPlans?.length || 0
    });
  }, [recentBookings, subscribedPlans]);

  return (
    <motion.div 
      className="p-6 space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-blue-100">
              Here's an overview of your service activity and upcoming appointments.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
          >
            Book New Service
          </motion.button>
        </div>
      </motion.div>

      {/* User Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <UserStatCard
          title="Total Bookings"
          value={userStats.totalBookings}
          icon={<CalendarIcon className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          link="/history"
        />
        <UserStatCard
          title="Active Bookings"
          value={userStats.activeBookings}
          icon={<ClockIcon className="w-6 h-6 text-white" />}
          color="bg-green-500"
          link="/book-service"
        />
        <UserStatCard
          title="Completed Services"
          value={userStats.completedServices}
          icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          link="/history"
        />
        <UserStatCard
          title="Total Spent"
          value={`Rs. ${userStats.totalSpent.toLocaleString()}`}
          icon={<CreditCardIcon className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          link="/payments"
        />
      </motion.div>

      {/* Active Plans Section */}
      {subscribedPlans && subscribedPlans.length > 0 && (
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Active Plans</h2>
            <Link to="/plans" className="text-white hover:text-purple-100 underline text-sm">
              View All Plans →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscribedPlans.slice(0, 3).map((plan) => (
              <div key={plan._id} className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-purple-100">Valid until: {plan.endDate || 'Ongoing'}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Appointments */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          <Link to="/book-service" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map((booking) => (
              <motion.div
                key={booking.id}
                whileHover={{ scale: 1.02 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Upcoming
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{booking.date} at {booking.time}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Technician: {booking.technicianName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
        )}
      </motion.div>

      {/* Recent Bookings */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          <Link to="/history" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All History →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentBookings.slice(0, 2).map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </motion.div>

      {/* Popular Services */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Popular Services</h2>
          <Link to="/services" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Services →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
          <Link to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification, index) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-600'
                }`}
              >
                <div className="flex items-start">
                  <BellIcon className={`w-5 h-5 mr-3 ${notification.read ? 'text-gray-400' : 'text-blue-600'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <WrenchIcon className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;