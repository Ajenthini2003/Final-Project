// src/app/pages/admin/ServicesManagement.jsx  —  REAL DATA
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Search, Plus, Edit, Trash2, Clock, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getServices, createService, updateService, deleteService } from "../../../api";

const CATEGORIES = ["ac","electrical","plumbing","appliance","carpentry","painting","security","electronics","cleaning","emergency","other"];

const EMPTY = { name:"", category:"", description:"", price:"", duration:"", isActive:true };

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState("");
  const [addDlg,   setAddDlg]   = useState(false);
  const [editDlg,  setEditDlg]  = useState(false);
  const [delDlg,   setDelDlg]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [newSvc,   setNewSvc]   = useState(EMPTY);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const filtered = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const saveNew = async () => {
    if (!newSvc.name || !newSvc.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const created = await createService({ ...newSvc, price: Number(newSvc.price) });
      setServices(prev => [created, ...prev]);
      toast.success("Service created");
      setAddDlg(false); setNewSvc(EMPTY);
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to create service"); }
    finally { setSaving(false); }
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateService(selected._id, { ...selected, price: Number(selected.price) });
      setServices(prev => prev.map(s => s._id === selected._id ? updated : s));
      toast.success("Service updated");
      setEditDlg(false);
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to update service"); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await deleteService(selected._id);
      setServices(prev => prev.filter(s => s._id !== selected._id));
      toast.success("Service deleted");
      setDelDlg(false);
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to delete service"); }
    finally { setSaving(false); }
  };

  const ServiceForm = ({ data, set }) => (
    <div className="space-y-4 py-2">
      <div><Label>Service Name *</Label><Input value={data.name||""} onChange={e=>set(p=>({...p,name:e.target.value}))} /></div>
      <div><Label>Category</Label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          value={data.category||""} onChange={e=>set(p=>({...p,category:e.target.value}))}>
          <option value="">Select category</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
        </select>
      </div>
      <div><Label>Description</Label>
        <Textarea value={data.description||""} onChange={e=>set(p=>({...p,description:e.target.value}))} rows={3} />
      </div>
      <div><Label>Price (Rs.) *</Label><Input type="number" value={data.price||""} onChange={e=>set(p=>({...p,price:e.target.value}))} /></div>
      <div><Label>Estimated Duration (e.g. "2 hours")</Label><Input value={data.duration||""} onChange={e=>set(p=>({...p,duration:e.target.value}))} /></div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="active" checked={data.isActive!==false}
          onChange={e=>set(p=>({...p,isActive:e.target.checked}))} className="w-4 h-4" />
        <Label htmlFor="active">Active (visible to users)</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-500 mt-1">Add, edit and manage service offerings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchServices} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading?"animate-spin":""}`} />
          </Button>
          <Button onClick={()=>setAddDlg(true)}><Plus className="w-4 h-4 mr-2"/>Add Service</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5 text-center"><p className="text-3xl font-bold">{services.length}</p><p className="text-sm text-gray-500 mt-1">Total</p></CardContent></Card>
        <Card><CardContent className="pt-5 text-center"><p className="text-3xl font-bold text-green-600">{services.filter(s=>s.isActive!==false).length}</p><p className="text-sm text-gray-500 mt-1">Active</p></CardContent></Card>
        <Card><CardContent className="pt-5 text-center"><p className="text-3xl font-bold text-blue-600">{[...new Set(services.map(s=>s.category).filter(Boolean))].length}</p><p className="text-sm text-gray-500 mt-1">Categories</p></CardContent></Card>
      </div>

      <Card><CardContent className="pt-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search services..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9" />
        </div>
      </CardContent></Card>

      <Card>
        <CardHeader><CardTitle>All Services</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-14"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">{search ? "No services match." : "No services yet. Add one!"}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Name","Category","Price","Duration","Status","Actions"].map(h=>(
                      <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s=>(
                    <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{s.description}</p>
                      </td>
                      <td className="py-3 px-4"><Badge variant="outline">{s.category||"—"}</Badge></td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Rs. {s.price?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3"/>{s.duration||"—"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={s.isActive!==false?"bg-green-100 text-green-800":"bg-gray-100 text-gray-600"}>
                          {s.isActive!==false?"Active":"Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={()=>{setSelected({...s});setEditDlg(true);}}>
                            <Edit className="w-4 h-4"/>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500"
                            onClick={()=>{setSelected(s);setDelDlg(true);}}>
                            <Trash2 className="w-4 h-4"/>
                          </Button>
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

      <Dialog open={addDlg} onOpenChange={setAddDlg}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Service</DialogTitle></DialogHeader>
          <ServiceForm data={newSvc} set={setNewSvc}/>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setAddDlg(false)} disabled={saving}>Cancel</Button>
            <Button onClick={saveNew} disabled={saving}>{saving?"Saving...":"Add Service"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDlg} onOpenChange={setEditDlg}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Service</DialogTitle></DialogHeader>
          {selected && <ServiceForm data={selected} set={setSelected}/>}
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditDlg(false)} disabled={saving}>Cancel</Button>
            <Button onClick={saveEdit} disabled={saving}>{saving?"Saving...":"Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={delDlg} onOpenChange={setDelDlg}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Service</DialogTitle></DialogHeader>
          <p className="text-gray-600 py-2">Delete <strong>{selected?.name}</strong>? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setDelDlg(false)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={saving}>{saving?"Deleting...":"Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
