// src/app/pages/technician/TechnicianEarnings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CreditCardIcon, ChartBarIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

// Same stat card as AdminDashboard
const StatCard = ({ name, value, icon: Icon, color, change }) => (
  <motion.div variants={itemVariants}>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <span className="text-sm font-medium text-green-600">↑ {change}</span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{name}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function TechnicianEarnings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const mine = (Array.isArray(data) ? data : []).filter(
        b => (b.technicianId === user._id || b.technicianId?._id === user._id) && b.status === 'completed'
      );
      setBookings(mine);
    } catch { 
      setBookings([]); 
    }
    finally { 
      setLoading(false); 
    }
  }, [user]);

  useEffect(() => { 
    fetchBookings(); 
  }, [fetchBookings]);

  const totalEarnings = bookings.reduce((s, b) => s + (Number(b.price) || 0), 0);
  const thisMonth     = new Date().getMonth();
  const thisYear      = new Date().getFullYear();
  const monthlyEarnings = bookings
    .filter(b => {
      const d = new Date(b.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((s, b) => s + (Number(b.price) || 0), 0);

  // Build monthly chart data from bookings
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyData = monthNames.map((month, idx) => ({
    month,
    earnings: bookings
      .filter(b => {
        const d = new Date(b.date);
        return d.getMonth() === idx && d.getFullYear() === thisYear;
      })
      .reduce((s, b) => s + (Number(b.price) || 0), 0),
    jobs: bookings.filter(b => {
      const d = new Date(b.date);
      return d.getMonth() === idx && d.getFullYear() === thisYear;
    }).length,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Track your income from completed jobs</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Stats — same as AdminDashboard stat grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              name="Total Earnings"     
              value={`Rs. ${totalEarnings.toLocaleString()}`}   
              icon={CreditCardIcon}     
              color="from-blue-500 to-blue-600" 
            />
            <StatCard 
              name="This Month"          
              value={`Rs. ${monthlyEarnings.toLocaleString()}`} 
              icon={CalendarIcon}       
              color="from-green-500 to-green-600" 
            />
            <StatCard 
              name="Jobs Completed"      
              value={bookings.length}                            
              icon={CheckCircleIcon}    
              color="from-purple-500 to-purple-600" 
            />
            <StatCard 
              name="Avg Per Job"         
              value={bookings.length ? `Rs. ${Math.round(totalEarnings / bookings.length).toLocaleString()}` : 'Rs. 0'} 
              icon={ChartBarIcon} 
              color="from-orange-500 to-orange-600" 
            />
          </div>

          {/* Earnings chart — same Card style as AdminDashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings {thisYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val) => [`Rs. ${val.toLocaleString()}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="#3B82F6" name="Earnings (Rs.)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Jobs per month line chart */}
          <Card>
            <CardHeader>
              <CardTitle>Jobs Completed Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="jobs" stroke="#10B981" strokeWidth={2} name="Jobs" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent completed jobs table — same as AdminDashboard recent bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No completed jobs yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Job ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 10).map(b => (
                        <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">#{b._id?.slice(-6)?.toUpperCase()}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{b.serviceName}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{b.date}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-blue-600">Rs. {Number(b.price || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}