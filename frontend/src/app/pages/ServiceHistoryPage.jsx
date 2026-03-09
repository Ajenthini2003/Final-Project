// src/app/pages/ServiceHistoryPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Calendar,
  Clock,
  User,
  FileText,
  Download,
  Star,
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  Printer,
  MessageSquare,
  Share2,
  MoreVertical,
  Home,
  CreditCard,
  Settings
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
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
      damping: 12
    }
  }
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -4, scale: 1.02 }}
    onClick={onClick}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-1 flex items-center">
            <span>↑ {trend}%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

// Filter Bar Component
const FilterBar = ({ filters, activeFilter, onFilterChange, searchTerm, onSearchChange }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by service or issue..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
      
      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter.value
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                activeFilter === filter.value
                  ? 'bg-blue-400 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Service Card Component
const ServiceCard = ({ booking, plan, onViewDetails, onDownloadInvoice, onRateService, onContactSupport }) => {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const statusColors = {
    completed: 'bg-green-100 text-green-700 border-green-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    'in-progress': 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const statusIcons = {
    completed: CheckCircle,
    confirmed: AlertCircle,
    pending: Clock,
    cancelled: XCircle,
    'in-progress': Wrench
  };

  const StatusIcon = statusIcons[booking.status] || AlertCircle;

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Section - Service Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className={`p-3 rounded-xl ${statusColors[booking.status] || 'bg-gray-100'}`}>
                <StatusIcon className="w-5 h-5" />
              </div>
              
              {/* Service Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan?.name || 'Service Booking'}
                  </h3>
                  <Badge variant="outline" className={statusColors[booking.status]}>
                    {booking.status}
                  </Badge>
                  {booking.urgent && (
                    <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                      Urgent
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-3">{booking.issue}</p>
                
                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.scheduledDate || booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{booking.time}</span>
                  </div>
                  {booking.technicianId?.name || booking.technicianName && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{booking.technicianId?.name || booking.technicianName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Price & Actions */}
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₹{booking.price || booking.totalAmount || 0}</p>
              {booking.paid && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Paid
                </p>
              )}
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setExpanded(!expanded)}
                className="text-gray-600"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowActions(!showActions)}
                className="relative"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-6 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
            >
              <button
                onClick={() => {
                  onViewDetails(booking._id || booking.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> View Details
              </button>
              
              {booking.status === 'completed' && (
                <>
                  <button
                    onClick={() => {
                      onDownloadInvoice(booking._id || booking.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Invoice
                  </button>
                  
                  <button
                    onClick={() => {
                      onRateService(booking._id || booking.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" /> Rate Service
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  onContactSupport(booking._id || booking.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Contact Support
              </button>
              
              <button
                onClick={() => {
                  window.print();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Details
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Service Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID:</span>
                      <span className="text-gray-900 font-medium">#{booking._id || booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service Type:</span>
                      <span className="text-gray-900">{plan?.name || 'General Service'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-gray-900">{booking.duration || '2 hours'}</span>
                    </div>
                    {booking.technicianId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Technician ID:</span>
                        <span className="text-gray-900">{booking.technicianId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="text-gray-900">₹{booking.price || booking.totalAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax:</span>
                      <span className="text-gray-900">₹{booking.tax || '180'}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-700">Total:</span>
                      <span className="text-gray-900">₹{booking.total || '2,380'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="text-gray-900">{booking.paymentMethod || 'Credit Card'}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Notes</h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                      {booking.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewDetails(booking._id || booking.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Full Details
                </Button>
                
                {booking.status === 'completed' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDownloadInvoice(booking._id || booking.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Invoice
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRateService(booking._id || booking.id)}
                      className="flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Rate Service
                    </Button>
                  </>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onContactSupport(booking._id || booking.id)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Get Help
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.share?.({
                      title: 'Service Details',
                      text: `Service: ${plan?.name}`,
                      url: window.location.href
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Rating Modal Component
const RatingModal = ({ isOpen, onClose, bookingId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Service</h3>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Review Text */}
          <textarea
            placeholder="Share your experience (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-4"
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSubmit(bookingId, rating, review);
                onClose();
              }}
              disabled={rating === 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Submit Rating
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Empty State Component
const EmptyState = ({ onBrowseServices }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
      <Calendar className="w-12 h-12 text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Service History</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      You haven't booked any services yet. Start by booking your first repair service.
    </p>
    <Button 
      onClick={onBrowseServices}
      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
    >
      <Wrench className="w-4 h-4 mr-2" />
      Browse Services
    </Button>
  </motion.div>
);

// Main Component
export default function ServiceHistoryPage() {
  const navigate = useNavigate();
  const { bookings, plans, user } = useApp();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, bookingId: null });
  const itemsPerPage = 5;

  // Filter configurations
  const filters = [
    { value: 'all', label: 'All Services', count: bookings.length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  // Filter and search logic
  const filteredBookings = bookings
    .filter(booking => {
      const plan = plans.find(p => p.id === booking.planId);
      const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
      const matchesSearch = searchTerm === '' || 
        (plan?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        booking.issue?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleViewDetails = (bookingId) => {
    navigate(`/history/${bookingId}`);
  };

  const handleDownloadInvoice = (bookingId) => {
    // In real app, this would trigger PDF download
    alert(`Downloading invoice for booking #${bookingId}`);
    toast.success('Invoice downloaded successfully');
  };

  const handleRateService = (bookingId) => {
    setRatingModal({ isOpen: true, bookingId });
  };

  const handleSubmitRating = (bookingId, rating, review) => {
    // In real app, this would send rating to backend
    console.log('Rating submitted:', { bookingId, rating, review });
    toast.success('Thank you for your feedback!');
  };

  const handleContactSupport = (bookingId) => {
    navigate('/support', { state: { bookingId, issue: 'Service Related' } });
  };

  const handleBrowseServices = () => {
    navigate('/services');
  };

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pending: bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Service History
          </h1>
          <p className="text-gray-500 mt-1">Track and manage all your past and upcoming services</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/services')}
            className="flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Book New
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Services"
          value={stats.total}
          icon={Calendar}
          color="blue"
          trend={12}
          onClick={() => setActiveFilter('all')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
          trend={8}
          onClick={() => setActiveFilter('completed')}
        />
        <StatCard
          title="In Progress"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          onClick={() => setActiveFilter('pending')}
        />
        <StatCard
          title="Total Spent"
          value={`₹${bookings.reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString()}`}
          icon={CreditCard}
          color="purple"
          onClick={() => navigate('/payments')}
        />
      </motion.div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Service List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>Service Records</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Service' : 'Services'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {paginatedBookings.map((booking) => {
                const plan = plans.find((p) => p.id === booking.planId);
                return (
                  <ServiceCard
                    key={booking._id || booking.id}
                    booking={booking}
                    plan={plan}
                    onViewDetails={handleViewDetails}
                    onDownloadInvoice={handleDownloadInvoice}
                    onRateService={handleRateService}
                    onContactSupport={handleContactSupport}
                  />
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} services
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState onBrowseServices={handleBrowseServices} />
          )}
        </CardContent>
      </Card>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, bookingId: null })}
        bookingId={ratingModal.bookingId}
        onSubmit={handleSubmitRating}
      />
    </motion.div>
  );
}