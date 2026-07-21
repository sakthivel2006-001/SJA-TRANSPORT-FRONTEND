import api from './api';

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  isFeatured?: boolean;
  vehicleName?: string;
  capacity?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  serviceType?: string;
  vehicleUsed?: string;
  deliveryDate?: string;
  completedDate?: string;
  order?: number;
  likesCount?: number;
  likedBy?: string[];
}

export const adminGalleryService = {
  getAllImages: async (): Promise<GalleryImage[]> => {
    const payload: any = await api.get('/gallery');
    return payload?.data || payload || [];
  },

  addImage: async (data: FormData): Promise<GalleryImage> => {
    const payload: any = await api.post('/gallery', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return payload?.data || payload;
  },

  updateImage: async (id: string, data: FormData): Promise<GalleryImage> => {
    const payload: any = await api.put(`/gallery/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return payload?.data || payload;
  },
  
  reorderImages: async (orderedIds: string[]): Promise<void> => {
    await api.post('/gallery/reorder', { orderedIds });
  },

  deleteImage: async (id: string): Promise<void> => {
    await api.delete(`/gallery/${id}`);
  },

  likeImage: async (id: string, anonymousId: string): Promise<GalleryImage> => {
    const payload: any = await api.patch(`/gallery/${id}/like`, { anonymousId });
    return payload?.data || payload;
  },
};
