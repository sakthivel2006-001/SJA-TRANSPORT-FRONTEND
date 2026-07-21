import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { adminGalleryService, type GalleryImage } from '../../services/adminGalleryService';

const CATEGORY_OPTIONS = [
  'Fleet Vehicles',
  'Completed Deliveries',
  'Household Transport',
  'Coconut Transport',
  'Cotton Box Transport',
  'Machinery Transport',
  'Customer Highlights',
];

const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [replaceImageId, setReplaceImageId] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fleet Vehicles',
    isFeatured: false,
    vehicleName: '',
    capacity: '',
    pickupLocation: '',
    deliveryLocation: '',
    serviceType: '',
    vehicleUsed: '',
    completedDate: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await adminGalleryService.getAllImages();
      setImages(data);
    } catch (error) {
      console.error('Error fetching gallery', error);
    } finally {
      setLoading(false);
    }
  };

  const buildFormData = (override: Partial<GalleryImage> = {}, imageFile?: File) => {
    const data = new FormData();
    if (imageFile) {
      data.append('image', imageFile);
    }
    data.append('title', override.title ?? formData.title);
    data.append('description', override.description ?? formData.description);
    data.append('category', override.category ?? formData.category);
    data.append('isFeatured', String(override.isFeatured ?? formData.isFeatured));
    data.append('vehicleName', override.vehicleName ?? formData.vehicleName);
    data.append('capacity', override.capacity ?? formData.capacity);
    data.append('pickupLocation', override.pickupLocation ?? formData.pickupLocation);
    data.append('deliveryLocation', override.deliveryLocation ?? formData.deliveryLocation);
    data.append('serviceType', override.serviceType ?? formData.serviceType);
    data.append('vehicleUsed', override.vehicleUsed ?? formData.vehicleUsed);
    data.append('completedDate', override.completedDate ?? formData.completedDate);
    return data;
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Fleet Vehicles',
      isFeatured: false,
      vehicleName: '',
      capacity: '',
      pickupLocation: '',
      deliveryLocation: '',
      serviceType: '',
      vehicleUsed: '',
      completedDate: '',
    });
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingId(image._id);
    setFormData({
      title: image.title ?? '',
      description: image.description ?? '',
      category: image.category ?? 'Fleet Vehicles',
      isFeatured: Boolean(image.isFeatured),
      vehicleName: image.vehicleName ?? '',
      capacity: image.capacity ?? '',
      pickupLocation: image.pickupLocation ?? '',
      deliveryLocation: image.deliveryLocation ?? '',
      serviceType: image.serviceType ?? '',
      vehicleUsed: image.vehicleUsed ?? '',
      completedDate: image.completedDate ?? image.deliveryDate ?? '',
    });
    setPreviewUrl(image.imageUrl);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !selectedFile) return;

    try {
      setSaving(true);
      const data = buildFormData({}, selectedFile ?? undefined);
      if (editingId) {
        await adminGalleryService.updateImage(editingId, data);
      } else {
        await adminGalleryService.addImage(data);
      }
      resetForm();
      await fetchImages();
    } catch (error) {
      console.error('Error saving gallery item', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setSaving(true);
      await adminGalleryService.deleteImage(id);
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReplaceClick = (id: string) => {
    setReplaceImageId(id);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = replaceImageId;
    if (!file || !id) return;

    try {
      setSaving(true);
      const image = images.find((item) => item._id === id);
      if (!image) return;
      const data = buildFormData(image, file);
      await adminGalleryService.updateImage(id, data);
      await fetchImages();
    } catch (error) {
      console.error('Error replacing image', error);
    } finally {
      setSaving(false);
      setReplaceImageId(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = '';
      }
    }
  };

  const toggleFeatured = async (image: GalleryImage) => {
    try {
      setSaving(true);
      const data = buildFormData({ ...image, isFeatured: !image.isFeatured });
      await adminGalleryService.updateImage(image._id, data);
      await fetchImages();
    } catch (error) {
      console.error('Error toggling featured', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (direction: 'up' | 'down', id: string) => {
    const currentIndex = orderedImages.findIndex((image) => image._id === id);
    if (currentIndex === -1) return;
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= orderedImages.length) return;

    const reordered = [...orderedImages];
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, item);
    const orderedIds = reordered.map((image) => image._id);

    try {
      setSaving(true);
      await adminGalleryService.reorderImages(orderedIds);
      await fetchImages();
    } catch (error) {
      console.error('Error reordering gallery items', error);
    } finally {
      setSaving(false);
    }
  };

  const orderedImages = useMemo(() => [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [images]);

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Gallery Management</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-800">Upload New Image</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">Add new gallery images and metadata for the public Gallery and Homepage featured section.</p>
          </div>
          <button onClick={resetForm} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Clear Form</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4 rounded-[28px] border border-gray-200 bg-gray-50 p-6">
              <label className="block text-sm font-medium text-gray-700">Image Upload</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-700" />
              {previewUrl ? (
                <div className="aspect-[4/3] overflow-hidden rounded-[24px] border border-gray-200 bg-white">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-[24px] border border-dashed border-gray-300 bg-white text-sm text-gray-400">Image preview will appear here.</div>
              )}
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full resize-none rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name</label>
                  <input type="text" value={formData.vehicleName} onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <input type="text" value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input type="text" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <input type="text" value={formData.pickupLocation} onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                  <input type="text" value={formData.deliveryLocation} onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 md:items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completed Date</label>
                  <input type="text" value={formData.completedDate} onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })} className="w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-gray-200 bg-white px-4 py-3">
                  <input id="featuredToggle" type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="featuredToggle" className="text-sm font-medium text-gray-700">Mark as Featured</label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={resetForm} className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Clear</button>
            <button type="submit" disabled={saving || (!editingId && !selectedFile)} className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60">
              {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Plus size={18} className="mr-2" />}
              {editingId ? 'Update Image' : 'Save Image'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Image Library</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">Manage Gallery Images</h2>
          </div>
          <div className="text-sm text-gray-600">Total images: {images.length}</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {orderedImages.map((img) => (
              <div key={img._id} className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={img.imageUrl} alt={img.title} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                  {img.isFeatured && <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Featured</div>}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{img.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2" title={img.description}>{img.description || 'No description provided.'}</p>
                    <p className="mt-2 text-sm font-medium text-gray-500">{img.category}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-gray-600">
                    <p><span className="font-semibold text-gray-800">Vehicle:</span> {img.vehicleName || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-800">Service:</span> {img.serviceType || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-800">Likes:</span> {img.likesCount || 0}</p>
                  </div>
                  <div className="grid gap-2">
                    <button onClick={() => openEditModal(img)} className="w-full rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition">Edit</button>
                    <button onClick={() => handleReplaceClick(img._id)} className="w-full rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Replace Image</button>
                    <button onClick={() => toggleFeatured(img)} className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${img.isFeatured ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-accent text-white hover:bg-accent/90'}`}>
                      {img.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => handleDelete(img._id)} className="w-full rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition">Delete</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReorder('up', img._id)} className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">Move Up</button>
                    <button onClick={() => handleReorder('down', img._id)} className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">Move Down</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <input ref={replaceFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFileChange} />
    </div>
  );
};

export default GalleryManagement;
