import api from './api';

const API_URL = '/services';

export interface TransportService {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon: string;
  capacity?: string;
  image?: string;
  category?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const adminTransportServiceService = {
  getAllServices: async (opts?: { includeInactive?: boolean }): Promise<TransportService[]> => {
    const params: any = {};
    if (opts?.includeInactive) params.includeInactive = 'true';
    const res: any = await api.get(API_URL, { params });
    return res.data?.data || res.data || [];
  },

  getServiceById: async (id: string): Promise<TransportService> => {
    const res: any = await api.get(`${API_URL}/${id}`);
    return res.data?.data || res.data;
  },

  createService: async (data: Partial<TransportService>): Promise<TransportService> => {
    let res: any;
    if (data instanceof FormData) {
      res = await api.post(API_URL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      res = await api.post(API_URL, data);
    }
    return res.data?.data || res.data;
  },

  updateService: async (id: string, data: Partial<TransportService>): Promise<TransportService> => {
    let res: any;
    if (data instanceof FormData) {
      res = await api.put(`${API_URL}/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      res = await api.put(`${API_URL}/${id}`, data);
    }
    return res.data?.data || res.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  }
};
