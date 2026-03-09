// src/app/pages/technician/TechnicianSchedule.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

const statusColors = {
  pending:       'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed:     'bg-green-100 text-green-700 border-green-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  completed:     'bg-purple-100 text-purple-700 border-purple-200',
  cancelled:     'bg-red-100 text-red-700 border-red-200',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function TechnicianSchedule() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [today]    = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const mine = (Array.isArray(data) ? data : []).filter(
        b => (b.technicianId === user._id || b.technicianId?._id === user._id)
          && !['cancelled', 'completed'].includes(b.status)
      );
      setBookings(mine);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dateStr = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const bookingsOnDay = (d) => bookings.filter(b => b.date?.startsWith(dateStr(d)));
  const selectedBookings = selected ? bookingsOnDay(selected) : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600 mt-1">Your upcoming job calendar</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">←</button>
              <h2 className="text-xl font-semibold text-gray-900">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">→</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayBookings = bookingsOnDay(day);
                const isToday    = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                const isSelected = selected === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelected(isSelected ? null : day)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                      isSelected ? 'bg-blue-600 text-white' :
                      isToday    ? 'bg-blue-50 text-blue-600 font-bold' :
                      'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{day}</span>
                    {dayBookings.length > 0 && (
                      <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side panel — day detail */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selected
                  ? `${MONTHS[month]} ${selected}`
                  : 'Select a day'}
              </h3>

              {selected && selectedBookings.length === 0 && (
                <p className="text-gray-500 text-sm">No jobs scheduled on this day.</p>
              )}

              {selectedBookings.length > 0 && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                  {selectedBookings.map(b => (
                    <motion.div key={b._id} variants={itemVariants}
                      className={`p-4 rounded-xl border ${statusColors[b.status] || 'bg-gray-50 border-gray-200'}`}>
                      <p className="font-semibold text-sm">{b.serviceName}</p>
                      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                        <ClockIcon className="w-3 h-3" />
                        {b.time}
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                        <MapPinIcon className="w-3 h-3" />
                        <span className="truncate">{b.address}</span>
                      </div>
                      <span className="text-xs font-semibold mt-2 inline-block capitalize opacity-80">
                        {b.status?.replace('-', ' ')}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Upcoming list */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Jobs</h3>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming jobs</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b._id} className="flex items-start gap-3 text-sm">
                      <div className="w-1 h-full min-h-8 rounded-full bg-blue-400 flex-shrink-0 mt-1" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{b.serviceName}</p>
                        <p className="text-gray-500 text-xs">{b.date} · {b.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
