import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import heroImg from '../assets/pickup_truck.webp';
import { ToastContext } from '../layouts/MainLayout';

const Contact: React.FC = () => {
  const { addToast } = useContext(ToastContext);

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
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We're here to help and answer any question you might have.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl font-heading font-bold text-primary mb-8">Get in Touch</h2>
            <p className="text-text/70 text-lg mb-10 leading-relaxed">
              Whether you need to book a shipment, inquire about our services, or need support with an ongoing delivery, our team is ready to assist you.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-accent w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-primary mb-2">Our Office</h4>
                  <p className="text-text/70">Thanjavur, Pattukkottai, Tamil Nadu</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Phone className="text-accent w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-primary mb-2">Phone</h4>
                  <p className="text-text/70">+91 9047415661</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Mail className="text-accent w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold text-primary mb-2">Email</h4>
                  <p className="text-text/70">sjatransportofficial@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-gray-200 rounded-3xl overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center text-text/50 font-medium">
                Interactive Map Placeholder
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ContactForm
              onSuccess={() => addToast('success', 'Message sent successfully!')}
              onError={(msg) => addToast('error', msg)}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
