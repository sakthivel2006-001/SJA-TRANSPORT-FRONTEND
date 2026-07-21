import api from './api';

const API_URL = '/dashboard';

export const adminDashboardService = {
  getStats: async () => {
    const res: any = await api.get(`${API_URL}/stats`);
    return res.data?.data || res.data || {};
  },
};

export default adminDashboardService;
