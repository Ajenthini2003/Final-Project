// /frontend/src/app/pages/TechniciansPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

import {
  Star,
  MapPin,
  Phone,
  Shield,
  Search,
  SlidersHorizontal,
  MessageCircle,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { getTechnicians } from "../../api";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Mock data as fallback with safe data structure
const mockTechnicians = [
  {
    id: "1",
    name: "Makenthiran",
    rating: 4.8,
    reviews: 127,
    distance: "2.5 km",
    services: ["AC Repair", "Refrigerator", "Electrical"],
    verified: true,
    available: true,
    phone: "+94771234567",
    priceRange: "Rs. 1,500 - 3,000",
    experience: "5 years",
    jobs: 450,
  },
  {
    id: "2",
    name: "Thushan",
    rating: 4.9,
    reviews: 245,
    distance: "1.2 km",
    services: ["Plumbing", "Water Systems", "Bathroom Fittings"],
    verified: true,
    available: true,
    phone: "+94712345678",
    priceRange: "Rs. 2,000 - 4,000",
    experience: "8 years",
    jobs: 780,
  },
  {
    id: "3",
    name: "Raj Kumar",
    rating: 4.7,
    reviews: 98,
    distance: "3.1 km",
    services: ["Electrical", "Wiring", "Smart Home"],
    verified: false,
    available: false,
    phone: "+94761234567",
    priceRange: "Rs. 1,800 - 3,500",
    experience: "3 years",
    jobs: 210,
  },
  {
    id: "4",
    name: "Saman Perera",
    rating: 5.0,
    reviews: 312,
    distance: "0.8 km",
    services: ["AC Repair", "Plumbing", "Electrical", "Carpentry"],
    verified: true,
    available: true,
    phone: "+94781234567",
    priceRange: "Rs. 2,500 - 5,000",
    experience: "12 years",
    jobs: 1250,
  },
];

export default function TechniciansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [sortBy, setSortBy] = useState("rating"); // rating, distance, experience
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch technicians on mount
  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from API first
      const data = await getTechnicians();
      // Ensure each technician has a services array
      const safeData = (data || []).map(tech => ({
        ...tech,
        services: Array.isArray(tech.services) ? tech.services : [],
        name: tech.name || 'Unknown Technician',
        rating: tech.rating || 0,
        reviews: tech.reviews || 0,
        distance: tech.distance || 'N/A',
        verified: tech.verified || false,
        available: tech.available || false,
        phone: tech.phone || '',
        priceRange: tech.priceRange || 'Contact for price',
        experience: tech.experience || 'N/A',
        jobs: tech.jobs || 0
      }));
      setTechnicians(safeData.length > 0 ? safeData : mockTechnicians);
    } catch (err) {
      console.error("Error fetching technicians:", err);
      // Fallback to mock data
      setTechnicians(mockTechnicians);
      setError("Using sample data - API connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort technicians with safe checks
  const filteredTechnicians = technicians
    .filter((tech) => {
      // Skip if tech is undefined
      if (!tech) return false;
      
      // Search filter with safe checks
      const matchesSearch = searchQuery === "" ? true : 
        (tech.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (Array.isArray(tech.services) && tech.services.some((s) =>
          (s || '').toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      // Availability filter
      const matchesAvailable = filterAvailable ? tech.available === true : true;
      
      // Verified filter
      const matchesVerified = filterVerified ? tech.verified === true : true;
      
      return matchesSearch && matchesAvailable && matchesVerified;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "experience") {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return expB - expA;
      }
      if (sortBy === "distance") {
        const distA = parseFloat(a.distance) || 0;
        const distB = parseFloat(b.distance) || 0;
        return distA - distB;
      }
      return 0;
    });

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsApp = (phone) => {
    if (phone) {
      const clean = phone.replace("+", "").replace(/\s/g, "");
      window.open(`https://wa.me/${clean}`, "_blank");
    }
  };

  const handleViewProfile = (techId) => {
    if (techId) {
      navigate(`/technician/${techId}`);
    }
  };

  const handleBookNow = (techId) => {
    if (!user) {
      navigate("/login", { state: { from: "/technicians" } });
      return;
    }
    if (techId) {
      navigate("/book-service", { state: { technicianId: techId } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Find a Technician</h1>
        <p className="text-gray-600 mt-1">Browse and book verified technicians near you</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-blue-50 border-blue-300" : ""}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div 
          variants={itemVariants}
          className="bg-white p-4 rounded-lg border border-gray-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Filter Technicians</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFilterAvailable(false);
                setFilterVerified(false);
                setSortBy("rating");
              }}
            >
              Reset
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Availability</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={filterAvailable}
                  onChange={(e) => setFilterAvailable(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="available" className="text-sm text-gray-600">
                  Show available only
                </label>
              </div>
            </div>

            {/* Verified Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Verification</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="verified" className="text-sm text-gray-600">
                  Verified only
                </label>
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Top Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="distance">Nearest First</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          variants={itemVariants}
          className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Results Count */}
      <motion.div variants={itemVariants} className="text-sm text-gray-600">
        Found {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''}
      </motion.div>

      {/* Technicians Grid */}
      {filteredTechnicians.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredTechnicians.map((tech) => (
            <motion.div key={tech?.id || Math.random()} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{tech?.name || 'Unknown Technician'}</h3>
                      <div className="flex items-center text-sm gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{tech?.rating || 0}</span>
                        <span className="text-gray-500">({tech?.reviews || 0} reviews)</span>
                      </div>
                    </div>
                    {tech?.verified && (
                      <div className="relative group">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Verified Professional
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Services - FIXED: Added safe check for services array */}
                  <div className="flex gap-2 flex-wrap">
                    {Array.isArray(tech?.services) && tech.services.length > 0 ? (
                      <>
                        {tech.services.slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700">
                            {s || 'Service'}
                          </Badge>
                        ))}
                        {tech.services.length > 3 && (
                          <Badge variant="outline">+{tech.services.length - 3}</Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">No services listed</Badge>
                    )}
                  </div>

                  {/* Details */}
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{tech?.distance || 'Distance N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-gray-400" />
                      <span>{tech?.experience || 'Experience N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{tech?.jobs || 0}+ jobs completed</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{tech?.priceRange || 'Contact for price'}</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2">
                    {tech?.available ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Available now</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">Currently busy</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewProfile(tech?.id)}
                      disabled={!tech?.id}
                    >
                      View Profile
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleBookNow(tech?.id)}
                      disabled={!tech?.available || !tech?.id}
                    >
                      Book Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleWhatsApp(tech?.phone)}
                      disabled={!tech?.phone}
                      className="px-3"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCall(tech?.phone)}
                      disabled={!tech?.phone}
                      className="px-3"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16 bg-white rounded-xl border border-gray-200"
        >
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No technicians found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("");
              setFilterAvailable(false);
              setFilterVerified(false);
            }}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}