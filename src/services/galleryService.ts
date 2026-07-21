import api from './api';
import { getGalleryImageUrl } from '../utils/galleryImageUrl';

export interface GalleryItemResponse {
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
  likesCount?: number;
  likedBy?: string[];
}

const normalizeGalleryItems = (payload: any): GalleryItemResponse[] => {
  const items = payload?.data || payload || [];
  return Array.isArray(items)
    ? items.map((item) => ({ ...item, imageUrl: getGalleryImageUrl(item.imageUrl) }))
    : [];
};

export const getGalleryItems = async () => {
  const payload: any = await api.get('/gallery');
  return normalizeGalleryItems(payload);
};

export const likeGalleryItem = (id: string, anonymousId: string) => api.patch(`/gallery/${id}/like`, { anonymousId });
