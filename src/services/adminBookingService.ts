import api from './api';

export interface Booking {
  _id: string;
  bookingId?: string;
  customerName: string;
  customerPhone: string;
  phone: string;
  serviceType: string;
  vehicleType: string;
  destinationState: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  goodsDescription: string;
  trackingId: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Cancelled';
  bookingStatus: 'Pending' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export const adminBookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const payload: any = await api.get('/bookings');
    const data = payload?.data || payload || [];
    // Normalize fields for frontend compatibility
    return data.map((b: any) => ({
      _id: b._id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      customerPhone: b.phone,
      phone: b.phone,
      email: b.email,
      serviceType: b.serviceType,
      vehicleType: b.vehicleType,
      destinationState: b.destinationState,
      pickupLocation: b.pickupLocation,
      deliveryLocation: b.deliveryLocation,
      pickupDate: b.pickupDate,
      goodsDescription: b.goodsDescription,
      trackingId: b.trackingId,
      status: b.bookingStatus,
      bookingStatus: b.bookingStatus,
      createdAt: b.createdAt,
    }));
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const payload: any = await api.get(`/bookings/${id}`);
    const data = payload?.data || payload;
    return {
      _id: data._id,
      bookingId: data.bookingId,
      customerName: data.customerName,
      customerPhone: data.phone,
      serviceType: data.serviceType,
      vehicleType: data.vehicleType,
      destinationState: data.destinationState,
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      pickupDate: data.pickupDate,
      goodsDescription: data.goodsDescription,
      trackingId: data.trackingId,
      status: data.bookingStatus,
      createdAt: data.createdAt,
    } as Booking;
  },

  updateBooking: async (id: string, data: Partial<Booking>): Promise<Booking> => {
    const payload: any = await api.put(`/bookings/${id}`, data);
    return payload?.data || payload;
  },

  updateBookingStatus: async (id: string, bookingStatus: string): Promise<Booking> => {
    const payload: any = await api.patch(`/bookings/${id}/status`, { bookingStatus });
    return payload?.data || payload;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};
