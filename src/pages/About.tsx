import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import heroImg from '../assets/pickup_truck.webp';
import storyImg from '../assets/ChatGPT Image Jul 20, 2026, 11_30_15 PM.webp';

const About: React.FC = () => {
  const storyContent = "Backed by 10+ years of experience in driving and goods transportation, we deliver every shipment with care, professionalism, and reliability.";

  const mission = "To deliver exceptional logistics solutions that empower businesses to grow, ensuring every package is handled with the utmost care, precision, and speed.";
  const vision = "To be the most trusted and innovative transport company in the region, setting new standards for reliability, sustainability, and customer satisfaction in the logistics industry.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24"
    >
      {/* Page Header */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={heroImg} alt="Background" loading="eager" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">ABOUT SJA TRANSPORT</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Delivering excellence in logistics since our inception.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        {/* Company Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title="Our Story" />
            <div className="space-y-4 text-text/80 text-lg leading-relaxed">
              <p>{storyContent}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <img src={storyImg} alt="Our Fleet" loading="lazy" className="w-full h-full object-cover aspect-video" />
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-10 rounded-3xl border border-gray-100"
          >
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Mission</h3>
            <div className="text-text/70 text-lg leading-relaxed">
              <p>{mission}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-primary text-white p-10 rounded-3xl shadow-xl"
          >
            <h3 className="text-2xl font-heading font-bold mb-4">Our Vision</h3>
            <div className="text-white/80 text-lg leading-relaxed">
              <p>{vision}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
