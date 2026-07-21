import React, { useEffect, useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface Feedback {
  _id: string;
  customerName: string;
  vehicle: string;
  service: string;
  rating: number;
  review: string;
  createdAt: string;
}

const CustomerFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    vehicle: 'Tata Intra Pickup',
    service: 'Household Items Transport',
    rating: 5,
    review: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get('/feedback/public');
        setFeedbacks(res.data?.data || res.data || []);
      } catch (err) {
        console.error('Failed to load feedback', err);
      }
    };
    fetchFeedbacks();
  }, []);

  // Auto Slider
  useEffect(() => {
    if (feedbacks.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [feedbacks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRating = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/feedback', formData);
      setSubmitted(true);
      setFormData({
        customerName: '',
        phone: '',
        vehicle: 'Tata Intra Pickup',
        service: 'Household Items Transport',
        rating: 5,
        review: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="feedback">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4"
          >
            Customer <span className="text-accent">Feedback</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text/70 max-w-2xl mx-auto"
          >
            What our clients say about their transport experience with us.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Display Slider */}
          <div className="space-y-8 relative">
            <h3 className="text-2xl font-heading font-bold text-primary mb-6 flex items-center gap-3">
              <Star className="text-accent fill-accent" size={28} />
              Verified Reviews
            </h3>

            {feedbacks.length > 0 ? (
              <div className="relative h-[300px] w-full perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -50, rotateY: -10 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                      <div>
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: feedbacks[currentIndex].rating }).map((_, i) => (
                            <Star key={i} className="text-accent fill-accent" size={20} />
                          ))}
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed italic mb-6 line-clamp-4">
                          "{feedbacks[currentIndex].review}"
                        </p>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <p className="font-bold text-primary text-lg">{feedbacks[currentIndex].customerName}</p>
                        <p className="text-sm text-gray-500">{feedbacks[currentIndex].service} • {feedbacks[currentIndex].vehicle}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(feedbacks[currentIndex].createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Dots */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                  {feedbacks.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm">
                <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
              </div>
            )}
          </div>

          {/* Feedback Form */}
          <div>
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center h-full flex flex-col justify-center items-center min-h-[500px]"
              >
                <div className="flex gap-1 justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <Star className="w-12 h-12 text-accent fill-accent" />
                    </motion.div>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Thank you for sharing your feedback.</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Your review has been submitted successfully and will be published after admin approval.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Submit Another Review
                </button>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
              >
                <h3 className="text-2xl font-heading font-bold text-primary mb-6">Leave a Review</h3>
                
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input 
                      type="text" required name="customerName" value={formData.customerName} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Used *</label>
                    <select 
                      name="service" required value={formData.service} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all appearance-none"
                    >
                      <option value="Household Items Transport">Household Items Transport</option>
                      <option value="Coconut Transport">Coconut Transport</option>
                      <option value="Cotton Box Transport">Cotton Box Transport</option>
                      <option value="Machinery Items Transport">Machinery Items Transport</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Used *</label>
                    <select 
                      name="vehicle" required value={formData.vehicle} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all appearance-none"
                    >
                      <option value="Tata Intra Pickup">Tata Intra Pickup</option>
                      <option value="Ashok Leyland DOST">Ashok Leyland DOST</option>
                      <option value="Tata Ace">Tata Ace</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} type="button" onClick={() => setRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star className={`w-8 h-8 ${star <= formData.rating ? 'text-accent fill-accent' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Message *</label>
                  <textarea 
                    name="review" required value={formData.review} onChange={handleChange} rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-medium rounded-xl shadow-lg hover:bg-accent hover:text-primary transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  Submit Feedback
                </button>
              </motion.form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;
