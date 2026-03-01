// AdminLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Wrench, ClipboardList, CreditCard, Bell, BarChart } from "lucide-react";

export default function AdminLayout({ children }) {
  const location = useLocation();

  // Function to highlight active link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <Link
            to="/admin"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin") ? "bg-gray-700" : ""
            }`}
          >
            <Home /> Dashboard
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/users") ? "bg-gray-700" : ""
            }`}
          >
            <Users /> Users
          </Link>

          <Link
            to="/admin/technicians"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/technicians") ? "bg-gray-700" : ""
            }`}
          >
            <Wrench /> Technicians
          </Link>

          <Link
            to="/admin/services"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/services") ? "bg-gray-700" : ""
            }`}
          >
            <ClipboardList /> Services
          </Link>

          <Link
            to="/admin/plans"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/plans") ? "bg-gray-700" : ""
            }`}
          >
            <ClipboardList /> Plans
          </Link>

          <Link
            to="/admin/payments"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/payments") ? "bg-gray-700" : ""
            }`}
          >
            <CreditCard /> Payments
          </Link>

          <Link
            to="/admin/bookings"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/bookings") ? "bg-gray-700" : ""
            }`}
          >
            <ClipboardList /> Bookings
          </Link>

          <Link
            to="/admin/notifications"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/notifications") ? "bg-gray-700" : ""
            }`}
          >
            <Bell /> Notifications
          </Link>

          <Link
            to="/admin/reports"
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
              isActive("/admin/reports") ? "bg-gray-700" : ""
            }`}
          >
            <BarChart /> Reports
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
