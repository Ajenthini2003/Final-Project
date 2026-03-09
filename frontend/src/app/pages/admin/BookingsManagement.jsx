// src/app/pages/admin/BookingsManagement.jsx  —  REAL DATA
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Search, Calendar, User, Wrench, MapPin, Clock, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getAllBookings, updateBooking, getTechnicians } from "../../../api";

const STATUS_COLORS = {
  pending:      "bg-yellow-100 text-yellow-800",
  confirmed:    "bg-cyan-100 text-cyan-800",
  "in-progress":"bg-blue-100 text-blue-800",
  completed:    "bg-green-100 text-green-800",
  cancelled:    "bg-red-100 text-red-800",
};

const TABS = ["all","pending","confirmed","in-progress","completed","cancelled"];

export default function BookingsManagement() {
  const [bookings,  setBookings]  = useState([]);
  const [technicians, setTechs]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [search,    setSearch]    = useState("");
  const [tab,       setTab]       = useState("all");
  const [assignDlg, setAssignDlg] = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [assignedTech, setAssignedTech] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bk, tc] = await Promise.all([getAllBookings(), getTechnicians()]);
      setBookings(Array.isArray(bk) ? bk : []);
      setTechs(Array.isArray(tc) ? tc : []);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = bookings.filter(b => {
    const matchTab = tab === "all" || b.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !q
      || b._id?.toLowerCase().includes(q)
      || b.userId?.name?.toLowerCase().includes(q)
      || b.serviceId?.name?.toLowerCase().includes(q)
      || b.serviceName?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const count = (s) => s === "all" ? bookings.length : bookings.filter(b => b.status === s).length;

  const changeStatus = async (id, status) => {
    setSaving(true);
    try {
      const updated = await updateBooking(id, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error("Failed to update booking"); }
    finally { setSaving(false); }
  };

  const openAssign = (b) => { setSelected(b); setAssignedTech(b.technicianId?._id || ""); setAssignDlg(true); };

  const saveAssign = async () => {
    if (!assignedTech) { toast.error("Please select a technician"); return; }
    setSaving(true);
    try {
      await updateBooking(selected._id, { technicianId: assignedTech, status: "confirmed" });
      setBookings(prev => prev.map(b => {
        if (b._id !== selected._id) return b;
        const tech = technicians.find(t => t._id === assignedTech);
        return { ...b, technicianId: tech || { _id: assignedTech }, status: "confirmed" };
      }));
      toast.success("Technician assigned & booking confirmed");
      setAssignDlg(false);
    } catch { toast.error("Failed to assign technician"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-500 mt-1">All bookings from the database — real time</p>
        </div>
        <Button variant="outline" onClick={fetchAll} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label:"Pending",     color:"text-yellow-600", s:"pending" },
          { label:"Confirmed",   color:"text-cyan-600",   s:"confirmed" },
          { label:"In Progress", color:"text-blue-600",   s:"in-progress" },
          { label:"Completed",   color:"text-green-600",  s:"completed" },
          { label:"Cancelled",   color:"text-red-600",    s:"cancelled" },
        ].map(x => (
          <Card key={x.s}>
            <CardContent className="pt-5 text-center">
              <p className={`text-3xl font-bold ${x.color}`}>{count(x.s)}</p>
              <p className="text-sm text-gray-500 mt-1">{x.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by customer, service, ID..."
                value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
                    ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {t} ({count(t)})
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-gray-400">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["ID","Customer","Service","Technician","Schedule","Address","Status","Actions"].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xs font-mono text-gray-500">{b._id?.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium text-gray-900">{b.userId?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{b.userId?.phone || ""}</p>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-800">{b.serviceId?.name || b.serviceName || "—"}</td>
                      <td className="py-3 px-3">
                        {b.technicianId?.name
                          ? <span className="flex items-center gap-1 text-sm text-gray-800"><Wrench className="w-3 h-3" />{b.technicianId.name}</span>
                          : <Button size="sm" variant="outline" onClick={() => openAssign(b)}>Assign</Button>
                        }
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Calendar className="w-3 h-3" />{b.scheduledDate || b.date || "—"}
                        </div>
                        {(b.scheduledTime || b.time) && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />{b.scheduledTime || b.time}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500 max-w-[140px] truncate">{b.address || "—"}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1.5">
                          {b.status === "pending" && (
                            <Button size="sm" onClick={() => openAssign(b)} disabled={saving}>Assign & Confirm</Button>
                          )}
                          {b.status === "confirmed" && (
                            <Button size="sm" variant="outline" onClick={() => changeStatus(b._id, "in-progress")} disabled={saving}>Start</Button>
                          )}
                          {b.status === "in-progress" && (
                            <Button size="sm" variant="outline" onClick={() => changeStatus(b._id, "completed")} disabled={saving}>Complete</Button>
                          )}
                          {!["completed","cancelled"].includes(b.status) && (
                            <Button size="sm" variant="ghost" className="text-red-500"
                              onClick={() => changeStatus(b._id, "cancelled")} disabled={saving}>Cancel</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign technician dialog */}
      <Dialog open={assignDlg} onOpenChange={setAssignDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Technician</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="font-medium text-gray-900">{selected.serviceId?.name || selected.serviceName}</p>
                <p className="text-gray-500 mt-1">Customer: {selected.userId?.name || "—"}</p>
                <p className="text-gray-500">Date: {selected.scheduledDate || selected.date}</p>
              </div>
              <div>
                <Label>Select Technician</Label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={assignedTech} onChange={e => setAssignedTech(e.target.value)}>
                  <option value="">-- Choose technician --</option>
                  {technicians
                    .filter(t => t.availability !== false)
                    .map(t => (
                      <option key={t._id} value={t._id}>
                        {t.name} — {t.specialization || "General"} ⭐ {t.rating ?? "N/A"}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDlg(false)} disabled={saving}>Cancel</Button>
            <Button onClick={saveAssign} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Assign & Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
