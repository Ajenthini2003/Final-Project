// src/app/pages/PaymentsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  CreditCard, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
  Eye,
  Printer,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  TrendingUp,
  PieChart,
  Home,
  Settings,
  HelpCircle,
  ChevronDown,
  MoreVertical,
  Receipt,
  Banknote,
  Wallet,
  Landmark,
  Smartphone
} from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';

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
const StatCard = ({ title, value, icon: Icon, color, trend, onClick, subtitle }) => (
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
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
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
const FilterBar = ({ filters, activeFilter, onFilterChange, searchTerm, onSearchChange, dateRange, onDateRangeChange }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by transaction ID or plan..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
      
      {/* Date Range Filter */}
      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
      
      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
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

// Payment Card Component
const PaymentCard = ({ payment, plan, onViewDetails, onDownloadReceipt, onContactSupport }) => {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <Banknote className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit card':
      case 'debit card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank transfer':
        return <Landmark className="w-4 h-4" />;
      case 'digital wallet':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const statusColors = {
    paid: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Section - Payment Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className={`p-3 rounded-xl ${statusColors[payment.status] || 'bg-gray-100'}`}>
                {getStatusIcon(payment.status)}
              </div>
              
              {/* Payment Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan?.name || 'Payment Transaction'}
                  </h3>
                  <Badge variant="outline" className={statusColors[payment.status]}>
                    {payment.status}
                  </Badge>
                  {payment.recurring && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      Recurring
                    </Badge>
                  )}
                </div>
                
                {/* Transaction ID */}
                <p className="text-sm text-gray-500 mb-2 font-mono">
                  TXN-{payment._id?.slice(-8) || payment.id || '********'}
                </p>
                
                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(payment.createdAt || payment.date || Date.now()), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(payment.createdAt || payment.date || Date.now()), 'hh:mm a')}</span>
                  </div>
                  {payment.paymentMethod || payment.method && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      {getPaymentMethodIcon(payment.paymentMethod || payment.method)}
                      <span>{payment.paymentMethod || payment.method}</span>
                    </div>
                  )}
                </div>

                {/* Payment Description */}
                {payment.planId?.name || payment.description && (
                  <p className="text-sm text-gray-600 mt-2">{payment.planId?.name || payment.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Amount & Actions */}
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ₹{payment.amount?.toLocaleString() || '0'}
              </p>
              {payment.tax && (
                <p className="text-xs text-gray-500">incl. GST ₹{payment.tax}</p>
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
                  onViewDetails(payment.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> View Details
              </button>
              
              {payment.status === 'paid' && (
                <button
                  onClick={() => {
                    onDownloadReceipt(payment.id);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Receipt
                </button>
              )}
              
              <button
                onClick={() => {
                  window.print();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Details
              </button>
              
              <button
                onClick={() => {
                  onContactSupport(payment.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" /> Get Help
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment Breakdown */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Payment Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="text-gray-900">₹{payment.subtotal || payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax (GST):</span>
                      <span className="text-gray-900">₹{payment.tax || '0'}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-700">Total:</span>
                      <span className="text-gray-900">₹{payment.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(payment.paymentMethod || payment.method)}
                      <span className="text-gray-900">{payment.paymentMethod || payment.method || 'Credit Card'}</span>
                    </div>
                    {payment.cardLast4 && (
                      <p className="text-gray-500">•••• {payment.cardLast4}</p>
                    )}
                    {payment.billingAddress && (
                      <p className="text-gray-500 text-xs">{payment.billingAddress}</p>
                    )}
                  </div>
                </div>

                {/* Transaction Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transaction Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction ID:</span>
                      <span className="text-gray-900 font-mono text-xs">
                        {payment.transactionId || `TXN-${payment.id}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment ID:</span>
                      <span className="text-gray-900 font-mono text-xs">PAY-{payment.id}</span>
                    </div>
                    {payment.reference && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference:</span>
                        <span className="text-gray-900">{payment.reference}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewDetails(payment.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Full Details
                </Button>
                
                {payment.status === 'paid' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDownloadReceipt(payment.id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`TXN-${payment.id}`);
                    toast.success('Transaction ID copied to clipboard');
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Copy ID
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`mailto:?subject=Payment Receipt&body=Payment ID: TXN-${payment.id}`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Receipt
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Chart Component (Simplified)
const SpendingChart = ({ data }) => (
  <div className="h-32 flex items-end gap-2 mt-4">
    {data?.map((item, index) => (
      <div key={index} className="flex-1 flex flex-col items-center gap-1">
        <div 
          className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer"
          style={{ height: `${item.percentage}%` }}
        />
        <span className="text-xs text-gray-500">{item.month}</span>
      </div>
    ))}
  </div>
);

// Empty State Component
const EmptyState = ({ onMakePayment }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
      <CreditCard className="w-12 h-12 text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment History</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      You haven't made any payments yet. Your transaction history will appear here.
    </p>
    <Button 
      onClick={onMakePayment}
      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
    >
      <DollarSign className="w-4 h-4 mr-2" />
      Make a Payment
    </Button>
  </motion.div>
);

// Main Component
export default function PaymentsPage() {
  const navigate = useNavigate();
  const { payments, plans, user } = useApp();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const itemsPerPage = 5;

  // Calculate totals
  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filter configurations
  const filters = [
    { value: 'all', label: 'All', count: payments.length },
    { value: 'paid', label: 'Paid', count: payments.filter(p => p.status === 'paid').length },
    { value: 'pending', label: 'Pending', count: payments.filter(p => p.status === 'pending').length },
    { value: 'failed', label: 'Failed', count: payments.filter(p => p.status === 'failed').length },
    { value: 'refunded', label: 'Refunded', count: payments.filter(p => p.status === 'refunded').length }
  ];

  // Filter and search logic
  const filteredPayments = payments
    .filter(payment => {
      const plan = plans.find(p => p.id === payment.planId);
      const matchesFilter = activeFilter === 'all' || payment.status === activeFilter;
      const matchesSearch = searchTerm === '' || 
        plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date range filtering
      if (dateRange !== 'all') {
        const paymentDate = new Date(payment.createdAt || payment.date || Date.now());
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        
        switch(dateRange) {
          case 'today':
            return matchesFilter && matchesSearch && paymentDate >= today;
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return matchesFilter && matchesSearch && paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return matchesFilter && matchesSearch && paymentDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
            return matchesFilter && matchesSearch && paymentDate >= yearAgo;
          default:
            return matchesFilter && matchesSearch;
        }
      }
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt||b.date||0) - new Date(a.createdAt||a.date||0));

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Spending data for chart
  const spendingData = [
    { month: 'Jan', percentage: 65 },
    { month: 'Feb', percentage: 45 },
    { month: 'Mar', percentage: 80 },
    { month: 'Apr', percentage: 55 },
    { month: 'May', percentage: 70 },
    { month: 'Jun', percentage: 40 }
  ];

  // Handlers
  const handleViewDetails = (paymentId) => {
    navigate(`/payments/${paymentId}`);
  };

  const handleDownloadReceipt = (paymentId) => {
    toast.success('Downloading receipt...');
    // In real app, this would trigger PDF download
    setTimeout(() => {
      toast.success('Receipt downloaded successfully');
    }, 1500);
  };

  const handleDownloadStatement = () => {
    toast.success('Generating statement...');
    // In real app, this would generate PDF
    setTimeout(() => {
      toast.success('Statement downloaded successfully');
    }, 2000);
  };

  const handleContactSupport = (paymentId) => {
    navigate('/support', { state: { paymentId, issue: 'Payment Related' } });
  };

  const handleMakePayment = () => {
    navigate('/plans');
  };

  const handleExportCSV = () => {
    toast.success('Exporting data...');
    // In real app, this would export CSV
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
            Payments & Billing
          </h1>
          <p className="text-gray-500 mt-1">Manage your transactions and download receipts</p>
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
            onClick={handleDownloadStatement}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Statement
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Paid"
          value={`₹${totalPaid.toLocaleString()}`}
          icon={CheckCircle}
          color="green"
          trend={12}
          subtitle="Lifetime payments"
          onClick={() => setActiveFilter('paid')}
        />
        <StatCard
          title="Pending"
          value={`₹${totalPending.toLocaleString()}`}
          icon={Clock}
          color="yellow"
          subtitle="Awaiting payment"
          onClick={() => setActiveFilter('pending')}
        />
        <StatCard
          title="Refunded"
          value={`₹${totalRefunded.toLocaleString()}`}
          icon={Banknote}
          color="purple"
          subtitle="Total refunds"
          onClick={() => setActiveFilter('refunded')}
        />
        <StatCard
          title="Avg. Payment"
          value={`₹${(totalPaid / (payments.filter(p => p.status === 'paid').length || 1)).toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
          subtitle="Per transaction"
          onClick={() => navigate('/analytics')}
        />
      </motion.div>

      {/* Spending Overview Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                Spending Overview
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Last 6 months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <SpendingChart data={spendingData} />
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>Total spent: ₹{totalPaid.toLocaleString()}</span>
              <span className="text-green-600">↑ 15% vs last period</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Payments List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Transaction History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {filteredPayments.length} {filteredPayments.length === 1 ? 'Transaction' : 'Transactions'}
              </Badge>
              <div className="flex gap-1 border-l pl-2">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="w-8 h-8 p-0"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="w-8 h-8 p-0"
                >
                  <CreditCard className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredPayments.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              {paginatedPayments.map((payment) => {
                const plan = plans.find((p) => p.id === payment.planId);
                return (
                  <PaymentCard
                    key={payment._id || payment.id}
                    payment={payment}
                    plan={plan}
                    onViewDetails={handleViewDetails}
                    onDownloadReceipt={handleDownloadReceipt}
                    onContactSupport={handleContactSupport}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState onMakePayment={handleMakePayment} />
          )}

          {/* Pagination */}
          {filteredPayments.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} transactions
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
        </CardContent>
      </Card>

      {/* Quick Actions Footer */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/plans')}>
              <CreditCard className="w-4 h-4 mr-2" />
              View Plans
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/support')}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Billing Support
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print Page
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Secured by <Shield className="w-3 h-3 inline" /> SSL Encryption
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}