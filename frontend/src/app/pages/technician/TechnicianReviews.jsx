// src/app/pages/technician/TechnicianReviews.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Star } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

// Sample reviews — replace with real API call when backend review system is in place
const SAMPLE_REVIEWS = [
  { id: 1, customerName: 'Pradeep Silva',         rating: 5, service: 'AC Repair',          comment: 'Excellent work! Very professional and on time.',                            date: '2026-02-28' },
  { id: 2, customerName: 'Nishadi Fernando',      rating: 4, service: 'Washing Machine',    comment: 'Good job, fixed the issue quickly. Would recommend.',                        date: '2026-02-20' },
  { id: 3, customerName: 'Kasun Rajapaksa',       rating: 5, service: 'Electrical Wiring',  comment: 'Very skilled technician. Explained everything clearly.',                     date: '2026-02-15' },
  { id: 4, customerName: 'Thilini Wickramasinghe',rating: 3, service: 'Plumbing',           comment: 'Job done but took longer than expected.',                                    date: '2026-02-10' },
  { id: 5, customerName: 'Dilshan Mendis',        rating: 5, service: 'Smart Lock Setup',   comment: 'Amazing service! Set up everything perfectly and showed me how to use it.',  date: '2026-02-05' },
];

function StarRating({ rating, size = 4 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${i <= rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function TechnicianReviews() {
  const { user } = useAuth();
  const reviews = SAMPLE_REVIEWS;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const dist = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct:   reviews.length ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100) : 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">What your customers are saying</p>
      </div>

      {/* Summary — same AdminDashboard stat card style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <p className="text-6xl font-bold text-gray-900 mb-2">{avgRating}</p>
            <StarRating rating={Math.round(avgRating)} size={6} />
            <p className="text-sm text-gray-500 mt-2">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardContent className="p-6 space-y-3">
            {dist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-4">{star}</span>
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 flex-shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Review cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {reviews.map(review => (
          <motion.div key={review.id} variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.customerName}</p>
                      <p className="text-xs text-gray-500">{review.service} · {review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
