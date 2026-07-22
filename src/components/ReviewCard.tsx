import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  role?: string;
  review: string;
  avatar?: string;
  rating?: number;
  serviceType?: string;
  vehicleUsed?: string;
  date?: string;
  delay?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, role = 'Customer', review, avatar, rating = 5, serviceType, vehicleUsed, date, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1 text-accent">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={20} fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" />
          ))}
        </div>
        {date && <span className="text-xs text-gray-400">{new Date(date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>}
      </div>
      <p className="text-text/80 text-lg leading-relaxed mb-6 flex-grow italic">
        "{review}"
      </p>
      
      {(serviceType || vehicleUsed) && (
        <div className="mb-6 space-y-1 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          {serviceType && <p><span className="font-semibold text-gray-700">Service:</span> {serviceType}</p>}
          {vehicleUsed && <p><span className="font-semibold text-gray-700">Vehicle:</span> {vehicleUsed}</p>}
        </div>
      )}

      <div className="flex items-center space-x-4 mt-auto pt-6 border-t border-gray-50">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-heading font-semibold text-primary truncate">{name}</h4>
          <p className="text-sm text-text/60 truncate">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
