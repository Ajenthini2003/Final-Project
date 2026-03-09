// src/app/pages/technician/TechnicianDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon,
  WrenchIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Same animation variants as DashboardPage
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

// Same UserStatCard shape as DashboardPage
const StatCard = ({ title, value, icon, color, onClick }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </motion.div>
);

const statusColors = {
  pending:       'bg-yellow-100 text-yellow-600',
  confirmed:     'bg-green-100 text-green-600',
  'in-progress': 'bg-blue-100 text-blue-600',
  completed:     'bg-purple-100 text-purple-600',
  cancelled:     'bg-red-100 text-red-600',
};

// Same BookingCard shape as DashboardPage
const JobCard = ({ booking, onUpdateStatus }) => {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/bookings/${booking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      onUpdateStatus(booking._id, newStatus);
      toast.success(`Job marked as ${newStatus.replace('-', ' ')}`);
    } catch {
      toast.error('Failed to update job status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
          <p className="text-sm text-gray-500 mt-0.5">#{booking._id?.slice(-6)?.toUpperCase()}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
          {booking.status?.replace('-', ' ')}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.date} at {booking.time}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{booking.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>{booking.phone}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">Rs. {Number(booking.price || 0).toLocaleString()}</span>
        <div className="flex gap-2">
          {booking.status === 'confirmed' && (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleUpdate('in-progress')}
              disabled={updating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
            >
              {updating ? 'Updating...' : 'Start Job'}
            </motion.button>
          )}
          {booking.status === 'in-progress' && (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleUpdate('completed')}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-60"
            >
              {updating ? 'Updating...' : 'Mark Complete'}
            </motion.button>
          )}
          {booking.status === 'completed' && (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircleIcon className="w-4 h-4" /> Done
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(user?.availability !== false);

  const fetchBookings = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const mine = (Array.isArray(data) ? data : []).filter(
        b => b.technicianId === user._id || b.technicianId?._id === user._id
      );
      setBookings(mine);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleUpdateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
  };

  const toggleAvailability = async () => {
    const newVal = !availability;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await fetch(`${API_URL}/technicians/${user._id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ availability: newVal }),
      });
      setAvailability(newVal);
      toast.success(newVal ? 'You are now available' : 'You are now unavailable');
    } catch { toast.error('Could not update availability'); }
  };

  const activeJobs    = bookings.filter(b => ['confirmed', 'in-progress'].includes(b.status));
  const completedJobs = bookings.filter(b => b.status === 'completed');
  const pendingJobs   = bookings.filter(b => b.status === 'pending');
  const totalEarnings = completedJobs.reduce((s, b) => s + (Number(b.price) || 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      className="p-6 space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Banner — same gradient style as DashboardPage */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-blue-100">
              {user?.specialization
                ? `${user.specialization.charAt(0).toUpperCase() + user.specialization.slice(1)} Specialist`
                : 'Welcome to your technician panel'}
              {user?.experience > 0 ? ` · ${user.experience} years experience` : ''}
            </p>
            {user?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {user.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {user.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                    +{user.skills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Availability toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
              availability
                ? 'bg-white text-blue-600 hover:bg-blue-50'
                : 'bg-white bg-opacity-20 text-white border border-white border-opacity-40 hover:bg-white hover:bg-opacity-30'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${availability ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            {availability ? 'Available for Jobs' : 'Set as Available'}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid — same 4-column layout as DashboardPage */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={<CalendarIcon className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          onClick={() => navigate('/technician/bookings')}
        />
        <StatCard
          title="Active Jobs"
          value={activeJobs.length}
          icon={<ClockIcon className="w-6 h-6 text-white" />}
          color="bg-green-500"
          onClick={() => navigate('/technician/active')}
        />
        <StatCard
          title="Completed"
          value={completedJobs.length}
          icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs. ${totalEarnings.toLocaleString()}`}
          icon={<CreditCardIcon className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          onClick={() => navigate('/technician/earnings')}
        />
      </motion.div>

      {/* Active / In-Progress Jobs */}
      {!loading && activeJobs.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              Active Jobs ({activeJobs.length})
            </h2>
            <Link to="/technician/active" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeJobs.map(b => (
              <JobCard key={b._id} booking={b} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Pending Jobs */}
      {!loading && pendingJobs.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-yellow-500" />
            Pending Confirmation ({pendingJobs.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingJobs.map(b => (
              <JobCard key={b._id} booking={b} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Completed */}
      {!loading && completedJobs.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Completed Jobs</h2>
            <Link to="/technician/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All History →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedJobs.slice(0, 2).map(b => (
              <JobCard key={b._id} booking={b} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-14 border border-gray-100 text-center">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl inline-block mb-4">
            <CalendarIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs assigned yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Make sure your profile is complete and availability is set to ON. Admin will assign jobs to you.
          </p>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Quick action FAB — same as DashboardPage */}
      <motion.div variants={itemVariants} className="fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/technician/bookings')}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer"
        >
          <WrenchIcon className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
