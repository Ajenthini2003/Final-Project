// src/app/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Wrench,
  Shield,
  Clock,
  Users,
  Star,
  ChevronRight,
  Award,
  Wrench as ToolIcon,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  Sparkles,
  Home,
  Car,
  Smartphone,
  Coffee,
  Wind,
  Cpu,
  Handshake,
  Zap,
  ShieldCheck,
  CircleCheck
} from "lucide-react";

export default function LandingPage() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FIXED DEMO LOGIN - Creates proper token
  const handleDemoLogin = () => {
    // Create a proper demo user object
    const demoUser = {
      _id: "demo-user-" + Date.now(),
      name: "Demo User",
      email: "demo@fixmate.lk",
      role: "user",
    };
    
    // Create a simple but valid token
    const demoToken = "demo-token-" + Date.now();
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("token", demoToken);
    
    // Update context
    setUser(demoUser);
    
    // Show success message
    toast.success("Logged in as demo user!");
    
    // Redirect to dashboard
    navigate("/dashboard");
  };

  const features = [
    { 
      icon: ShieldCheck, 
      title: "Trusted Service", 
      description: "All technicians are verified and background-checked for your safety",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    { 
      icon: Clock, 
      title: "24/7 Support", 
      description: "Round-the-clock emergency assistance with 2-hour response guarantee",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    { 
      icon: Award, 
      title: "Quality Guaranteed", 
      description: "6-month warranty on all repairs and services",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    { 
      icon: Handshake, 
      title: "Expert Team", 
      description: "Average 8+ years experience across all service categories",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
  ];

  const services = [
    { icon: Home, name: "Home Appliances", count: "15+ services", gradient: "from-blue-500 to-cyan-500" },
    { icon: Car, name: "Vehicle Repair", count: "20+ services", gradient: "from-green-500 to-emerald-500" },
    { icon: Smartphone, name: "Electronics", count: "25+ services", gradient: "from-purple-500 to-pink-500" },
    { icon: Coffee, name: "Kitchen Equipment", count: "12+ services", gradient: "from-orange-500 to-red-500" },
    { icon: Wind, name: "AC & Refrigeration", count: "8+ services", gradient: "from-cyan-500 to-blue-500" },
    { icon: Cpu, name: "IT Equipment", count: "18+ services", gradient: "from-indigo-500 to-purple-500" },
  ];

  const plans = [
    {
      name: "Basic",
      price: "999",
      period: "month",
      features: ["2 service calls/month", "Basic diagnostics", "5% parts discount", "Email support"],
      popular: false
    },
    {
      name: "Pro",
      price: "1,999",
      period: "month",
      features: ["4 service calls/month", "Priority scheduling", "15% parts discount", "24/7 phone support", "Free diagnostics"],
      popular: true
    },
    {
      name: "Family",
      price: "2,999",
      period: "month",
      features: ["Unlimited calls/month", "Same-day service", "25% parts discount", "Priority support", "Free maintenance checks", "Multi-device coverage"],
      popular: false
    },
  ];

  const testimonials = [
    { 
      name: "Kasun Perera", 
      location: "Colombo", 
      rating: 5, 
      text: "FixMate saved me thousands on AC repairs. The subscription plan is totally worth it!",
      avatar: "/avatars/user1.jpg",
      initials: "KP",
      service: "AC Repair"
    },
    { 
      name: "Nimal Silva", 
      location: "Kandy", 
      rating: 5, 
      text: "Professional service from start to finish. The technician was knowledgeable and fixed my fridge in no time.",
      avatar: "/avatars/user2.jpg",
      initials: "NS",
      service: "Refrigerator Repair"
    },
    { 
      name: "Amara Fernando", 
      location: "Galle", 
      rating: 5, 
      text: "Great experience with FixMate. The mobile app makes booking so easy. Highly recommended!",
      avatar: "/avatars/user3.jpg",
      initials: "AF",
      service: "Washing Machine"
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers", icon: Users },
    { value: "500+", label: "Expert Technicians", icon: ToolIcon },
    { value: "15K+", label: "Services Completed", icon: CircleCheck },
    { value: "24/7", label: "Support Available", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>FixMate</span>
              <Badge variant="outline" className="ml-2 bg-yellow-400 text-black border-0 text-xs">
                Sri Lanka
              </Badge>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Services', 'Plans', 'How It Works', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button 
                  variant={scrolled ? "ghost" : "outline"} 
                  className={!scrolled ? "text-white border-white hover:bg-white/10" : ""}
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {isMenuOpen ? (
                <X className={scrolled ? 'text-gray-900' : 'text-white'} />
              ) : (
                <Menu className={scrolled ? 'text-gray-900' : 'text-white'} />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-2xl p-4"
            >
              <div className="flex flex-col space-y-3">
                {['Services', 'Plans', 'How It Works', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="border-t pt-3 flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 50,000+ Sri Lankans
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your Complete
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Repair Solution
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Subscribe to affordable repair plans for all your devices, vehicles, and equipment. Professional service at your doorstep.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8">
                    Get Started
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleDemoLogin}
                  className="border-white text-white hover:bg-white/10 text-lg"
                >
                  Try Demo
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-white/50 flex items-center justify-center text-xs text-white font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-blue-100">
                  <span className="font-bold text-white">4.8</span> / 5 from 10k+ reviews
                </div>
              </div>
            </motion.div>

            {/* Right content - Stats cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <stat.icon className="w-8 h-8 text-yellow-300 mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-0">
              Our Services
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Repair Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From home appliances to vehicles, we've got all your repair needs covered
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${service.gradient} p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1`}>
                  <service.icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                  <p className="text-xs text-white/80">{service.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-0">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The FixMate Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just repair experts - we're your trusted service partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-0">
              Pricing Plans
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : ''}`}>
                  <CardContent className="p-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">LKR {plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CircleCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup">
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Choose {plan.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-0">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real customers who trust FixMate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0">
                      {testimonial.service}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers across Sri Lanka. Get your first service with 20% off!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8">
                  Sign Up Now
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/plans">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg">
                  View Plans
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-blue-200">
              No credit card required • Free 30-day trial on all plans
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FixMate</span>
              </div>
              <p className="text-sm mb-4">
                Sri Lanka's most trusted repair service platform. We bring professional repair services to your doorstep.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer" />
                <Linkedin className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Services', 'Plans', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {['FAQ', 'Help Center', 'Terms of Service', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+94 11 234 5678</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>support@fixmate.lk</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>Colombo, Sri Lanka</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 FixMate (Pvt) Ltd. All rights reserved. Made in Sri Lanka 🇱🇰</p>
          </div>
        </div>
      </footer>
    </div>
  );
}