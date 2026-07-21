import React, { useState, useEffect, useContext } from 'react';
import { adminTransportServiceService } from '../../services/adminTransportServiceService';
import type { TransportService } from '../../services/adminTransportServiceService';
import SlidePanel from './SlidePanel';
import { useAdminMode } from '../../context/AdminModeContext';
import AdminTable from './AdminTable';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import AdminModal from './AdminModal';
import { ToastContext } from '../../layouts/MainLayout';

const ServicesPanel: React.FC = () => {
  const { activePanel, closePanel } = useAdminMode();
  const [services, setServices] = useState<TransportService[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(ToastContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TransportService | null>(null);
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    icon: '',
    capacity: '',
    displayOrder: '',
    isFeatured: false,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await adminTransportServiceService.getAllServices({ includeInactive: true });
      setServices(data);
    } catch (error) {
      console.error('Error fetching services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', shortDescription: '', description: '', category: 'General', icon: 'Package', capacity: '', displayOrder: '', isFeatured: false, isActive: true });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (s: TransportService) => {
    setEditing(s);
    setForm({
      title: s.title || '',
      shortDescription: (s as any).shortDescription || '',
      description: s.description || '',
      category: (s as any).category || 'General',
      icon: s.icon || 'Package',
      capacity: s.capacity || '',
      displayOrder: String(s.displayOrder || ''),
      isFeatured: !!(s as any).isFeatured,
      isActive: !!s.isActive,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') setForm(prev => ({ ...prev, [name]: checked }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setImageFile(f || null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      addToast('error', 'Please fill required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('shortDescription', form.shortDescription);
      payload.append('category', form.category);
      payload.append('icon', form.icon);
      payload.append('capacity', form.capacity);
      payload.append('displayOrder', form.displayOrder);
      payload.append('isFeatured', String(form.isFeatured));
      payload.append('isActive', String(form.isActive));
      if (imageFile) payload.append('image', imageFile);

      if (editing) {
        await adminTransportServiceService.updateService(editing._id, payload as any);
        addToast('success', 'Service updated');
      } else {
        await adminTransportServiceService.createService(payload as any);
        addToast('success', 'Service created');
      }
      setIsModalOpen(false);
      fetchServices();
      // notify public pages to refresh
      try { window.dispatchEvent(new Event('services:updated')); } catch (e) {}
    } catch (err) {
      console.error('Save service error', err);
      addToast('error', 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await adminTransportServiceService.deleteService(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service', error);
      }
    }
  };

  const columns = [
    { 
      key: 'icon', 
      label: 'Icon',
      render: () => <Package className="w-5 h-5 text-gray-500" />
    },
    { key: 'title', label: 'Service Title' },
    { key: 'capacity', label: 'Capacity' },
    {
      key: 'actions',
      label: 'Actions',
      render: (s: TransportService) => (
        <div className="flex space-x-2">
          <button onClick={() => openEdit(s)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
            <Edit size={18} />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete" onClick={() => handleDelete(s._id)}>
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <SlidePanel
      title="Transport Services Management"
      isOpen={activePanel === 'services'}
      onClose={closePanel}
      width="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="flex justify-end items-center">
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={20} />
            <span>Add Service</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading services...</div>
          ) : (
            <AdminTable data={services} columns={columns} keyExtractor={(s) => s._id} />
          )}
        </div>
      </div>
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'} maxWidth="max-w-3xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Name *</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={6} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input name="capacity" value={form.capacity} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input name="displayOrder" value={form.displayOrder} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <input name="icon" value={form.icon} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Image</label>
              <input type="file" accept="image/*" onChange={handleFile} />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded">{saving ? 'Saving...' : (editing ? 'Save Changes' : 'Create Service')}</button>
          </div>
        </div>
      </AdminModal>
    </SlidePanel>
  );
};

export default ServicesPanel;
