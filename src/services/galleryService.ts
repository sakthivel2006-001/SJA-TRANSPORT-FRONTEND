import api from './api';

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

export const getGalleryItems = () => api.get('/gallery');

export const likeGalleryItem = (id: string, anonymousId: string) => api.patch(`/gallery/${id}/like`, { anonymousId });
