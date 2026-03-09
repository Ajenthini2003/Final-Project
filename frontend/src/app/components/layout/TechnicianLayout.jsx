// src/app/components/layout/TechnicianLayout.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../common/Loader/PageLoader';

import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Clock,
  CreditCard,
  Bell,
  User,
  LogOut,
  Wrench,
  Star,
  Settings,
  ChevronRight,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function TechnicianLayout({ children }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!user || !token) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'technician') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const navigation = [
    { name: 'Dashboard',     href: '/technician/dashboard',     icon: LayoutDashboard },
    { name: 'My Bookings',   href: '/technician/bookings',      icon: Calendar },
    { name: 'Active Jobs',   href: '/technician/active',        icon: CheckSquare },
    { name: 'Schedule',      href: '/technician/schedule',      icon: Clock },
    { name: 'Earnings',      href: '/technician/earnings',      icon: CreditCard },
    { name: 'Reviews',       href: '/technician/reviews',       icon: Star },
    { name: 'Notifications', href: '/technician/notifications', icon: Bell },
    { name: 'Profile',       href: '/technician/profile',       icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR — same structure as DashboardLayout */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-screen">

        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b">
          <Link to="/technician/dashboard" className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            <div className="leading-tight">
              <span className="text-xl font-bold block">FixMate</span>
              <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest">Technician</span>
            </div>
          </Link>
        </div>

        {/* Technician card — unique to this panel */}
        <div className="mx-3 mt-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-blue-600 font-medium capitalize">{user.specialization || 'Technician'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className={`w-2 h-2 rounded-full ${user.availability !== false ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-600 font-medium">{user.availability !== false ? 'Available' : 'Offline'}</span>
            {user.rating > 0 && (
              <span className="ml-auto flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                {Number(user.rating).toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Navigation — identical pattern to DashboardLayout */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-40" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section — same structure as DashboardLayout */}
        <div className="p-4 border-t space-y-3 bg-white">
          {/* User Info */}
          {user && (
            <div className="px-3 py-2 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Hi, {user?.name?.split(' ')[0] || 'Technician'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}

          {/* Switch to User Panel */}
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="w-full">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              User Panel
            </Button>
          </Link>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}