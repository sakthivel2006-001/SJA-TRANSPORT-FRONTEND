import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Maximize2, Sparkles } from 'lucide-react';
import type { GalleryImage } from '../services/adminGalleryService';

interface GalleryGridProps {
  images: GalleryImage[];
  onLike?: (id: string) => void;
  likedIds?: string[];
  onOpenLightbox?: (image: GalleryImage) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onLike, likedIds = [], onOpenLightbox }) => {
  return (
    <motion.div layout className="columns-1 gap-6 md:columns-2 xl:columns-3">
      <AnimatePresence mode="popLayout">
        {images.map((image, index) => {
            const isLiked = likedIds.includes(image._id);
            return (
              <motion.article
                key={image._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="mb-6 break-inside-avoid overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm hover:shadow-2xl"
              >
                <div className="relative overflow-hidden rounded-[28px]">
                  <img src={image.imageUrl} alt={image.title} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Not+Found' }} className="w-full object-cover transition duration-700 hover:scale-110" style={{ minHeight: '260px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {image.category}
                  </div>
                  <div className="absolute right-4 top-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onLike?.(image._id)}
                      className={`rounded-full p-2 transition ${isLiked ? 'bg-accent text-white' : 'bg-white/90 text-primary hover:bg-accent hover:text-white'}`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLightbox?.(image)}
                      className="rounded-full bg-white/90 p-2 text-primary transition hover:bg-accent hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-accent">
                    <Sparkles className="h-4 w-4" />
                    <span>{image.isFeatured ? 'Featured Story' : 'Logistics Showcase'}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-heading font-semibold text-primary">{image.title}</h3>
                  <p className="mb-4 text-sm leading-6 text-gray-600">{image.description || 'Premium transport showcase captured in motion.'}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    {image.vehicleName && <p><span className="font-semibold text-primary">Vehicle:</span> {image.vehicleName}</p>}
                    {image.capacity && <p><span className="font-semibold text-primary">Capacity:</span> {image.capacity}</p>}
                    {image.pickupLocation && image.deliveryLocation && <p><span className="font-semibold text-primary">Route:</span> {image.pickupLocation} → {image.deliveryLocation}</p>}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <span>{image.likesCount || 0} likes</span>
                    <span>{image.category}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
  );
};

export default GalleryGrid;
