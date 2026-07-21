import api from './api';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  replyStatus: 'New' | 'Read' | 'Replied';
  createdAt: string;
}

export const adminContactService = {
  getAllMessages: async (): Promise<ContactMessage[]> => {
    const payload: any = await api.get('/contact');
    const raw = payload?.data || payload || [];
    return raw.map((r: any) => ({
      _id: r._id,
      name: r.customerName || r.name || '',
      email: r.email,
      subject: r.subject,
      message: r.message,
      isRead: !!r.isRead,
      replyStatus: r.status || 'New',
      createdAt: r.createdAt,
    }));
  },

  markAsRead: async (id: string): Promise<ContactMessage> => {
    const payload: any = await api.patch(`/contact/${id}/read`);
    return payload?.data || payload;
  },

  updateReplyStatus: async (id: string, status: string): Promise<ContactMessage> => {
    const payload: any = await api.patch(`/contact/${id}/status`, { status });
    return payload?.data || payload;
  },

  replyToMessage: async (id: string, replyMessage: string, subject?: string): Promise<ContactMessage> => {
    const payload: any = await api.patch(`/contact/${id}/reply`, { message: replyMessage, subject });
    return payload?.data || payload;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/contact/${id}`);
  },
};
