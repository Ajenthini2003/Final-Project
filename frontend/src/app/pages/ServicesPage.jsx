import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Search,
  Clock,
  DollarSign,
  ArrowRight,
  Zap,
  Droplets,
  Wind,
  Wrench,
  Hammer,
  PaintBucket,
  Shield,
  Wifi,
  Sparkles,
  AlertCircle,
  Star,
  MapPin,
  Filter,
  X,
  ChevronDown,
  ThumbsUp,
  Users,
  Calendar,
  Phone,
  MessageCircle,
  Info,
  CheckCircle,
  Award,
  Home,
  Car,
  Smartphone,
  Coffee,
  Cpu,
} from "lucide-react";

// Import API functions
import { getServices, getFeaturedServices } from "../../api";

// Category Configuration with enhanced details
const categoryConfig = {
  electrical: {
    name: "Electrical Repairs",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    lightColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    description: "Professional electrical solutions for your home",
    popular: true,
  },
  plumbing: {
    name: "Plumbing Services",
    icon: Droplets,
    color: "from-blue-500 to-cyan-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    description: "Expert plumbing repairs and installations",
    popular: true,
  },
  appliance: {
    name: "Appliance Repairs",
    icon: Wrench,
    color: "from-purple-500 to-pink-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    description: "Fix all your home appliances",
    popular: true,
  },
  ac: {
    name: "AC & Cooling",
    icon: Wind,
    color: "from-cyan-500 to-blue-500",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    description: "Cooling solutions for your comfort",
    popular: false,
  },
  carpentry: {
    name: "Carpentry",
    icon: Hammer,
    color: "from-amber-500 to-orange-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    description: "Custom woodwork and repairs",
    popular: false,
  },
  painting: {
    name: "Painting",
    icon: PaintBucket,
    color: "from-pink-500 to-rose-500",
    lightColor: "bg-pink-50",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
    description: "Transform your space with color",
    popular: false,
  },
  security: {
    name: "Security",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    description: "Protect your home and family",
    popular: true,
  },
  electronics: {
    name: "Home Tech",
    icon: Wifi,
    color: "from-indigo-500 to-purple-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
    description: "Smart home and tech solutions",
    popular: false,
  },
  cleaning: {
    name: "Cleaning",
    icon: Sparkles,
    color: "from-teal-500 to-cyan-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    description: "Professional cleaning services",
    popular: true,
  },
  emergency: {
    name: "Emergency",
    icon: AlertCircle,
    color: "from-red-500 to-orange-500",
    lightColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    description: "24/7 emergency repairs",
    popular: false,
    urgent: true,
  },
};

// Mock service images (replace with actual images later)
const serviceImages = {
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
  plumbing: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
  appliance: "https://images.unsplash.com/photo-1581092921461-39b9c1b7b5c7?w=400",
  ac: "https://images.unsplash.com/photo-1631679705862-8f951b8a9a1b?w=400",
  carpentry: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400",
  painting: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
  security: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
  electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
  emergency: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400",
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [featuredServices, setFeaturedServices] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Fetch from API
      const data = await getServices();
      setServices(data);
      
      // Fetch featured services
      const featured = await getFeaturedServices();
      setFeaturedServices(featured);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  // Filter and sort services
  const filteredCategories = Object.keys(groupedServices).filter((cat) => {
    const matchesCategory = !selectedCategory || cat === selectedCategory;
    
    const matchesSearch =
      categoryConfig[cat]?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      groupedServices[cat].some((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const categoryServices = groupedServices[cat];
    const matchesPrice = categoryServices.some(
      s => s.price >= priceRange.min && s.price <= priceRange.max
    );

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === "popular") {
      const aPopular = categoryConfig[a]?.popular ? 1 : 0;
      const bPopular = categoryConfig[b]?.popular ? 1 : 0;
      return bPopular - aPopular;
    }
    if (sortBy === "alphabetical") {
      return categoryConfig[a]?.name.localeCompare(categoryConfig[b]?.name);
    }
    if (sortBy === "price-low") {
      const aMinPrice = Math.min(...groupedServices[a].map(s => s.price));
      const bMinPrice = Math.min(...groupedServices[b].map(s => s.price));
      return aMinPrice - bMinPrice;
    }
    if (sortBy === "price-high") {
      const aMaxPrice = Math.max(...groupedServices[a].map(s => s.price));
      const bMaxPrice = Math.max(...groupedServices[b].map(s => s.price));
      return bMaxPrice - aMaxPrice;
    }
    return 0;
  });

  const handleBookService = (service) => {
    navigate("/book-service", { state: { service } });
  };

  const handleQuickView = (service) => {
    setSelectedService(service);
  };

  const getRatingStars = (rating = 4.5) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star - rating < 1 && star - rating > 0
                ? "fill-yellow-400/50 text-yellow-400/50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading amazing services for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Home Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              From electrical repairs to plumbing, we've got all your home maintenance needs covered
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for services (e.g., AC repair, plumbing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-xl"
              />
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              <span className="text-sm text-blue-200">Popular:</span>
              {["AC Repair", "Plumbing", "Electrical", "Cleaning"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => {
              const category = categoryConfig[service.category];
              const Icon = category?.icon || Wrench;
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-yellow-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                    onClick={() => handleQuickView(service)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category?.color || 'from-blue-500 to-purple-500'} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-yellow-400 text-yellow-900">Featured</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">Rs. {service.price}</p>
                          <p className="text-xs text-gray-500">{service.duration}</p>
                        </div>
                        <Button size="sm" className="rounded-full">
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <Tabs value={viewMode} onValueChange={setViewMode} className="hidden md:block">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded-md px-2 py-1"
              >
                <option value="popular">Most Popular</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t mt-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Price Range</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                          className="w-24"
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          className="w-24"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration</label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>Any duration</option>
                        <option>Under 1 hour</option>
                        <option>1-2 hours</option>
                        <option>2-4 hours</option>
                        <option>4+ hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Availability</label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>Any time</option>
                        <option>Today</option>
                        <option>Tomorrow</option>
                        <option>This week</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Pills */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              All Services
            </button>
            {Object.entries(categoryConfig).map(([id, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Display */}
        <AnimatePresence mode="wait">
          {sortedCategories.length > 0 ? (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {sortedCategories.map((cat) => {
                const cfg = categoryConfig[cat];
                const Icon = cfg.icon;
                const categoryServices = groupedServices[cat];

                return (
                  <motion.div
                    key={cat}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg">
                      {/* Category Header */}
                      <div className={`bg-gradient-to-r ${cfg.color} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                              <Icon className="w-8 h-8" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">{cfg.name}</h2>
                              <p className="text-white/90">{cfg.description}</p>
                            </div>
                          </div>
                          <Badge className="bg-white/20 text-white border-0">
                            {categoryServices.length} Services
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryServices.map((service) => (
                              <motion.div
                                key={service._id}
                                whileHover={{ y: -5 }}
                                className="group"
                              >
                                <Card className="h-full hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-200"
                                  onClick={() => handleQuickView(service)}
                                >
                                  {/* Service Image */}
                                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                                    <img
                                      src={serviceImages[service.category] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"}
                                      alt={service.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {service.emergency && (
                                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                                        24/7 Emergency
                                      </Badge>
                                    )}
                                  </div>

                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <h3 className="font-semibold text-lg">{service.name}</h3>
                                      {getRatingStars(service.rating)}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                      {service.description}
                                    </p>

                                    <div className="flex items-center gap-4 mb-4">
                                      <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{service.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span>{service.bookings || 0}+ booked</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-2xl font-bold text-blue-600">Rs. {service.price}</p>
                                        <p className="text-xs text-gray-500">+ service fee</p>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleBookService(service);
                                        }}
                                        className="rounded-full"
                                      >
                                        Book Now
                                      </Button>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {service.tags?.map((tag, i) => (
                                        <span
                                          key={i}
                                          className={`text-xs px-2 py-1 rounded-full ${cfg.lightColor} ${cfg.textColor}`}
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          // List View
                          <div className="space-y-4">
                            {categoryServices.map((service) => (
                              <div
                                key={service._id}
                                className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleQuickView(service)}
                              >
                                <img
                                  src={serviceImages[service.category] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"}
                                  alt={service.name}
                                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-semibold text-lg">{service.name}</h3>
                                      <p className="text-sm text-gray-600">{service.description}</p>
                                    </div>
                                    {getRatingStars(service.rating)}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" /> {service.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" /> {service.bookings || 0} bookings
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" /> Available islandwide
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="text-2xl font-bold text-blue-600">Rs. {service.price}</p>
                                    <Button size="sm">Book Now</Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="bg-gray-50 px-6 py-4">
                        <Button
                          variant="ghost"
                          className="text-blue-600"
                          onClick={() => setSelectedCategory(cat)}
                        >
                          View all {cfg.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedService && (
                <>
                  {/* Service Image */}
                  <div className="relative h-64">
                    <img
                      src={serviceImages[selectedService.category] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"}
                      alt={selectedService.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedService(null)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedService.name}</h2>
                        <div className="flex items-center gap-2">
                          {getRatingStars(selectedService.rating)}
                          <span className="text-sm text-gray-500">(124 reviews)</span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-0 px-3 py-1">
                        {selectedService.category}
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-6">{selectedService.description}</p>

                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{selectedService.duration}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold">Rs. {selectedService.price}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-sm text-gray-600">Booked</p>
                        <p className="font-semibold">{selectedService.bookings || 150}+ times</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ThumbsUp className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-sm text-gray-600">Satisfaction</p>
                        <p className="font-semibold">98%</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">What's included:</h3>
                      <ul className="space-y-2">
                        {selectedService.features?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        onClick={() => {
                          handleBookService(selectedService);
                          setSelectedService(null);
                        }}
                      >
                        Book Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          alert("Contact support: +94 11 234 5678");
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FixMate?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best service experience with certified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Certified Experts",
                description: "All technicians are verified and background-checked"
              },
              {
                icon: Clock,
                title: "On-Time Service",
                description: "We respect your time with punctual arrivals"
              },
              {
                icon: Shield,
                title: "Guaranteed Work",
                description: "6-month warranty on all repairs"
              },
              {
                icon: ThumbsUp,
                title: "Satisfaction Guaranteed",
                description: "100% money-back if not satisfied"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Need Emergency Service?</h2>
          <p className="text-xl text-blue-100 mb-8">
            We're available 24/7 for urgent repairs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = "tel:+94112345678"}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Line
            </Button>
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100"
              onClick={() => navigate("/book-service")}
            >
              Book Regular Service
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}