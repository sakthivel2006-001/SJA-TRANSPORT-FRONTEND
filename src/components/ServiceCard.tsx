import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  capacity?: string;
  delay?: number;
  gradient?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  Icon,
  capacity,
  delay = 0,
  gradient = 'from-primary to-primary/80',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      {/* Gradient border effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`} />

      <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-heading font-bold text-primary mb-3">{title}</h3>

        {/* Description */}
        <p className="text-text/60 leading-relaxed text-[15px] mb-4 flex-grow">{description}</p>

        {/* Capacity Badge */}
        {capacity && (
          <div className="mb-5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r ${gradient} text-white px-3 py-1.5 rounded-full`}>
              {capacity}
            </span>
          </div>
        )}

        {/* Book Now Link */}
        <Link
          to={`/book?service=${encodeURIComponent(title)}`}
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:text-accent transition-colors duration-300"
        >
          Book Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
