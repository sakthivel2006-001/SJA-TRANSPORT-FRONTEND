import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createContactMessage } from '../services/contactService';

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      onSuccess?.();
    } catch (err: any) {
      onError?.(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center"
      >
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Send className="text-green-600 w-8 h-8" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-primary mb-3">Message Sent!</h3>
        <p className="text-text/70 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-accent hover:text-primary transition-all"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-heading font-bold text-primary mb-6">Send us a Message</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Your Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            required
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Subject *</label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="Subject"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Message *</label>
          <textarea
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none disabled:opacity-50"
            placeholder="Write your message here..."
          />
        </div>
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-medium rounded-xl shadow-lg hover:bg-accent hover:text-primary transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
      </div>
    </form>
  );
};

export default ContactForm;
