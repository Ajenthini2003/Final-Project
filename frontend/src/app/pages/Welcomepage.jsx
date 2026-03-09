// src/app/pages/WelcomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons (inline SVG, no extra deps) ───────────────────────────────────
const Icon = {
  Wrench:      (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.087 4.087" /></svg>,
  Shield:      (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Check:       (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
  CreditCard:  (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Calendar:    (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Bell:        (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Users:       (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Star:        (p) => <svg {...p} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  ArrowRight:  (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  ChevronDown: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Lock:        (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  History:     (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Lightning:   (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Wind:        (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
  Droplet:     (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>,
  Home:        (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 21V12h6v9" /></svg>,
  Hammer:      (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Phone:       (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Menu:        (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X:           (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
};

// ─── App Features ─────────────────────────────────────────────────────────
const APP_FEATURES = [
  {
    icon: Icon.CreditCard,
    title: "Subscribe to a Plan",
    desc: "Choose a monthly plan (Basic, Pro, or Family) and pay upfront to activate your account. No bookings without an active plan.",
    color: "bg-blue-50 text-blue-600",
    accent: "border-blue-200",
  },
  {
    icon: Icon.Wrench,
    title: "Browse & Book Services",
    desc: "After subscribing, browse AC repair, plumbing, electrical, carpentry, appliance and electronics services — all priced in LKR.",
    color: "bg-cyan-50 text-cyan-600",
    accent: "border-cyan-200",
  },
  {
    icon: Icon.Users,
    title: "Choose Your Technician",
    desc: "View verified technician profiles with ratings, experience, skills and LKR price ranges. Filter by availability or specialization.",
    color: "bg-purple-50 text-purple-600",
    accent: "border-purple-200",
  },
  {
    icon: Icon.Calendar,
    title: "Schedule Your Visit",
    desc: "Pick your preferred date and time slot. The technician comes to your door — no need to travel.",
    color: "bg-green-50 text-green-600",
    accent: "border-green-200",
  },
  {
    icon: Icon.History,
    title: "Track Your History",
    desc: "View all past and upcoming bookings from your dashboard. Download receipts and re-book previous services in one click.",
    color: "bg-orange-50 text-orange-600",
    accent: "border-orange-200",
  },
  {
    icon: Icon.Bell,
    title: "Real-Time Notifications",
    desc: "Get notified when a technician is assigned, on the way, or when your job is completed. Stay updated every step of the way.",
    color: "bg-pink-50 text-pink-600",
    accent: "border-pink-200",
  },
];

// ─── Plans data ────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Basic Care",
    price: "999",
    period: "month",
    desc: "Essential coverage for occasional repairs",
    features: ["2 service calls/month", "Basic diagnostics", "5% parts discount", "Email support"],
    popular: false,
    color: "from-slate-600 to-slate-700",
  },
  {
    name: "Pro Protection",
    price: "1,999",
    period: "month",
    desc: "Complete coverage for peace of mind",
    features: ["4 service calls/month", "Priority scheduling", "15% parts discount", "24/7 phone support", "Free diagnostics"],
    popular: true,
    color: "from-blue-600 to-cyan-600",
  },
  {
    name: "Family Shield",
    price: "2,999",
    period: "month",
    desc: "Ultimate protection for your whole home",
    features: ["Unlimited service calls", "Same-day service", "25% parts discount", "Priority 24/7 support", "Free maintenance checks", "Multi-device coverage"],
    popular: false,
    color: "from-purple-600 to-indigo-600",
  },
];

// ─── Services list ─────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Icon.Wind,      name: "AC & Cooling",    price: "From LKR 1,500", color: "bg-blue-100 text-blue-600" },
  { icon: Icon.Droplet,   name: "Plumbing",        price: "From LKR 1,200", color: "bg-cyan-100 text-cyan-600" },
  { icon: Icon.Lightning, name: "Electrical",      price: "From LKR 1,300", color: "bg-yellow-100 text-yellow-600" },
  { icon: Icon.Home,      name: "Appliances",      price: "From LKR 1,400", color: "bg-orange-100 text-orange-600" },
  { icon: Icon.Hammer,    name: "Carpentry",       price: "From LKR 1,600", color: "bg-amber-100 text-amber-600" },
  { icon: Icon.Phone,     name: "Electronics",     price: "From LKR 1,000", color: "bg-purple-100 text-purple-600" },
];

// ─── Scroll progress bar ───────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100"
        style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────
function SectionHeading({ tag, title, sub }) {
  return (
    <div className="text-center mb-14">
      <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{title}</h2>
      {sub && <p className="text-gray-500 max-w-xl mx-auto text-lg">{sub}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <ScrollProgress />

      {/* ══════════════ NAVBAR ══════════════════════════════════════════ */}
      <nav className={`fixed top-1 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-lg shadow-md py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Icon.Wrench className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
              FixMate
            </span>
            <span className="text-[11px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">🇱🇰 LK</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {[["Plans", "#plans"], ["Services", "#services"], ["Features", "#features"]].map(([label, href]) => (
              <a key={label} href={href}
                className={`font-medium text-sm transition-colors ${scrolled ? "text-gray-600 hover:text-blue-600" : "text-white/80 hover:text-white"}`}>
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10 border border-white/30"
              }`}>
              Login
            </button>
            <button onClick={() => navigate("/signup")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-300/40 hover:opacity-90 transition-opacity">
              Get Started →
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            {mobileOpen
              ? <Icon.X className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`} />
              : <Icon.Menu className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`} />
            }
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden bg-white border-t border-gray-100">
              <div className="px-6 py-4 flex flex-col gap-3">
                {[["Plans", "#plans"], ["Services", "#services"], ["Features", "#features"]].map(([l, h]) => (
                  <a key={l} href={h} onClick={() => setMobileOpen(false)}
                    className="text-gray-700 font-medium py-2">{l}</a>
                ))}
                <hr className="border-gray-100" />
                <button onClick={() => navigate("/login")} className="w-full py-3 border border-gray-200 rounded-xl text-gray-800 font-semibold">Login</button>
                <button onClick={() => navigate("/signup")} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold">Get Started Free</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════ HERO ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800" />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8 text-white text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Sri Lanka's #1 Home Repair Platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-[72px] font-black text-white leading-[1.05] mb-6 tracking-tight">
              Your Home,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                Always Fixed.
              </span>
            </h1>

            <p className="text-xl text-blue-100/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Subscribe to a plan, browse verified technicians, and book home repair services
              across Sri Lanka — all priced in <strong className="text-yellow-300">LKR</strong>.
            </p>

            {/* ⚠ Key rule pill */}
            <div className="inline-flex items-center gap-2.5 bg-orange-500 border border-orange-400 rounded-2xl px-6 py-3 mb-10 text-white font-semibold text-sm shadow-xl shadow-orange-900/30">
              <Icon.Lock className="w-4 h-4 flex-shrink-0" />
              You must select a subscription plan and pay before you can book any service.
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <button onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-white text-blue-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-colors shadow-2xl shadow-black/20">
                View Plans & Sign Up
                <Icon.ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-colors">
                I already have an account
              </button>
            </div>

            {/* Trust stats */}
            <div className="flex flex-wrap justify-center gap-8 text-blue-200 text-sm">
              {[
                { icon: Icon.Users,  text: "50,000+ Customers" },
                { icon: Icon.Star,   text: "4.8 / 5 Rating" },
                { icon: Icon.Shield, text: "500+ Verified Technicians" },
                { icon: Icon.History,text: "24/7 Support" },
              ].map(({ icon: Ico, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Ico className="w-4 h-4 text-yellow-300" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <Icon.ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS (3 steps) ══════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading tag="Getting Started" title="How FixMate Works" sub="Three steps to get your home repaired by a verified professional." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-200" />

            {[
              {
                num: "1",
                icon: Icon.CreditCard,
                title: "Pick a Plan & Pay",
                desc: "Choose Basic (LKR 999), Pro (LKR 1,999), or Family Shield (LKR 2,999) per month. Payment is required to activate your account and unlock booking.",
                color: "bg-blue-600",
                ring: "ring-blue-100",
                highlight: true,
              },
              {
                num: "2",
                icon: Icon.Wrench,
                title: "Browse & Book a Service",
                desc: "Choose from 6 service categories. Filter technicians by availability, rating, and LKR price range, then pick your preferred slot.",
                color: "bg-cyan-500",
                ring: "ring-cyan-100",
              },
              {
                num: "3",
                icon: Icon.Check,
                title: "Get It Fixed",
                desc: "A verified technician arrives at your door. All work comes with a 6-month warranty and a receipt in your dashboard.",
                color: "bg-green-500",
                ring: "ring-green-100",
              },
            ].map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }} viewport={{ once: true }}
                className={`relative bg-white rounded-3xl p-8 shadow-sm border-2 ${
                  step.highlight ? "border-blue-400 shadow-blue-100/60 shadow-xl" : "border-gray-100"
                }`}>
                {step.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                    ⚠ START HERE — Required
                  </div>
                )}
                <div className={`w-14 h-14 ${step.color} ring-4 ${step.ring} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-100 absolute top-7 right-7 select-none">{step.num}</div>
                <h3 className="font-extrabold text-gray-900 text-xl mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PLANS ═══════════════════════════════════════════ */}
      <section id="plans" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="Subscription Plans"
            title="Choose Your Plan to Get Started"
            sub="You must be subscribed to a plan before booking any service. All prices in LKR."
          />

          {/* Mandatory notice */}
          <div className="flex items-start gap-3 bg-orange-50 border-2 border-orange-300 rounded-2xl px-6 py-4 mb-12 max-w-2xl mx-auto">
            <Icon.Lock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-orange-800">A plan subscription is required before booking</p>
              <p className="text-orange-600 mt-0.5">
                After signing up, go to <strong>Plans</strong> in your dashboard, subscribe to any plan, and complete the payment. Only then can you book a service.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`relative bg-white rounded-3xl overflow-hidden shadow-lg border-2 ${
                  plan.popular ? "border-blue-500 shadow-blue-100 shadow-2xl scale-105" : "border-gray-100"
                }`}>
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-br ${plan.color} p-7 text-white`}>
                  <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                  <p className="text-white/70 text-sm">{plan.desc}</p>
                </div>

                {/* Price */}
                <div className="px-7 py-5 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-gray-500">LKR</span>
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 text-sm">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-7 py-6">
                  <ul className="space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon.Check className="w-3 h-3 text-green-600" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-7 pb-7">
                  <button onClick={() => navigate("/signup")}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 hover:opacity-90"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}>
                    Choose {plan.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            No hidden fees · Cancel anytime · Full refund if service cannot be fulfilled
          </p>
        </div>
      </section>

      {/* ══════════════ SERVICES ════════════════════════════════════════ */}
      <section id="services" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="Services We Offer"
            title="6 Categories, Hundreds of Repairs"
            sub="Once you have an active plan, these services are available to book instantly."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.name}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                onClick={() => navigate("/signup")}
                className="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                <div className={`w-12 h-12 ${svc.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <svc.icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-gray-800 text-sm mb-1">{svc.name}</p>
                <p className="text-xs text-blue-600 font-medium">{svc.price}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => navigate("/services")}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm">
              See All Services
              <Icon.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ APP FEATURES ════════════════════════════════════ */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="App Features"
            title="Everything You Need in One Place"
            sub="FixMate gives you full control over your home maintenance from one dashboard."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {APP_FEATURES.map((feat, i) => (
              <motion.div key={feat.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className={`bg-white rounded-2xl p-6 border-2 ${feat.accent} hover:shadow-lg transition-all`}>
                <div className={`w-12 h-12 ${feat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHY PAY FIRST ═══════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-950 to-blue-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Why Payment is Required First
            </h2>
            <p className="text-blue-300 max-w-xl mx-auto">
              We built FixMate around upfront payment to protect everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: Icon.Lock,     color: "text-cyan-300",   bg: "bg-cyan-500/10 border-cyan-500/20",   title: "Your Slot is Guaranteed",       desc: "Once payment is confirmed, your booking is locked. No last-minute cancellations or double-bookings." },
              { icon: Icon.Wrench,   color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-500/20", title: "Technician Arrives Prepared",    desc: "Knowing the job is confirmed, the technician brings the right tools and parts for your specific issue." },
              { icon: Icon.Shield,   color: "text-green-300",  bg: "bg-green-500/10 border-green-500/20",  title: "Fair for Technicians Too",      desc: "Professionals get guaranteed work, which means better service and more motivated experts at your door." },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border p-6 ${item.bg}`}>
                <item.icon className={`w-7 h-7 ${item.color} mb-4`} />
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
            <p className="text-white font-bold text-lg">
              🔒 All payments are 100% refundable if we cannot fulfil your booking.
            </p>
            <p className="text-blue-300 text-sm mt-1">Full refund within 24 hours if cancelled before technician dispatch.</p>
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ═══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200">
              <Icon.Wrench className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Ready to Fix Your Home?
            </h2>
            <p className="text-gray-500 text-lg mb-3 max-w-md mx-auto">
              Create your free account, choose a subscription plan, and book your first service in minutes.
            </p>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 mb-8 text-orange-700 text-sm font-medium">
              <Icon.Lock className="w-4 h-4" />
              Remember: you must subscribe to a plan before booking
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-opacity shadow-2xl shadow-blue-200">
                Sign Up & View Plans
                <Icon.ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/login")}
                className="px-10 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors">
                Login
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-5">No credit card needed to create an account.</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════════════════════════════════ */}
      <footer className="bg-gray-950 text-gray-500 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Icon.Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-sm">FixMate</span>
            <span className="text-xs">🇱🇰 Sri Lanka</span>
          </div>
          <p className="text-sm">© 2024 FixMate (Pvt) Ltd. All rights reserved.</p>
          <div className="flex gap-5 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}