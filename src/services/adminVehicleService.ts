import api from './api';

const API_URL = '/vehicles';

export interface Vehicle {
  _id: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: string;
  capacity: string;
  suitableGoods: string;
  driverName: string;
  driverPhone: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  description?: string;
  image: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Vehicle[];
}

export const adminVehicleService = {
  getAllVehicles: async (params?: { search?: string; vehicleType?: string; status?: string; sort?: string; page?: number; limit?: number }): Promise<VehicleResponse> => {
    const res: any = await api.get(API_URL, { params });
    // Handle both cases (wrapped and unwrapped response depending on interceptor)
    return res.data ? res : { data: res, count: res.length, total: res.length, page: 1, pages: 1, success: true };
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const res: any = await api.get(`${API_URL}/${id}`);
    return res.data?.data || res.data;
  },

  createVehicle: async (data: FormData): Promise<Vehicle> => {
    const res: any = await api.post(API_URL, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  },

  updateVehicle: async (id: string, data: FormData): Promise<Vehicle> => {
    const res: any = await api.put(`${API_URL}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  }
};
