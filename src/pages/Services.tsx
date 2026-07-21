import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Map } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import heroImg from '../assets/pickup_truck.webp';
import { useTransportServices, getTransportServiceCardData } from '../hooks/useTransportServices';

const Services: React.FC = () => {
  const { services, loading } = useTransportServices();
  const coreServices = services.map(getTransportServiceCardData);

  const features = [
    { title: 'Fully Insured', desc: 'Comprehensive coverage for total peace of mind.', Icon: Shield },
    { title: 'On-Time Delivery', desc: 'Punctuality is the core of our operations.', Icon: Clock },
    { title: 'Wide Coverage', desc: 'Extensive network reaching even remote locations.', Icon: Map },
  ];

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
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Our Services</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Comprehensive logistics solutions tailored for your specific needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <SectionTitle title="Core Transport Solutions" centered />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-72 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm animate-pulse" />
            ))
          ) : (
            coreServices.map((service, idx) => (
              <ServiceCard
                key={service._id}
                title={service.title}
                description={service.description}
                Icon={service.Icon}
                capacity={service.capacity}
                gradient={service.gradient}
                delay={idx * 0.1}
              />
            ))
          )}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-3xl p-12">
          <SectionTitle title="Why Choose SJA TRANSPORT" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-accent">
                  <feature.Icon size={32} />
                </div>
                <h4 className="text-xl font-heading font-bold text-primary mb-3">{feature.title}</h4>
                <p className="text-text/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Services;
