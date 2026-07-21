import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { adminVehicleService } from '../../services/adminVehicleService';
import type { Vehicle } from '../../services/adminVehicleService';
import ToastContainer from '../../components/ToastContainer';
import type { ToastData } from '../../components/ToastContainer';

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Table state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('newest');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    onTrip: 0,
    maintenance: 0
  });

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const initialFormState = {
    vehicleName: '',
    vehicleNumber: '',
    vehicleType: '',
    capacity: '',
    suitableGoods: '',
    driverName: '',
    driverPhone: '',
    status: 'Available' as 'Available' | 'On Trip' | 'Maintenance',
    description: '',
    featured: false,
  };
  const [formData, setFormData] = useState(initialFormState);

  // Replace image state
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceImageId, setReplaceImageId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await adminVehicleService.getAllVehicles({
        search,
        status: statusFilter,
        vehicleType: typeFilter,
        sort,
        page,
        limit: 10
      });
      setVehicles(res.data);
      setTotalPages(res.pages);
      setTotalVehicles(res.total);
      
      // Calculate simple stats based on current page if full API doesn't provide them,
      // but optimally we would fetch stats from dashboard service. We'll do a simple count here.
      // In a real app, you'd probably want a separate API call or it included in the response.
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      showToast('Failed to fetch vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch basic stats
  const fetchStats = async () => {
     try {
       // A quick hack since we don't have a dedicated stats endpoint for vehicles alone,
       // we fetch all without pagination to get counts.
       const res = await adminVehicleService.getAllVehicles({ limit: 1000 });
       const all = res.data;
       setStats({
         total: all.length,
         available: all.filter(v => v.status === 'Available').length,
         onTrip: all.filter(v => v.status === 'On Trip').length,
         maintenance: all.filter(v => v.status === 'Maintenance').length
       });
     } catch (e) {
       console.error("Failed to load stats", e);
     }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, search, statusFilter, typeFilter, sort]);

  useEffect(() => {
    fetchStats();
  }, [isModalOpen, vehicles.length]); // Refresh stats when modal closes (after save) or vehicle count changes

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle._id);
      setFormData({
        vehicleName: vehicle.vehicleName,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        capacity: vehicle.capacity,
        suitableGoods: vehicle.suitableGoods,
        driverName: vehicle.driverName,
        driverPhone: vehicle.driverPhone,
        status: vehicle.status as 'Available' | 'On Trip' | 'Maintenance',
        description: vehicle.description || '',
        featured: vehicle.featured,
      });
      setPreviewUrl(vehicle.image);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const buildFormData = () => {
    const data = new FormData();
    if (selectedFile) data.append('image', selectedFile);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !selectedFile) {
      showToast('Please select a vehicle image', 'error');
      return;
    }

    try {
      setSaving(true);
      const data = buildFormData();
      if (editingId) {
        await adminVehicleService.updateVehicle(editingId, data);
        showToast('Vehicle updated successfully', 'success');
      } else {
        await adminVehicleService.createVehicle(data);
        showToast('Vehicle added successfully', 'success');
      }
      handleCloseModal();
      fetchVehicles();
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Failed to save vehicle', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      setSaving(true);
      await adminVehicleService.deleteVehicle(id);
      showToast('Vehicle deleted successfully', 'success');
      fetchVehicles();
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete vehicle', 'error');
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
      const vehicle = vehicles.find((v) => v._id === id);
      if (!vehicle) return;

      const data = new FormData();
      data.append('image', file);
      // Keep existing data
      data.append('vehicleName', vehicle.vehicleName);
      data.append('vehicleNumber', vehicle.vehicleNumber);
      data.append('vehicleType', vehicle.vehicleType);
      data.append('capacity', vehicle.capacity);
      data.append('suitableGoods', vehicle.suitableGoods);
      data.append('driverName', vehicle.driverName);
      data.append('driverPhone', vehicle.driverPhone);
      data.append('status', vehicle.status);
      data.append('description', vehicle.description || '');
      data.append('featured', String(vehicle.featured));

      await adminVehicleService.updateVehicle(id, data);
      showToast('Image replaced successfully', 'success');
      fetchVehicles();
    } catch (error: any) {
      showToast(error.message || 'Failed to replace image', 'error');
    } finally {
      setSaving(false);
      setReplaceImageId(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = '';
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Available</span>;
      case 'On Trip': return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">On Trip</span>;
      case 'Maintenance': return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Maintenance</span>;
      default: return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
          <p className="text-gray-600">Manage your fleet, track status, and update details.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Vehicles</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <ImageIcon size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Available</p>
            <p className="text-3xl font-bold text-green-600">{stats.available}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">On Trip</p>
            <p className="text-3xl font-bold text-blue-600">{stats.onTrip}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">In Maintenance</p>
            <p className="text-3xl font-bold text-red-600">{stats.maintenance}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">All Types</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Trailer">Trailer</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex items-center justify-center h-64">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <ImageIcon size={32} />
              </div>
              <p>No vehicles found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Vehicle Info</th>
                  <th className="px-6 py-4 hidden md:table-cell">Capacity / Goods</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Driver</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-16 rounded overflow-hidden border border-gray-200 bg-gray-100 group relative">
                         <img src={vehicle.image} alt={vehicle.vehicleName} className="h-full w-full object-cover" />
                         <div 
                           className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[10px] text-center"
                           onClick={() => handleReplaceClick(vehicle._id)}
                         >
                           Replace
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{vehicle.vehicleName}</div>
                      <div className="text-gray-500 text-xs mt-1">Reg: {vehicle.vehicleNumber} • Type: {vehicle.vehicleType}</div>
                      {vehicle.featured && <span className="inline-block mt-1 text-[10px] uppercase bg-accent/10 text-accent px-2 py-0.5 rounded-sm font-bold">Featured</span>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-gray-800">{vehicle.capacity}</div>
                      <div className="text-gray-500 text-xs mt-1">{vehicle.suitableGoods}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-gray-800">{vehicle.driverName}</div>
                      <div className="text-gray-500 text-xs mt-1">{vehicle.driverPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(vehicle)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && vehicles.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{((page - 1) * 10) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(page * 10, totalVehicles)}</span> of <span className="font-medium text-gray-900">{totalVehicles}</span> vehicles
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for inline image replacement */}
      <input 
        ref={replaceFileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleReplaceFileChange} 
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="vehicleForm" onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vehicle Image {editingId ? '' : '*'}</label>
                  <div className="flex items-center gap-6">
                     <div className="h-32 w-48 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 relative">
                       {previewUrl ? (
                         <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                       ) : (
                         <div className="text-gray-400 text-xs flex flex-col items-center">
                           <ImageIcon size={24} className="mb-1" />
                           <span>No image</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-white text-xs font-medium cursor-pointer" onClick={() => document.getElementById('vehicleImageUpload')?.click()}>Upload</span>
                       </div>
                     </div>
                     <div className="flex-1">
                       <input 
                         id="vehicleImageUpload"
                         type="file" 
                         accept="image/*" 
                         onChange={handleFileChange}
                         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                       />
                       <p className="text-xs text-gray-500 mt-2">Recommended: 800x600px, JPG/PNG, max 10MB.</p>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name *</label>
                      <input required type="text" value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Tata Intra V30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                      <input required type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. TN 01 AB 1234" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                      <input required type="text" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Mini Truck" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                      <input required type="text" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 1.5 Tons" />
                    </div>
                  </div>

                  {/* Operational Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suitable Goods *</label>
                      <input required type="text" value={formData.suitableGoods} onChange={e => setFormData({...formData, suitableGoods: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Furniture, Electronics" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
                      <input required type="text" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone *</label>
                      <input required type="text" value={formData.driverPhone} onChange={e => setFormData({...formData, driverPhone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. +91 9876543210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Any additional notes about the vehicle..."></textarea>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700 select-none cursor-pointer">Feature on Homepage</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={handleCloseModal} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" form="vehicleForm" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editingId ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
