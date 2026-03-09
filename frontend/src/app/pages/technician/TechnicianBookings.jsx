// src/app/pages/technician/TechnicianBookings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  CalendarIcon, MapPinIcon, PhoneIcon,
  MagnifyingGlassIcon, CheckCircleIcon, FunnelIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

const STATUS_TABS = [
  { key: 'all',         label: 'All' },
  { key: 'pending',     label: 'Pending' },
  { key: 'confirmed',   label: 'Confirmed' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' },
  { key: 'cancelled',   label: 'Cancelled' },
];

const statusColors = {
  pending:       'bg-yellow-100 text-yellow-700',
  confirmed:     'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed:     'bg-purple-100 text-purple-700',
  cancelled:     'bg-red-100 text-red-700',
};

export default function TechnicianBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [activeTab, setActiveTab] = useState('all');

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

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = bookings.filter(b => {
    const matchTab    = activeTab === 'all' || b.status === activeTab;
    const matchSearch = !search
      || b.serviceName?.toLowerCase().includes(search.toLowerCase())
      || b.address?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const countFor = (key) => key === 'all' ? bookings.length : bookings.filter(b => b.status === key).length;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage all your assigned service jobs</p>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filtered.length} job{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by service or address..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status tabs — same style as admin management tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-blue-200' : 'text-gray-400'}`}>
              ({countFor(tab.key)})
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-14 border border-gray-100 text-center">
          <div className="p-4 bg-gray-100 text-gray-400 rounded-xl inline-block mb-4">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-500 text-sm">Try a different filter or search term.</p>
        </div>
      )}

      {/* Booking cards — same style as DashboardPage BookingCard */}
      {!loading && filtered.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filtered.map(b => (
            <motion.div
              key={b._id}
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{b.serviceName}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">#{b._id?.slice(-6)?.toUpperCase()}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {b.status?.replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{b.date} at {b.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{b.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{b.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">Rs. {Number(b.price || 0).toLocaleString()}</span>
                <div className="flex gap-2">
                  {b.status === 'confirmed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(b._id, 'in-progress')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Start Job
                    </motion.button>
                  )}
                  {b.status === 'in-progress' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(b._id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark Complete
                    </motion.button>
                  )}
                  {b.status === 'completed' && (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircleIcon className="w-4 h-4" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
