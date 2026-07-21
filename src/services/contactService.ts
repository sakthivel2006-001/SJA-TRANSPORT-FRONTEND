import api from './api';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const createContactMessage = async (data: ContactPayload) => {
  const payload: any = await api.post('/contact', data);
  return payload?.data || payload;
};
