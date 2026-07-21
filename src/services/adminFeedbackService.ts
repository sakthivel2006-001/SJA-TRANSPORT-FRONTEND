import api from './api';

export interface Feedback {
  _id: string;
  customerName: string;
  phone?: string;
  vehicle: string;
  service: string;
  rating: number;
  comment: string;
  review: string;
  approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const adminFeedbackService = {
  getAllFeedback: async (): Promise<Feedback[]> => {
    const payload: any = await api.get('/feedback');
    return payload?.data || payload || [];
  },

  updateFeedbackStatus: async (id: string, status: string): Promise<Feedback> => {
    const payload: any = await api.patch(`/feedback/${id}/status`, { status });
    return payload?.data || payload;
  },

  deleteFeedback: async (id: string): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};
