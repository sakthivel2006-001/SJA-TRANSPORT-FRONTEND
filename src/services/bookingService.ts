import api from './api';

export interface BookingPayload {
  customerName: string;
  phone: string;
  serviceType?: string;
  vehicleType?: string;
  destinationState?: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  goodsDescription: string;
  additionalNotes?: string;
}

export const createBooking = (data: BookingPayload) => {
  return api.post('/bookings', data);
};

export const getBookings = () => api.get('/bookings');

export const getBooking = (id: string) => api.get(`/bookings/${id}`);

export const updateBooking = (id: string, data: Partial<BookingPayload>) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id: string) => api.delete(`/bookings/${id}`);
