import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Search, MoreVertical, Edit, Star, MapPin, Phone, Award,
  Calendar, Plus, X, Trash2, Loader2, RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  getTechnicians, createTechnician, updateTechnician, deleteTechnician,
} from '../../../api';

const EMPTY_NEW = {
  name: '', email: '', phone: '', password: '',
  address: '', specialization: '', skills: [''],
  experience: 0, availability: true,
};

const availColor = (a) =>
  a === true || a === 'available'
    ? 'bg-green-100 text-green-800'
    : a === 'busy'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-100 text-gray-800';

const availLabel = (a) =>
  a === true ? 'available' : a === false ? 'off-duty' : a;

export default function TechniciansManagement() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [newTech, setNewTech] = useState(EMPTY_NEW);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const data = await getTechnicians();
      setTechnicians(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTechnicians(); }, []);

  const filtered = technicians.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── ADD ──────────────────────────────────────────────────────────────────
  const handleSaveNew = async () => {
    if (!newTech.name || !newTech.email || !newTech.phone || !newTech.password) {
      toast.error('Name, email, phone and password are required');
      return;
    }
    if (newTech.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: newTech.name.trim(),
        email: newTech.email.trim().toLowerCase(),
        phone: newTech.phone.trim(),
        password: newTech.password,
        address: newTech.address.trim(),
        specialization: newTech.specialization.trim(),
        skills: newTech.skills.filter((s) => s.trim() !== ''),
        experience: Number(newTech.experience) || 0,
        availability: newTech.availability === true || newTech.availability === 'true',
      };
      const created = await createTechnician(payload);
      setTechnicians((prev) => [created, ...prev]);
      toast.success(`Technician "${created.name}" added successfully! They can now login at /login`);
      setIsAddOpen(false);
      setNewTech(EMPTY_NEW);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add technician');
    } finally {
      setSaving(false);
    }
  };

  // ── EDIT ─────────────────────────────────────────────────────────────────
  const handleEditOpen = (tech) => {
    setSelectedTech({
      ...tech,
      skills: Array.isArray(tech.skills) && tech.skills.length ? tech.skills : [''],
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTech.name || !selectedTech.phone) {
      toast.error('Name and phone are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: selectedTech.name,
        phone: selectedTech.phone,
        address: selectedTech.address || '',
        specialization: selectedTech.specialization || '',
        skills: Array.isArray(selectedTech.skills)
          ? selectedTech.skills.filter((s) => s.trim() !== '')
          : [],
        experience: Number(selectedTech.experience) || 0,
        availability: selectedTech.availability === true || selectedTech.availability === 'true',
      };
      const updated = await updateTechnician(selectedTech._id, payload);
      setTechnicians((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      toast.success('Technician updated successfully');
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update technician');
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = (tech) => { setTechToDelete(tech); setIsDeleteOpen(true); };

  const handleConfirmDelete = async () => {
    setSaving(true);
    try {
      await deleteTechnician(techToDelete._id);
      setTechnicians((prev) => prev.filter((t) => t._id !== techToDelete._id));
      toast.success(`Technician "${techToDelete.name}" deleted`);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete technician');
    } finally {
      setSaving(false);
    }
  };

  // ── SKILLS helpers ────────────────────────────────────────────────────────
  const addSkill = (isNew) => {
    if (isNew) setNewTech((p) => ({ ...p, skills: [...p.skills, ''] }));
    else setSelectedTech((p) => ({ ...p, skills: [...(p.skills || []), ''] }));
  };

  const removeSkill = (index, isNew) => {
    if (isNew) {
      const s = newTech.skills.filter((_, i) => i !== index);
      setNewTech((p) => ({ ...p, skills: s.length ? s : [''] }));
    } else {
      const s = selectedTech.skills.filter((_, i) => i !== index);
      setSelectedTech((p) => ({ ...p, skills: s.length ? s : [''] }));
    }
  };

  const changeSkill = (index, value, isNew) => {
    if (isNew) {
      const s = [...newTech.skills]; s[index] = value;
      setNewTech((p) => ({ ...p, skills: s }));
    } else {
      const s = [...selectedTech.skills]; s[index] = value;
      setSelectedTech((p) => ({ ...p, skills: s }));
    }
  };

  // ── STATS ─────────────────────────────────────────────────────────────────
  const available = technicians.filter((t) => t.availability === true).length;
  const busy = technicians.filter((t) => t.availability === false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technician Management</h1>
          <p className="text-gray-600 mt-1">Manage service technicians and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTechnicians} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4" /> Add Technician
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Technicians', value: technicians.length, color: 'text-gray-900' },
          { label: 'Available', value: available, color: 'text-green-600' },
          { label: 'Busy', value: busy, color: 'text-yellow-600' },
          { label: 'Off Duty', value: technicians.length - available - busy, color: 'text-gray-500' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-600 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>All Technicians</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'No technicians match your search.' : 'No technicians yet. Click "Add Technician" to create one.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Name', 'Email', 'Phone', 'Specialization', 'Skills', 'Exp', 'Rating', 'Availability', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tech) => (
                    <tr key={tech._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                        <p className="text-xs text-gray-400">{tech._id?.slice(-6)}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{tech.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Phone className="w-3 h-3" />{tech.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{tech.specialization || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(tech.skills || []).slice(0, 2).map((s) => (
                            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                          ))}
                          {(tech.skills || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">+{tech.skills.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{tech.experience ?? 0} yrs</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tech.rating ?? 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={availColor(tech.availability)}>
                          {availLabel(tech.availability)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditOpen(tech)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOpen(tech)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
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

      {/* ── ADD DIALOG ─────────────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Technician</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name *</Label>
              <Input placeholder="Full name" value={newTech.name}
                onChange={(e) => setNewTech((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Email * <span className="text-xs text-gray-400">(used to login)</span></Label>
              <Input type="email" placeholder="technician@email.com" value={newTech.email}
                onChange={(e) => setNewTech((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input placeholder="+94 77 123 4567" value={newTech.phone}
                onChange={(e) => setNewTech((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Password * <span className="text-xs text-gray-400">(min 8 chars)</span></Label>
              <Input type="password" placeholder="••••••••" value={newTech.password}
                onChange={(e) => setNewTech((p) => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <Label>Address</Label>
              <Input placeholder="Colombo, Kandy, etc." value={newTech.address}
                onChange={(e) => setNewTech((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div>
              <Label>Specialization</Label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={newTech.specialization}
                onChange={(e) => setNewTech((p) => ({ ...p, specialization: e.target.value }))}>
                <option value="">Select specialization</option>
                {['ac', 'electrical', 'plumbing', 'appliance', 'carpentry', 'painting', 'security', 'electronics', 'cleaning', 'emergency'].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Skills</Label>
              {newTech.skills.map((sk, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <Input placeholder={`Skill ${i + 1}`} value={sk}
                    onChange={(e) => changeSkill(i, e.target.value, true)} />
                  {newTech.skills.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeSkill(i, true)}
                      className="text-red-500"><X className="w-4 h-4" /></Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addSkill(true)} className="mt-2">
                <Plus className="w-4 h-4 mr-1" /> Add Skill
              </Button>
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input type="number" min="0" placeholder="0" value={newTech.experience}
                onChange={(e) => setNewTech((p) => ({ ...p, experience: e.target.value }))} />
            </div>
            <div>
              <Label>Availability</Label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={String(newTech.availability)}
                onChange={(e) => setNewTech((p) => ({ ...p, availability: e.target.value === 'true' }))}>
                <option value="true">Available</option>
                <option value="false">Off Duty</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveNew} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Add Technician'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT DIALOG ────────────────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Technician</DialogTitle></DialogHeader>
          {selectedTech && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Name *</Label>
                <Input value={selectedTech.name}
                  onChange={(e) => setSelectedTech((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={selectedTech.phone}
                  onChange={(e) => setSelectedTech((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={selectedTech.address || ''}
                  onChange={(e) => setSelectedTech((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <Label>Specialization</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedTech.specialization || ''}
                  onChange={(e) => setSelectedTech((p) => ({ ...p, specialization: e.target.value }))}>
                  <option value="">Select specialization</option>
                  {['ac', 'electrical', 'plumbing', 'appliance', 'carpentry', 'painting', 'security', 'electronics', 'cleaning', 'emergency'].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Skills</Label>
                {(selectedTech.skills || ['']).map((sk, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <Input placeholder={`Skill ${i + 1}`} value={sk}
                      onChange={(e) => changeSkill(i, e.target.value, false)} />
                    {selectedTech.skills.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeSkill(i, false)}
                        className="text-red-500"><X className="w-4 h-4" /></Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addSkill(false)} className="mt-2">
                  <Plus className="w-4 h-4 mr-1" /> Add Skill
                </Button>
              </div>
              <div>
                <Label>Experience (years)</Label>
                <Input type="number" min="0" value={selectedTech.experience ?? 0}
                  onChange={(e) => setSelectedTech((p) => ({ ...p, experience: e.target.value }))} />
              </div>
              <div>
                <Label>Availability</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={String(selectedTech.availability)}
                  onChange={(e) => setSelectedTech((p) => ({ ...p, availability: e.target.value === 'true' }))}>
                  <option value="true">Available</option>
                  <option value="false">Off Duty</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM ─────────────────────────────────────────────────── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Technician</DialogTitle></DialogHeader>
          <p className="text-gray-600 py-2">
            Are you sure you want to delete <strong>{techToDelete?.name}</strong>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
