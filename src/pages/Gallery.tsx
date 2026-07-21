import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import GalleryGrid from '../components/GalleryGrid';
import heroImg from '../assets/pickup_truck.webp';
import { useGallery } from '../hooks/useGallery';
import Spinner from '../components/Spinner';
import { adminGalleryService, type GalleryImage } from '../services/adminGalleryService';
import { getGalleryImageUrl } from '../utils/galleryImageUrl';

const CATEGORIES = ['Fleet Vehicles', 'Completed Deliveries', 'Household Items', 'Coconut Transport', 'Cotton Box Transport', 'Machinery Transport'];

const Gallery: React.FC = () => {
  const { items, loading, refetch } = useGallery();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gallery-liked-ids');
    if (saved) {
      setLikedIds(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      refetch();
    }, 6000);
    return () => window.clearInterval(timer);
  }, [refetch]);

  const galleryImages = useMemo(() => items.map((item) => ({
    ...item,
    category: item.category || 'Fleet Vehicles',
    isFeatured: Boolean(item.isFeatured),
    description: item.description || '',
  })) as GalleryImage[], [items]);

  const filteredImages = useMemo(() => {
    if (currentCategory === 'All') return galleryImages;
    return galleryImages.filter((img) => img.category === currentCategory);
  }, [currentCategory, galleryImages]);

  const handleLike = async (id: string) => {
    if (likedIds.includes(id)) return;

    const anonymousId = localStorage.getItem('gallery-anonymous-id') || `guest-${Date.now()}`;
    localStorage.setItem('gallery-anonymous-id', anonymousId);

    try {
      const updated = await adminGalleryService.likeImage(id, anonymousId);
      if (updated) {
        const nextLiked = [...likedIds, id];
        setLikedIds(nextLiked);
        localStorage.setItem('gallery-liked-ids', JSON.stringify(nextLiked));

        if (selectedImage && selectedImage._id === id) {
          setSelectedImage({ ...selectedImage, likesCount: (selectedImage.likesCount || 0) + 1 });
        }

        refetch();
      }
    } catch (error) {
      console.error('Error liking image', error);
    }
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setZoomed(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setZoomed(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const index = filteredImages.findIndex((image) => image._id === selectedImage._id);
    if (index === -1) return;
    const nextIndex = direction === 'prev' ? index - 1 : index + 1;
    const wrappedIndex = nextIndex < 0 ? filteredImages.length - 1 : nextIndex >= filteredImages.length ? 0 : nextIndex;
    setSelectedImage(filteredImages[wrappedIndex]);
    setZoomed(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pt-24">
      <section className="bg-primary text-white py-24 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={heroImg} alt="Logistics background" loading="eager" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight uppercase">JOURNEY THROUGH EXCELLENCE</h1>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-heading font-semibold text-gray-900">Browse by category</h2>
            <p className="mt-2 text-sm text-gray-600">Filter the gallery and explore logistics images by service type and completed deliveries.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['All', ...CATEGORIES].map((category) => (
              <button
                key={category}
                onClick={() => setCurrentCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${currentCategory === category ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-200 hover:bg-primary/10'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Gallery total</p>
            <p className="mt-4 text-4xl font-heading font-bold text-primary">{galleryImages.length}</p>
            <p className="mt-3 text-sm text-gray-500">Images dynamically loaded from the backend MongoDB gallery collection.</p>
          </div>
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Selected category</p>
            <p className="mt-4 text-4xl font-heading font-bold text-primary">{currentCategory}</p>
            <p className="mt-3 text-sm text-gray-500">Showing {filteredImages.length} images matching the current filter.</p>
          </div>
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Popular likes</p>
            <p className="mt-4 text-4xl font-heading font-bold text-primary">{galleryImages.reduce((sum, image) => sum + (image.likesCount || 0), 0)}</p>
            <p className="mt-3 text-sm text-gray-500">Total likes across all gallery items.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size={48} />
          </div>
        ) : (
          <GalleryGrid images={filteredImages} onLike={handleLike} likedIds={likedIds} onOpenLightbox={openLightbox} />
        )}
      </main>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }} className="relative w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
              <button onClick={closeLightbox} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-primary shadow-lg">
                <X className="h-5 w-5" />
              </button>
              <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={getGalleryImageUrl(selectedImage.imageUrl)}
                    alt={selectedImage.title}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-500 ${zoomed ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <button
                      onClick={() => navigateLightbox('prev')}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg hover:bg-primary hover:text-white transition"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigateLightbox('next')}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg hover:bg-primary hover:text-white transition"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-xs uppercase tracking-[0.3em] text-accent">{selectedImage.category}</span>
                  <h3 className="mt-4 text-3xl font-heading font-semibold text-primary">{selectedImage.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-gray-600">{selectedImage.description || 'A premium logistics moment captured in motion.'}</p>
                  <div className="mt-8 grid gap-4 text-sm text-gray-600">
                    {selectedImage.vehicleName && <p><span className="font-semibold text-primary">Vehicle:</span> {selectedImage.vehicleName}</p>}
                    {selectedImage.capacity && <p><span className="font-semibold text-primary">Capacity:</span> {selectedImage.capacity}</p>}
                    {selectedImage.pickupLocation && <p><span className="font-semibold text-primary">Pickup:</span> {selectedImage.pickupLocation}</p>}
                    {selectedImage.deliveryLocation && <p><span className="font-semibold text-primary">Delivery:</span> {selectedImage.deliveryLocation}</p>}
                    {selectedImage.serviceType && <p><span className="font-semibold text-primary">Service:</span> {selectedImage.serviceType}</p>}
                    {selectedImage.vehicleUsed && <p><span className="font-semibold text-primary">Vehicle Used:</span> {selectedImage.vehicleUsed}</p>}
                    {selectedImage.deliveryDate && <p><span className="font-semibold text-primary">Completed Date:</span> {selectedImage.deliveryDate}</p>}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleLike(selectedImage._id)}
                      className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${likedIds.includes(selectedImage._id) ? 'bg-accent text-white' : 'bg-gray-100 text-primary hover:bg-accent hover:text-white'}`}
                    >
                      <Heart className={`h-4 w-4 ${likedIds.includes(selectedImage._id) ? 'fill-current' : ''}`} />
                      Like {selectedImage.likesCount || 0}
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomed((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                      {zoomed ? 'Zoom Out' : 'Zoom In'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
