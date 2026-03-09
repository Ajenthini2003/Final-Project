// src/app/pages/admin/UsersManagement.jsx  —  REAL DATA
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Search, MoreVertical, Edit, Ban, CheckCircle, Mail, Phone, Loader2, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { getAllUsers, updateUser } from "../../../api";

export default function UsersManagement() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [editDlg, setEditDlg] = useState(false);
  const [selected,setSelected]= useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data.filter(u => u.role === "user") : []);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const toggleStatus = async (u) => {
    const newStatus = u.isActive === false ? true : false;
    setSaving(true);
    try {
      await updateUser(u._id, { isActive: newStatus });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isActive: newStatus } : x));
      toast.success(`User ${newStatus ? "activated" : "suspended"}`);
    } catch { toast.error("Failed to update user"); }
    finally { setSaving(false); }
  };

  const openEdit = (u) => { setSelected({ ...u }); setEditDlg(true); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(selected._id, {
        name: selected.name, phone: selected.phone, address: selected.address,
      });
      setUsers(prev => prev.map(u => u._id === selected._id ? { ...u, ...selected } : u));
      toast.success("User updated");
      setEditDlg(false);
    } catch { toast.error("Failed to update user"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage customer accounts — real data</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">Total: {users.length}</Badge>
          <Badge variant="outline" className="text-green-600">Active: {users.filter(u => u.isActive !== false).length}</Badge>
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by name, email, or phone..."
              value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-14"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">{search ? "No users match your search." : "No users yet."}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Name","Email","Phone","Address","Joined","Status","Actions"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u._id?.slice(-6)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600"><Mail className="w-3 h-3" />{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600"><Phone className="w-3 h-3" />{u.phone || "—"}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 max-w-[140px] truncate">{u.address || "—"}</td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={u.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {u.isActive !== false ? "active" : "suspended"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(u)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(u)}>
                              {u.isActive !== false
                                ? <><Ban className="w-4 h-4 mr-2" />Suspend</>
                                : <><CheckCircle className="w-4 h-4 mr-2" />Activate</>}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDlg} onOpenChange={setEditDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div><Label>Name</Label>
                <Input value={selected.name || ""} onChange={e => setSelected(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div><Label>Phone</Label>
                <Input value={selected.phone || ""} onChange={e => setSelected(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div><Label>Address</Label>
                <Input value={selected.address || ""} onChange={e => setSelected(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div><Label>Email <span className="text-xs text-gray-400">(read only)</span></Label>
                <Input value={selected.email || ""} disabled className="bg-gray-50" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDlg(false)} disabled={saving}>Cancel</Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
