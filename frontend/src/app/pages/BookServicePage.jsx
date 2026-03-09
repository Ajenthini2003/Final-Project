// src/app/pages/BookServicePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { getServices, getTechnicians } from "../../api";

// ─── LKR formatter ─────────────────────────────────────────────────────────
const lkr = (amount) => `LKR ${Number(amount).toLocaleString("en-LK")}`;

// ─── Inline SVG Icons ──────────────────────────────────────────────────────
const Check = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);
const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);
const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CreditCard = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// ─── Mock fallback data ─────────────────────────────────────────────────────
const MOCK_SERVICES = [
  { _id: "s1", name: "AC Repair", category: "ac", price: 1500, duration: "2 hrs", rating: 4.5, bookings: 150, emergency: false, description: "Professional AC repair and maintenance service.", features: ["Expert technician", "Quality guaranteed", "6-month warranty"] },
  { _id: "s2", name: "Plumbing Service", category: "plumbing", price: 1200, duration: "1.5 hrs", rating: 4.8, bookings: 200, emergency: true, description: "Expert plumbing repairs and installations.", features: ["Licensed plumber", "Quality parts", "Work guaranteed"] },
  { _id: "s3", name: "Electrical Repairs", category: "electrical", price: 1300, duration: "1.5 hrs", rating: 4.7, bookings: 175, emergency: true, description: "Licensed electricians for all electrical needs.", features: ["Licensed electrician", "Safety certified", "Warranty included"] },
  { _id: "s4", name: "Appliance Repair", category: "appliance", price: 1400, duration: "2 hrs", rating: 4.6, bookings: 120, emergency: false, description: "Fix all home appliances.", features: ["Expert technician", "Genuine parts", "Service warranty"] },
  { _id: "s5", name: "Carpentry Services", category: "carpentry", price: 1600, duration: "3 hrs", rating: 4.9, bookings: 85, emergency: false, description: "Custom furniture, repairs, and installations.", features: ["Skilled carpenter", "Custom work", "Quality materials"] },
  { _id: "s6", name: "Electronics Repair", category: "electronics", price: 1000, duration: "1 hr", rating: 4.4, bookings: 95, emergency: false, description: "Phone, TV, and gadget repairs.", features: ["Certified technician", "All brands", "Quick turnaround"] },
];
const MOCK_TECHNICIANS = [
  { _id: "t1", name: "Makenthiran R.", specialization: "ac", experience: 5, rating: 4.8, reviews: 127, availability: true, verified: true, priceRange: { min: 1500, max: 3000 }, skills: ["AC Repair", "Refrigerator", "Electrical"], jobs: 450 },
  { _id: "t2", name: "Thushan P.", specialization: "plumbing", experience: 8, rating: 4.9, reviews: 245, availability: true, verified: true, priceRange: { min: 2000, max: 4000 }, skills: ["Plumbing", "Water Systems", "Bathroom Fittings"], jobs: 780 },
  { _id: "t3", name: "Raj Kumar S.", specialization: "electrical", experience: 6, rating: 4.7, reviews: 98, availability: false, verified: true, priceRange: { min: 1800, max: 3500 }, skills: ["Electrical", "Wiring", "Smart Home"], jobs: 210 },
  { _id: "t4", name: "Saman Perera", specialization: "appliance", experience: 12, rating: 5.0, reviews: 312, availability: true, verified: true, priceRange: { min: 2500, max: 5000 }, skills: ["AC Repair", "Plumbing", "Electrical", "Carpentry"], jobs: 1250 },
  { _id: "t5", name: "Nimal De Silva", specialization: "carpentry", experience: 7, rating: 4.6, reviews: 88, availability: true, verified: false, priceRange: { min: 1500, max: 3000 }, skills: ["Carpentry", "Furniture", "Woodwork"], jobs: 320 },
];
const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "ac", label: "AC & Cooling" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "appliance", label: "Appliances" },
  { value: "carpentry", label: "Carpentry" },
  { value: "electronics", label: "Electronics" },
];
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
const STEPS_LABELS = ["Select Service", "Choose Technician", "Schedule"];

// ─── Step bar ───────────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="flex items-center justify-between mb-10">
      {STEPS_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  backgroundColor: done ? "#10b981" : active ? "#3b82f6" : "#f3f4f6",
                  scale: active ? 1.1 : 1,
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center border-2"
                style={{ borderColor: done ? "#10b981" : active ? "#3b82f6" : "#e5e7eb" }}
              >
                {done ? <Check className="w-5 h-5 text-white" /> : (
                  <span className={`text-sm font-semibold ${active ? "text-white" : "text-gray-400"}`}>{n}</span>
                )}
              </motion.div>
              <span className={`text-xs mt-2 font-medium text-center max-w-[80px] leading-tight ${active ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
            </div>
            {i < STEPS_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 rounded-full mb-5 ${n < current ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Service Card ───────────────────────────────────────────────────────────
function ServiceCard({ svc, selected, onSelect }) {
  const isSelected = selected?._id === svc._id;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(svc)}
      className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all ${isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      {svc.emergency && (
        <span className="absolute top-3 left-3 text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
          Emergency
        </span>
      )}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{svc.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{svc.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1"><StarIcon className="w-3.5 h-3.5 text-yellow-400" />{svc.rating}</span>
          <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{svc.duration}</span>
          <span>{svc.bookings}+ bookings</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {svc.features?.slice(0, 3).map((f, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">{lkr(svc.price)}</span>
          <span className="text-xs text-gray-400">per visit</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Technician Card ────────────────────────────────────────────────────────
function TechCard({ tech, selected, onSelect }) {
  const isSelected = selected?._id === tech._id;
  return (
    <motion.div
      whileHover={tech.availability ? { y: -3 } : {}}
      whileTap={tech.availability ? { scale: 0.98 } : {}}
      onClick={() => tech.availability && onSelect(tech)}
      className={`relative p-5 rounded-2xl border-2 transition-all ${
        !tech.availability
          ? "opacity-60 cursor-not-allowed border-gray-100 bg-gray-50"
          : isSelected
          ? "border-blue-500 bg-blue-50 shadow-md cursor-pointer"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {tech.name?.charAt(0) || "T"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{tech.name}</h3>
            {tech.verified && <ShieldIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1 text-sm mt-0.5">
            <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-medium">{tech.rating}</span>
            <span className="text-gray-400">({tech.reviews} reviews)</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {(tech.skills || []).slice(0, 3).map((s, i) => (
          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 text-gray-400" />{tech.experience} yrs exp.</span>
        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-500" />{tech.jobs}+ jobs</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400 block">Experience</span>
          <span className="font-semibold text-gray-900 text-sm">{tech.experience} yrs · {tech.jobs}+ jobs</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tech.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {tech.availability ? "Available" : "Busy"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Success Modal ──────────────────────────────────────────────────────────
function SuccessModal({ isOpen, onClose, onViewHistory }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-center mb-6">Your booking is confirmed. The technician will visit, inspect, and confirm the final cost. You only pay after the job is complete.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
            <p className="text-gray-700">Booking ref: <strong>#{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong></p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">Close</button>
            <button onClick={onViewHistory} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium">View History</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BookServicePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useApp();

  const [step, setStep] = useState(1);

  // Step 1
  const [services, setServices] = useState([]);
  const [loadingSvc, setLoadingSvc] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchSvc, setSearchSvc] = useState("");

  // Step 2
  const [technicians, setTechnicians] = useState([]);
  const [loadingTech, setLoadingTech] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [searchTech, setSearchTech] = useState("");
  const [filterAvail, setFilterAvail] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Step 3
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoadingSvc(true);
      try {
        const data = await getServices();
        setServices(Array.isArray(data) && data.length > 0 ? data : MOCK_SERVICES);
      } catch { setServices(MOCK_SERVICES); }
      finally { setLoadingSvc(false); }
    })();
  }, []);

  useEffect(() => {
    if (step !== 2) return;
    (async () => {
      setLoadingTech(true);
      try {
        const data = await getTechnicians();
        const parsed = (Array.isArray(data) && data.length > 0 ? data : MOCK_TECHNICIANS).map((t) => ({
          ...t,
          priceRange: t.priceRange || { min: 1500, max: 3500 },
          skills: Array.isArray(t.skills) ? t.skills : [],
          availability: t.availability ?? true,
        }));
        setTechnicians(parsed);
      } catch { setTechnicians(MOCK_TECHNICIANS); }
      finally { setLoadingTech(false); }
    })();
  }, [step]);

  const filteredServices = services.filter((s) => {
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    const matchSearch = !searchSvc || s.name.toLowerCase().includes(searchSvc.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredTechs = technicians
    .filter((t) => {
      const matchSearch = !searchTech || t.name.toLowerCase().includes(searchTech.toLowerCase()) || (t.skills || []).some((s) => s.toLowerCase().includes(searchTech.toLowerCase()));
      return matchSearch && (!filterAvail || t.availability) && (!filterVerified || t.verified);
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "price") return (a.priceRange?.min || 0) - (b.priceRange?.min || 0);
      if (sortBy === "experience") return (b.experience || 0) - (a.experience || 0);
      return 0;
    });

  const canProceed = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedTech;
    if (step === 3) return date && time && phone.length >= 9 && address && issue;
    return false;
  };

  const handleSubmit = async () => {
    if (!user?._id) { navigate("/login"); return; }
    setLoading(true);
    try {
      await addBooking({
        userId: user._id,
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        technicianId: selectedTech._id,
        technicianName: selectedTech.name,
        date, time, phone, address, issue,
        price: selectedService.price,
        currency: "LKR",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setShowSuccess(true);
    } catch { alert("Failed to create booking. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book a Service</h1>
        <p className="text-gray-500 mt-1">Choose your service, pick a technician, and schedule your visit.</p>
      </motion.div>

      <StepBar current={step} />

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Services ── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search services…" value={searchSvc} onChange={(e) => setSearchSvc(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                    className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-medium transition-all ${categoryFilter === cat.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            {loadingSvc ? (
              <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredServices.map((svc) => <ServiceCard key={svc._id} svc={svc} selected={selectedService} onSelect={setSelectedService} />)}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: Technicians ── */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-400 uppercase font-semibold tracking-wide">Selected Service</span>
                <p className="font-semibold text-gray-900">{selectedService?.name}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Selected ✓</span>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by name or skill…" value={searchTech} onChange={(e) => setSearchTech(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <FilterIcon className="w-4 h-4" />Filters
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" checked={filterAvail} onChange={(e) => setFilterAvail(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                      Available now only
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                      Verified only
                    </label>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Sort by</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none">
                        <option value="rating">Top Rated</option>
                        <option value="experience">Most Experienced</option>
                        <option value="experience">Most Experienced</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-gray-400 mb-4">{filteredTechs.length} technician{filteredTechs.length !== 1 ? "s" : ""} found</p>

            {loadingTech ? (
              <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredTechs.map((tech) => <TechCard key={tech._id} tech={tech} selected={selectedTech} onSelect={setSelectedTech} />)}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 3: Schedule ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-medium">{selectedService?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Technician</span><span className="font-medium">{selectedTech?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="font-medium">{selectedService?.duration || "To be confirmed"}</span></div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-xs text-gray-400">💡 Final cost confirmed by technician after inspection.</p>
              </div>
            </div>

            {/* How payment works */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-blue-800">No payment needed now</p>
                <p className="text-blue-600 mt-0.5">The technician will visit, inspect the issue, and confirm the final cost. You only pay after the job is done and you are satisfied.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} type="button" onClick={() => setTime(slot)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${time === slot ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <PhoneIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Address *</label>
                <div className="relative">
                  <LocationIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="No. 12, Main Street, Colombo 03" required rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Issue *</label>
                <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. My AC is making a loud noise and not cooling properly…" required rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Back / Cancel */}
          <button type="button" onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}
            className="flex items-center gap-2 px-5 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {/* Centre hint */}
          <div className="hidden sm:flex flex-col items-center text-center flex-1">
            {!canProceed() && step === 1 && <p className="text-xs text-gray-400">Select a service to continue</p>}
            {!canProceed() && step === 2 && <p className="text-xs text-gray-400">Select a technician to continue</p>}
            {canProceed() && step === 1 && <p className="text-xs text-green-600 font-medium">✓ {selectedService?.name} selected</p>}
            {canProceed() && step === 2 && <p className="text-xs text-green-600 font-medium">✓ {selectedTech?.name} selected</p>}
            {step === 3 && <p className="text-xs text-gray-500">You pay only after the job is done ✓</p>}
          </div>

          {/* Continue / Confirm */}
          {step < 3 ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:opacity-90 transition-all">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading || !canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-200 hover:opacity-90 transition-all">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Confirm Booking</>
              )}
            </button>
          )}
        </div>
      </div>

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)}
        onViewHistory={() => { setShowSuccess(false); navigate("/dashboard/history"); }} />
    </div>
  );
}