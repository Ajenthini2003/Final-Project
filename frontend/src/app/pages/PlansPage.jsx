// /frontend/src/app/pages/PlansPage.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircleIcon, 
  XCircleIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  UserGroupIcon,
  WrenchIcon
} from "@heroicons/react/24/outline";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { getRepairPlans } from "../../api";

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

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

// Plan Card Component
const PlanCard = ({ plan, isSubscribed, onSubscribe, onUnsubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await onSubscribe(plan._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await onUnsubscribe(plan._id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
    >
      {/* Plan Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-blue-100 text-sm">{plan.description}</p>
      </div>

      {/* Plan Price */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold text-gray-900">Rs. {plan.price}</span>
          <span className="text-gray-500 ml-2">/{plan.duration || 'month'}</span>
        </div>
      </div>

      {/* Plan Features */}
      <div className="p-6">
        <ul className="space-y-3">
          {plan.features?.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Plan Actions */}
      <div className="p-6 bg-gray-50">
        {isSubscribed ? (
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Unsubscribe'}
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Main PlansPage Component
const PlansPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    plans, 
    subscribedPlans, 
    subscribeToPlan, 
    unsubscribeFromPlan,
    loadingUser 
  } = useApp();

  const [filter, setFilter] = useState('all'); // 'all', 'monthly', 'yearly'
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loadingUser && !user) {
      navigate('/login', { state: { from: '/plans' } });
    }
  }, [user, loadingUser, navigate]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Filter plans based on search and duration
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || plan.duration === filter;
    return matchesSearch && matchesFilter;
  });

  // Check if a plan is subscribed
  const isPlanSubscribed = (planId) => {
    return subscribedPlans.some(sub => sub.planId === planId || sub._id === planId);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Repair & Maintenance Plans
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-blue-100 max-w-2xl"
          >
            Choose the perfect plan for your home maintenance needs. All plans include professional service and quality guarantee.
          </motion.p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Plans
              </button>
              <button
                onClick={() => setFilter('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setFilter('year')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'year' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        {filteredPlans.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                isSubscribed={isPlanSubscribed(plan._id)}
                onSubscribe={subscribeToPlan}
                onUnsubscribe={unsubscribeFromPlan}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">No plans found matching your criteria.</p>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Our Plans?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WrenchIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Technicians</h3>
              <p className="text-gray-600 text-sm">Certified professionals with years of experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600 text-sm">100% satisfaction guarantee on all services</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock customer support</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyRupeeIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">Competitive rates with no hidden costs</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a cancellation fee?</h3>
              <p className="text-gray-600">No, you can cancel your subscription at any time without any cancellation fees.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">How do I book a service?</h3>
              <p className="text-gray-600">Once subscribed, you can book services directly from your dashboard or through our mobile app.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlansPage;