// src/app/pages/technician/TechnicianProfile.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, WrenchIcon,
} from '@heroicons/react/24/outline';
import { Star, Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

export default function TechnicianProfile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({
    name:       user?.name       || '',
    phone:      user?.phone      || '',
    address:    user?.address    || '',
    experience: user?.experience || 0,
  });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      // Merge updated into stored user
      const stored = JSON.parse(
        localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
      );
      const merged = { ...stored, ...updated };
      if (localStorage.getItem('user'))   localStorage.setItem('user', JSON.stringify(merged));
      else                                sessionStorage.setItem('user', JSON.stringify(merged));
      setUser(merged);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch {
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    { label: 'Full Name',       value: user?.name,                           icon: UserIcon    },
    { label: 'Email',           value: user?.email,                          icon: EnvelopeIcon },
    { label: 'Phone',           value: user?.phone,                          icon: PhoneIcon   },
    { label: 'Address',         value: user?.address || '—',                 icon: MapPinIcon  },
    { label: 'Specialization',  value: user?.specialization,   cap: true,    icon: WrenchIcon  },
    { label: 'Experience',      value: user?.experience ? `${user.experience} years` : '—', icon: Star },
  ];

  return (
    <motion.div
      className="p-6 space-y-6 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal and professional information</p>
      </div>

      {/* Avatar card — same banner gradient style as DashboardPage welcome */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-blue-100 capitalize mt-0.5">{user?.specialization || 'Technician'}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`flex items-center gap-1.5 text-sm ${user?.availability !== false ? 'text-green-300' : 'text-gray-300'}`}>
                <span className={`w-2 h-2 rounded-full ${user?.availability !== false ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                {user?.availability !== false ? 'Available' : 'Offline'}
              </span>
              {user?.rating > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-300">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  {Number(user.rating).toFixed(1)} rating
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal info */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Personal Information</CardTitle>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}
                    className="bg-blue-600 text-white hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-4">
                {rows.map(row => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                      {typeof row.icon === 'function'
                        ? <row.icon className="w-4 h-4" />
                        : <row.icon className="w-4 h-4" />
                      }
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{row.label}</p>
                      <p className={`text-sm font-medium text-gray-900 ${row.cap ? 'capitalize' : ''}`}>
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Address</Label>
                  <Input value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Years of Experience</Label>
                  <Input type="number" min="0" value={form.experience} onChange={e => set('experience', e.target.value)} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills */}
      {user?.skills?.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
