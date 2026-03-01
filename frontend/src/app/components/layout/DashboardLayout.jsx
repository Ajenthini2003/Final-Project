// src/app/components/layout/DashboardLayout.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../common/Loader/PageLoader';

import {
  LayoutDashboard,
  Package,
  Calendar,
  CreditCard,
  Bell,
  User,
  LogOut,
  Wrench,
  Users,
  History,
  HelpCircle,
  Globe,
  Settings,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function DashboardLayout({ children }) {
  // 1️⃣ ALL HOOKS FIRST (unconditionally)
  const { user, setUser, notifications = [], loading } = useApp();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  // 2️⃣ ALL useEffect HOOKS HERE (before any returns)
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 3️⃣ ALL useCallback HOOKS HERE (if you had any)

  // 4️⃣ NOW handle conditional rendering (after all hooks)
  
  // Show loader while loading
  if (loading) {
    return <PageLoader />;
  }

  // Don't render if no user (the useEffect above will handle redirect)
  if (!user) {
    return null;
  }

  // 5️⃣ REST OF YOUR COMPONENT LOGIC
  const unreadCount = notifications?.filter((n) => !n?.read)?.length || 0;

  const navigation = [
    { name: t('nav.dashboard') || 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.plans') || 'Plans', href: '/plans', icon: Package },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Technicians', href: '/technicians', icon: Users },
    { name: t('nav.book') || 'Book Service', href: '/book-service', icon: Calendar },
    { name: 'History', href: '/history', icon: History },
    { name: t('nav.payments') || 'Payments', href: '/payments', icon: CreditCard },
    { name: t('nav.notifications') || 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Support', href: '/support', icon: HelpCircle },
    { name: t('nav.profile') || 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">FixMate</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t space-y-3 bg-white">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full rounded transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="flex-1 text-left">
                {language === 'en'
                  ? 'English'
                  : language === 'si'
                  ? 'සිංහල'
                  : 'தமிழ்'}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute left-0 bottom-12 bg-white border rounded shadow-lg w-full z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('si');
                    setShowLangMenu(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  සිංහල
                </button>
                <button
                  onClick={() => {
                    setLanguage('ta');
                    setShowLangMenu(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  தமிழ்
                </button>
              </div>
            )}
          </div>

          {/* User Info */}
          {user && (
            <div className="px-3 py-2 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Hi, {user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}

          {/* Admin Panel Link */}
          <Link to="/admin-login">
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          </Link>

          {/* Logout Button */}
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