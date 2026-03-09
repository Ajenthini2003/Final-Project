// src/app/pages/technician/TechnicianNotifications.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, CheckCircleIcon, WrenchIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

// Sample notifications — replace with real API call when backend supports it
const SAMPLE = [
  { id: 1, type: 'job',     title: 'New Job Assigned',        message: 'AC Repair at 123 Main St, Colombo has been assigned to you.',         time: '2 hours ago',   read: false },
  { id: 2, type: 'status',  title: 'Job Confirmed',           message: 'Your job BK-00245 has been confirmed by the customer.',                time: '5 hours ago',   read: false },
  { id: 3, type: 'payment', title: 'Earnings Credited',       message: 'Rs. 2,500 has been added to your earnings for completing BK-00239.',   time: 'Yesterday',     read: true  },
  { id: 4, type: 'review',  title: 'New Review Received',     message: 'Kasun Rajapaksa left you a 5-star review for Electrical Wiring job.',  time: '2 days ago',    read: true  },
  { id: 5, type: 'job',     title: 'New Job Assigned',        message: 'Plumbing repair at 456 Park Ave, Colombo assigned to you.',            time: '3 days ago',    read: true  },
  { id: 6, type: 'status',  title: 'Booking Cancelled',       message: 'Customer cancelled booking BK-00231. Reason: Schedule conflict.',      time: '4 days ago',    read: true  },
];

const iconMap = {
  job:     { icon: WrenchIcon,       color: 'text-blue-600',   bg: 'bg-blue-100'   },
  status:  { icon: CheckCircleIcon,  color: 'text-green-600',  bg: 'bg-green-100'  },
  payment: { icon: CreditCardIcon,   color: 'text-purple-600', bg: 'bg-purple-100' },
  review:  { icon: CalendarIcon,     color: 'text-amber-600',  bg: 'bg-amber-100'  },
};

export default function TechnicianNotifications() {
  const [notifications, setNotifications] = useState(SAMPLE);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {notifications.map((n, index) => {
          const { icon: Icon, color, bg } = iconMap[n.type] || iconMap.job;
          return (
            <motion.div
              key={n.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              onClick={() => markRead(n.id)}
              className={`p-5 rounded-xl cursor-pointer transition-all ${
                n.read
                  ? 'bg-white border border-gray-100 shadow-sm hover:bg-gray-50'
                  : 'bg-blue-50 border-l-4 border-blue-500 shadow-md hover:bg-blue-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
