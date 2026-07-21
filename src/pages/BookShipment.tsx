import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import BookingForm from '../components/BookingForm';
import heroImg from '../assets/pickup_truck.webp';
import { ToastContext } from '../layouts/MainLayout';

const BookShipment: React.FC = () => {
  const { addToast } = useContext(ToastContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 min-h-screen bg-gray-50"
    >
      {/* Page Header */}
      <div className="bg-primary text-white py-20 relative overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Background" loading="eager" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Book a Shipment</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Fill out the form below to schedule your transport with us.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        <BookingForm
          onSuccess={() => addToast('success', 'Booking submitted successfully! We will contact you shortly.')}
          onError={(msg) => addToast('error', msg)}
        />
      </div>
    </motion.div>
  );
};

export default BookShipment;
