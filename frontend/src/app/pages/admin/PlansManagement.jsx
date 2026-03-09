// src/app/pages/admin/PlansManagement.jsx  —  REAL DATA
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Plus, Edit, Trash2, Users, DollarSign, CheckCircle, X, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getRepairPlans, createPlan, updatePlan, deletePlan } from "../../../api";

const EMPTY = { name: "", price: "", duration: "month", description: "", features: [""] };

export default function PlansManagement() {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [editDlg, setEditDlg] = useState(false);
  const [addDlg,  setAddDlg]  = useState(false);
  const [delDlg,  setDelDlg]  = useState(false);
  const [selected,setSelected]= useState(null);
  const [newPlan, setNewPlan] = useState(EMPTY);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRepairPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load plans"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // ── Feature helpers ─────────────────────────────────────────────────────
  const addFeat = (isNew) => isNew
    ? setNewPlan(p => ({ ...p, features: [...p.features, ""] }))
    : setSelected(p => ({ ...p, features: [...(p.features||[]), ""] }));

  const remFeat = (i, isNew) => {
    if (isNew) { const f = newPlan.features.filter((_,j)=>j!==i); setNewPlan(p=>({...p,features:f.length?f:[""]})); }
    else { const f = selected.features.filter((_,j)=>j!==i); setSelected(p=>({...p,features:f.length?f:[""]})); }
  };

  const chgFeat = (i, v, isNew) => {
    if (isNew) { const f=[...newPlan.features]; f[i]=v; setNewPlan(p=>({...p,features:f})); }
    else { const f=[...(selected.features||[])]; f[i]=v; setSelected(p=>({...p,features:f})); }
  };

  // ── Save new plan ───────────────────────────────────────────────────────
  const saveNew = async () => {
    if (!newPlan.name || !newPlan.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const created = await createPlan({
        name: newPlan.name, price: Number(newPlan.price),
        duration: newPlan.duration, description: newPlan.description,
        features: newPlan.features.filter(f => f.trim()),
      });
      setPlans(prev => [...prev, created]);
      toast.success("Plan created");
      setAddDlg(false); setNewPlan(EMPTY);
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to create plan"); }
    finally { setSaving(false); }
  };

  // ── Save edit ───────────────────────────────────────────────────────────
  const saveEdit = async () => {
    if (!selected.name || !selected.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const updated = await updatePlan(selected._id, {
        name: selected.name, price: Number(selected.price),
        duration: selected.duration, description: selected.description,
        features: (selected.features||[]).filter(f => f.trim()),
      });
      setPlans(prev => prev.map(p => p._id === selected._id ? updated : p));
      toast.success("Plan updated");
      setEditDlg(false);
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to update plan"); }
    finally { setSaving(false); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    setSaving(true);
    try {
      await deletePlan(selected._id);
      setPlans(prev => prev.filter(p => p._id !== selected._id));
      toast.success("Plan deleted");
      setDelDlg(false);
    } catch (err) { toast.error(err?.response?.data?.message || "Failed to delete plan"); }
    finally { setSaving(false); }
  };

  const FeatFields = ({ isNew, arr }) => (
    <div>
      <Label>Features</Label>
      {arr.map((f, i) => (
        <div key={i} className="flex gap-2 mt-2">
          <Input placeholder={`Feature ${i+1}`} value={f} onChange={e => chgFeat(i, e.target.value, isNew)} />
          {arr.length > 1 && (
            <Button variant="ghost" size="sm" onClick={() => remFeat(i, isNew)} className="text-red-500">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => addFeat(isNew)} className="mt-2">
        <Plus className="w-4 h-4 mr-1" /> Add Feature
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-gray-500 mt-1">Create and manage subscription plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPlans} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setAddDlg(true)}><Plus className="w-4 h-4 mr-2" />Create Plan</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{plans.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Plans</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{plans.filter(p=>p.isActive!==false).length}</p>
          <p className="text-sm text-gray-500 mt-1">Active Plans</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-green-600">
            Rs. {plans.reduce((s,p)=>s+(p.price||0),0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Value</p>
        </CardContent></Card>
      </div>

      {/* Plans grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No plans yet.</p>
          <Button className="mt-4" onClick={() => setAddDlg(true)}>Create First Plan</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-2xl font-bold mt-2">Rs. {plan.price?.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">/{plan.duration}</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setSelected({...plan, features: plan.features||[""]}); setEditDlg(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500"
                      onClick={() => { setSelected(plan); setDelDlg(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {plan.description && <p className="text-sm text-gray-500 mt-2">{plan.description}</p>}
              </CardHeader>
              <CardContent className="space-y-2">
                {(plan.features||[]).map((f,i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addDlg} onOpenChange={setAddDlg}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create New Plan</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Plan Name *</Label><Input placeholder="e.g. Premium Plan" value={newPlan.name} onChange={e=>setNewPlan(p=>({...p,name:e.target.value}))} /></div>
            <div><Label>Price (Rs.) *</Label><Input type="number" placeholder="2500" value={newPlan.price} onChange={e=>setNewPlan(p=>({...p,price:e.target.value}))} /></div>
            <div><Label>Duration</Label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
                value={newPlan.duration} onChange={e=>setNewPlan(p=>({...p,duration:e.target.value}))}>
                <option value="month">Monthly</option>
                <option value="quarter">Quarterly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <div><Label>Description</Label><Input placeholder="Short description" value={newPlan.description} onChange={e=>setNewPlan(p=>({...p,description:e.target.value}))} /></div>
            <FeatFields isNew={true} arr={newPlan.features} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setAddDlg(false)} disabled={saving}>Cancel</Button>
            <Button onClick={saveNew} disabled={saving}>{saving?<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Saving...</>:"Create Plan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editDlg} onOpenChange={setEditDlg}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Plan</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div><Label>Plan Name *</Label><Input value={selected.name||""} onChange={e=>setSelected(p=>({...p,name:e.target.value}))} /></div>
              <div><Label>Price (Rs.) *</Label><Input type="number" value={selected.price||""} onChange={e=>setSelected(p=>({...p,price:e.target.value}))} /></div>
              <div><Label>Duration</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
                  value={selected.duration||"month"} onChange={e=>setSelected(p=>({...p,duration:e.target.value}))}>
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div><Label>Description</Label><Input value={selected.description||""} onChange={e=>setSelected(p=>({...p,description:e.target.value}))} /></div>
              <FeatFields isNew={false} arr={selected.features||[""]} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditDlg(false)} disabled={saving}>Cancel</Button>
            <Button onClick={saveEdit} disabled={saving}>{saving?<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Saving...</>:"Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={delDlg} onOpenChange={setDelDlg}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Plan</DialogTitle></DialogHeader>
          <p className="text-gray-600 py-2">Are you sure you want to delete <strong>{selected?.name}</strong>? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setDelDlg(false)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={saving}>{saving?"Deleting...":"Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
