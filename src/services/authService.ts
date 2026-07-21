import api from './api';

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profilePhoto?: string;
  lastLogin?: string;
  token?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<Admin> => {
    const payload: any = await api.post('/auth/login', { email, password });
    return payload?.data || payload;
  },

  getProfile: async (): Promise<Admin> => {
    const payload: any = await api.get('/admin/profile');
    return payload?.data || payload;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  updateProfile: async (data: FormData): Promise<Admin> => {
    const payload: any = await api.put('/admin/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return payload?.data || payload;
  },

  changePassword: async (data: any): Promise<any> => {
    const payload: any = await api.put('/admin/change-password', data);
    return payload?.data || payload;
  },
};
