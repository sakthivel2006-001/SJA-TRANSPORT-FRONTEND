import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

const serviceStates = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Pondicherry',
  'Goa',
];

const ServiceAreas: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-[#1e3255] to-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            <Navigation className="w-4 h-4" />
            Service Coverage
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            We Deliver Across South India
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Our transport network covers major cities and rural areas across multiple states.
          </p>
        </motion.div>

        {/* States Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {serviceStates.map((state, idx) => (
            <motion.div
              key={state}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group"
            >
              <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-2xl px-5 py-4 backdrop-blur-sm transition-all duration-300 cursor-default">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium text-[15px]">{state}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 rounded-full px-6 py-3 backdrop-blur-sm">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Need delivery to another state? <a href="/contact" className="underline hover:text-white transition-colors">Contact us</a> for custom routes.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceAreas;
