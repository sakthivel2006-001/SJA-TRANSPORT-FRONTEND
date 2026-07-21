import api from './api';

export interface Achievement {
  _id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  image: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type AchievementInput = Pick<Achievement, 'title' | 'value' | 'description'> &
  Partial<Pick<Achievement, 'icon' | 'image' | 'displayOrder'>>;

export const adminAchievementService = {
  getAllAchievements: async (): Promise<Achievement[]> => {
    const payload: any = await api.get('/achievements');
    return payload?.data || payload || [];
  },

  getAchievementById: async (id: string): Promise<Achievement> => {
    const payload: any = await api.get(`/achievements/${id}`);
    return payload?.data || payload;
  },

  addAchievement: async (data: AchievementInput): Promise<Achievement> => {
    const payload: any = await api.post('/achievements', data);
    return payload?.data || payload;
  },

  updateAchievement: async (id: string, data: AchievementInput): Promise<Achievement> => {
    const payload: any = await api.put(`/achievements/${id}`, data);
    return payload?.data || payload;
  },

  deleteAchievement: async (id: string): Promise<void> => {
    await api.delete(`/achievements/${id}`);
  },
};
