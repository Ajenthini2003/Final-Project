// src/app/pages/admin/AdminDashboard.jsx  —  REAL DATA
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, Package, DollarSign, AlertCircle, Calendar, Loader2, RefreshCw, ArrowUpRight } from "lucide-react";
import { getAdminStats, getAdminRecentBookings } from "../../../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS = {
  pending:     "bg-yellow-100 text-yellow-800",
  confirmed:   "bg-green-100 text-green-800",
  completed:   "bg-blue-100 text-blue-800",
  cancelled:   "bg-red-100 text-red-800",
  "in-progress":"bg-purple-100 text-purple-800",
};

const PIE_COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([getAdminStats(), getAdminRecentBookings()]);
      setStats(s);
      setRecent(Array.isArray(r) ? r : []);
    } catch (err) {
      setError("Failed to load dashboard data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-gray-500">Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-gray-700 font-medium">{error}</p>
      <button onClick={load} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  const statCards = [
    { label: "Total Users",          value: stats?.totalUsers ?? 0,          icon: Users,        color: "from-blue-500 to-blue-600" },
    { label: "Total Technicians",    value: stats?.totalTechnicians ?? 0,    icon: Users,        color: "from-cyan-500 to-cyan-600" },
    { label: "Total Bookings",       value: stats?.totalBookings ?? 0,       icon: Calendar,     color: "from-green-500 to-green-600" },
    { label: "Pending Bookings",     value: stats?.pendingBookings ?? 0,     icon: AlertCircle,  color: "from-yellow-500 to-yellow-600" },
    { label: "Total Revenue (Rs.)",  value: `${((stats?.totalRevenue ?? 0)/1000).toFixed(0)}K`, icon: DollarSign, color: "from-purple-500 to-purple-600" },
    { label: "Active Plans",         value: stats?.totalPlans ?? 0,          icon: Package,      color: "from-orange-500 to-orange-600" },
  ];

  // Build chart data from stats
  const bookingStatusData = stats?.bookingsByStatus
    ? Object.entries(stats.bookingsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Live data from your database</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      {bookingStatusData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Bookings by Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={bookingStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={bookingStatusData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}>
                    {bookingStatusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <a href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </a>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Booking ID","Customer","Service","Technician","Date","Status"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(b => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{b._id?.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{b.userId?.name || b.customerName || "—"}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{b.serviceId?.name || b.serviceName || "—"}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{b.technicianId?.name || b.technicianName || "Unassigned"}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{b.scheduledDate || b.date || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
