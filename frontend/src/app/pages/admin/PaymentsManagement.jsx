// src/app/pages/admin/PaymentsManagement.jsx  —  REAL DATA
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Search, CheckCircle, XCircle, Clock, DollarSign, Loader2, RefreshCw } from "lucide-react";
import { getAllPayments } from "../../../api";
import { toast } from "sonner";

const STATUS_COLORS = {
  paid:      "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  pending:   "bg-yellow-100 text-yellow-800",
  failed:    "bg-red-100 text-red-800",
  refunded:  "bg-gray-100 text-gray-600",
};

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load payments"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const filtered = payments.filter(p => {
    const matchFilter = filter === "all" || p.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || p._id?.toLowerCase().includes(q)
      || p.userId?.name?.toLowerCase().includes(q)
      || p.planId?.name?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const totalRevenue = payments
    .filter(p => ["paid","completed"].includes(p.status))
    .reduce((s, p) => s + (p.amount || 0), 0);

  const stats = {
    paid:    payments.filter(p => ["paid","completed"].includes(p.status)).length,
    pending: payments.filter(p => p.status === "pending").length,
    failed:  payments.filter(p => p.status === "failed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
          <p className="text-gray-500 mt-1">All transactions from the database</p>
        </div>
        <Button variant="outline" onClick={fetchPayments} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading?"animate-spin":""}`}/> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Completed", value:stats.paid,    icon:CheckCircle, color:"from-green-500 to-green-600" },
          { label:"Pending",   value:stats.pending, icon:Clock,       color:"from-yellow-500 to-yellow-600" },
          { label:"Failed",    value:stats.failed,  icon:XCircle,     color:"from-red-500 to-red-600" },
          { label:"Revenue",   value:`Rs. ${(totalRevenue/1000).toFixed(0)}K`, icon:DollarSign, color:"from-blue-500 to-blue-600" },
        ].map(s=>{
          const Icon = s.icon;
          return (
            <Card key={s.label}><CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white"/>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </CardContent></Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card><CardContent className="pt-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <Input placeholder="Search by ID or customer..." value={search}
              onChange={e=>setSearch(e.target.value)} className="pl-9"/>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </CardContent></Card>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-14"><Loader2 className="w-8 h-8 animate-spin text-gray-400"/></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Payment ID","Customer","Plan / Service","Amount","Method","Date","Status"].map(h=>(
                      <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p=>(
                    <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-xs font-mono text-gray-500">{p._id?.slice(-8).toUpperCase()}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{p.userId?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{p.userId?.email || ""}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{p.planId?.name || p.description || "—"}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">Rs. {(p.amount||0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{p.paymentMethod || p.method || "—"}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : p.date || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}>{p.status}</Badge>
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
