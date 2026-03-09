// AdminLayout.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  Wrench, 
  ClipboardList, 
  CreditCard, 
  Bell, 
  BarChart,
  LogOut,
  Settings,
  Package,
  Calendar
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/technicians", icon: Wrench, label: "Technicians" },
    { path: "/admin/services", icon: Package, label: "Services" },
    { path: "/admin/plans", icon: ClipboardList, label: "Plans" },
    { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { path: "/admin/payments", icon: CreditCard, label: "Payments" },
    { path: "/admin/notifications", icon: Bell, label: "Notifications" },
    { path: "/admin/reports", icon: BarChart, label: "Reports" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
}