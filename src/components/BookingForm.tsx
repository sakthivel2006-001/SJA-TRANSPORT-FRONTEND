import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { createBooking } from '../services/bookingService';

interface BookingFormProps {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onError }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    serviceType: 'Household Items Transport',
    serviceTypeOther: '',
    vehicleType: 'Tata Intra Pickup',
    vehicleTypeOther: '',
    pickupLocation: '',
    destinationState: 'Tamil Nadu',
    destinationStateOther: '',
    deliveryLocation: '',
    pickupDate: '',
    goodsDescription: '',
    additionalNotes: ''
  });

  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedService = params.get('service');
    if (selectedService) {
      setFormData((prev) => ({ ...prev, serviceType: selectedService }));
    }
  }, [location.search]);

  const getFinalValue = (field: string, otherField: string) => {
    return formData[field as keyof typeof formData] === 'Other' 
      ? formData[otherField as keyof typeof formData] 
      : formData[field as keyof typeof formData];
  };

  const openWhatsApp = (): void => {
    const finalService = getFinalValue('serviceType', 'serviceTypeOther');
    const finalVehicle = getFinalValue('vehicleType', 'vehicleTypeOther');
    const finalState = getFinalValue('destinationState', 'destinationStateOther');

    const message = `🚛 SJA TRANSPORT

New Booking Request

Customer Name: ${formData.customerName}
Phone: ${formData.phone}
Service Type: ${finalService}
Vehicle Type: ${finalVehicle}
Pickup Location: ${formData.pickupLocation}
Destination State: ${finalState}
Delivery Location: ${formData.deliveryLocation}
Pickup Date: ${formData.pickupDate}
Goods Description: ${formData.goodsDescription}
Additional Notes: ${formData.additionalNotes}
`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919047415661?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createBooking({
        customerName: formData.customerName,
        phone: formData.phone,
        serviceType: getFinalValue('serviceType', 'serviceTypeOther'),
        vehicleType: getFinalValue('vehicleType', 'vehicleTypeOther'),
        destinationState: getFinalValue('destinationState', 'destinationStateOther'),
        pickupLocation: formData.pickupLocation,
        deliveryLocation: formData.deliveryLocation,
        pickupDate: formData.pickupDate,
        goodsDescription: formData.goodsDescription,
        additionalNotes: formData.additionalNotes,
      });
      // show success (e.g. toast) first
      onSuccess?.();
      // open WhatsApp with the submitted data before clearing the form
      openWhatsApp();
      setSubmitted(true);
      setFormData({
        customerName: '', phone: '', serviceType: 'Household Items Transport', serviceTypeOther: '',
        vehicleType: 'Tata Intra Pickup', vehicleTypeOther: '', pickupLocation: '',
        destinationState: 'Tamil Nadu', destinationStateOther: '', deliveryLocation: '',
        pickupDate: '', goodsDescription: '', additionalNotes: ''
      });
      setShowSummary(false);
    } catch (err: any) {
      onError?.(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto text-center"
      >
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Send className="text-green-600 w-10 h-10" />
        </div>
        <h3 className="text-3xl font-heading font-bold text-primary mb-4">Booking Confirmed!</h3>
        <p className="text-text/70 text-lg mb-8">
          Thank you! Your shipment request has been submitted successfully. We'll contact you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-accent hover:text-primary transition-all"
        >
          Book Another Shipment
        </button>
      </motion.div>
    );
  }

  if (showSummary) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-3xl mx-auto">
        <h3 className="text-2xl font-heading font-bold text-primary mb-6 flex items-center gap-3">
          <CheckCircle2 className="text-accent" /> Booking Summary
        </h3>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text/60 font-medium">Customer Name</p>
              <p className="font-semibold text-gray-900">{formData.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-text/60 font-medium">Phone Number</p>
              <p className="font-semibold text-gray-900">{formData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-text/60 font-medium">Service Type</p>
              <p className="font-semibold text-gray-900">{getFinalValue('serviceType', 'serviceTypeOther')}</p>
            </div>
            <div>
              <p className="text-sm text-text/60 font-medium">Vehicle Type</p>
              <p className="font-semibold text-gray-900">{getFinalValue('vehicleType', 'vehicleTypeOther')}</p>
            </div>
            <div>
              <p className="text-sm text-text/60 font-medium">Pickup Details</p>
              <p className="font-semibold text-gray-900">{formData.pickupLocation} (on {formData.pickupDate})</p>
            </div>
            <div>
              <p className="text-sm text-text/60 font-medium">Delivery Details</p>
              <p className="font-semibold text-gray-900">{formData.deliveryLocation}, {getFinalValue('destinationState', 'destinationStateOther')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-text/60 font-medium">Goods Description</p>
              <p className="font-semibold text-gray-900">{formData.goodsDescription}</p>
            </div>
            {formData.additionalNotes && (
              <div className="md:col-span-2">
                <p className="text-sm text-text/60 font-medium">Additional Notes</p>
                <p className="font-semibold text-gray-900">{formData.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowSummary(false)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Back to Edit
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => { openWhatsApp(); handleSubmit(); }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <MessageCircle size={18} />
              Book via WhatsApp
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl shadow-lg hover:bg-accent hover:text-primary transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {loading ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleProceedToSummary} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Customer Name *</label>
          <input
            type="text"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Service Type *</label>
          <select
            name="serviceType"
            required
            value={formData.serviceType}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50 appearance-none"
          >
            <option value="Household Items Transport">Household Items Transport</option>
            <option value="Coconut Transport">Coconut Transport</option>
            <option value="Cotton Box Transport">Cotton Box Transport</option>
            <option value="Machinery Items Transport">Machinery Items Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {formData.serviceType === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">Specify Service Type *</label>
            <input
              type="text"
              name="serviceTypeOther"
              required
              value={formData.serviceTypeOther}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
              placeholder="E.g., Office Relocation"
            />
          </div>
        )}

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Preferred Vehicle *</label>
          <select
            name="vehicleType"
            required
            value={formData.vehicleType}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50 appearance-none"
          >
            <option value="Tata Intra Pickup">Tata Intra Pickup</option>
            <option value="Ashok Leyland DOST">Ashok Leyland DOST</option>
            <option value="Tata Ace">Tata Ace</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {formData.vehicleType === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">Specify Vehicle Type *</label>
            <input
              type="text"
              name="vehicleTypeOther"
              required
              value={formData.vehicleTypeOther}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
              placeholder="E.g., 20ft Container"
            />
          </div>
        )}

        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Pickup Location *</label>
          <input
            type="text"
            name="pickupLocation"
            required
            value={formData.pickupLocation}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="123 Start St, City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Delivery Location *</label>
          <input
            type="text"
            name="deliveryLocation"
            required
            value={formData.deliveryLocation}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="456 End Ave, City"
          />
        </div>

        {/* Destination State */}
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Destination State *</label>
          <select
            name="destinationState"
            required
            value={formData.destinationState}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50 appearance-none"
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Goa">Goa</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {formData.destinationState === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">Specify State *</label>
            <input
              type="text"
              name="destinationStateOther"
              required
              value={formData.destinationStateOther}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
              placeholder="E.g., Gujarat"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Pickup Date *</label>
          <input
            type="date"
            name="pickupDate"
            required
            value={formData.pickupDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-text/80 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text/80 mb-2">Goods Description *</label>
          <input
            type="text"
            name="goodsDescription"
            required
            value={formData.goodsDescription}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50"
            placeholder="e.g. 5 boxes of electronics"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text/80 mb-2">Additional Notes</label>
          <textarea
            name="additionalNotes"
            rows={4}
            value={formData.additionalNotes}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none disabled:opacity-50"
            placeholder="Any special instructions..."
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-10 py-4 bg-primary text-white font-medium rounded-xl shadow-lg hover:bg-accent transition-all hover:text-primary disabled:opacity-50 w-full md:w-auto"
        >
          Review Booking Details <ArrowLeft className="w-5 h-5 rotate-180" />
        </motion.button>
      </div>
    </form>
  );
};

export default BookingForm;
