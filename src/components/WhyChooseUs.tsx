import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Headphones, Clock, Award, Users, Zap } from 'lucide-react';

const reasons = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'Insured Goods',
    description: 'Every shipment is fully covered, giving you complete peace of mind during transit.',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: 'On-Time Delivery',
    description: 'We pride ourselves on punctuality. Your goods arrive exactly when promised.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support via phone, WhatsApp, and email.',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    icon: <Award className="w-7 h-7" />,
    title: 'Experienced Drivers',
    description: 'Professional, trained drivers who handle your goods with utmost care.',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Trusted by 1200+',
    description: 'Over 1,200 happy customers rely on us for their regular transport needs.',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: 'Fast Booking',
    description: 'Book your transport in under 2 minutes through our simple online form.',
    gradient: 'from-cyan-400 to-sky-500',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #1B2845 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            Why Businesses Trust Us
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Why Choose SJA Transport?
          </h2>
          <p className="text-lg text-text/60 max-w-2xl mx-auto">
            We go above and beyond to deliver a transport experience that's reliable, safe, and stress-free.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, idx) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-xl hover:border-gray-200 transition-all duration-400 h-full">
                {/* Hover gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {reason.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">{reason.title}</h3>

                  {/* Description */}
                  <p className="text-text/60 text-[15px] leading-relaxed">{reason.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
