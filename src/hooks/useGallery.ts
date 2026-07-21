import { useState, useEffect, useCallback } from 'react';
import { getGalleryItems } from '../services/galleryService';

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
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
  createdAt: string;
}

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await getGalleryItems();
      setItems(Array.isArray(res) ? res : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  return { items, loading, error, refetch: fetchGallery };
};
