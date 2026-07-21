import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Edit, Trash2, Eye, RotateCw } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import { adminBookingService, type Booking } from '../../services/adminBookingService';
import ToastContainer from '../../components/ToastContainer';
import type { ToastData } from '../../components/ToastContainer';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const addToast = (type: ToastData['type'], message: string) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 6);
    setToasts((s) => [{ id, type, message }, ...s]);
  };
  const removeToast = (id: string) => setToasts((s) => s.filter(t => t.id !== id));
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await adminBookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings', error);
      addToast('error', (error as Error).message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

  useEffect(() => {
    if (isEditModalOpen && selectedBooking) {
      setEditForm({
        customerName: selectedBooking.customerName,
        customerPhone: selectedBooking.customerPhone,
        pickupLocation: selectedBooking.pickupLocation,
        deliveryLocation: selectedBooking.deliveryLocation,
        pickupDate: selectedBooking.pickupDate,
        serviceType: selectedBooking.serviceType,
        vehicleType: selectedBooking.vehicleType,
        goodsDescription: selectedBooking.goodsDescription,
      });
    }
  }, [isEditModalOpen, selectedBooking]);

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    try {
      const payload = {
        customerName: editForm.customerName,
        customerPhone: editForm.customerPhone,
        pickupLocation: editForm.pickupLocation,
        deliveryLocation: editForm.deliveryLocation,
        pickupDate: editForm.pickupDate,
        serviceType: editForm.serviceType,
        vehicleType: editForm.vehicleType,
        goodsDescription: editForm.goodsDescription,
      };
      await adminBookingService.updateBooking(selectedBooking._id, payload);
      setIsEditModalOpen(false);
      setSelectedBooking(null);
      fetchBookings();
      window.dispatchEvent(new CustomEvent('data:bookings:changed'));
      addToast('success', 'Booking updated');
    } catch (err) {
      console.error('Failed to update booking', err);
      addToast('error', (err as Error).message || 'Failed to update booking');
    }
  };

  const filteredBookings = useMemo(() => {
    let res = bookings.slice();
    // Search by customer name, bookingId, customerPhone
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      res = res.filter(b => (
        (b.customerName || '').toLowerCase().includes(s) ||
        (b.bookingId || b._id || '').toLowerCase().includes(s) ||
        (b.customerPhone || '').toLowerCase().includes(s)
      ));
    }
    if (statusFilter) res = res.filter(b => b.bookingStatus === statusFilter);
    if (serviceFilter) res = res.filter(b => b.serviceType === serviceFilter);
    if (vehicleFilter) res = res.filter(b => b.vehicleType === vehicleFilter);
    if (dateFilter === 'today') {
      const start = new Date(); start.setHours(0,0,0,0);
      const end = new Date(); end.setHours(23,59,59,999);
      res = res.filter(b => new Date(b.createdAt) >= start && new Date(b.createdAt) <= end);
    }
    if (dateFilter === 'month') {
      const now = new Date();
      res = res.filter(b => {
        const d = new Date(b.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    }

    // Sorting
    if (sortBy === 'createdAt_desc') res.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'createdAt_asc') res.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sortBy === 'pickupDate_asc') res.sort((a,b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());
    if (sortBy === 'pickupDate_desc') res.sort((a,b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime());
    if (sortBy === 'customer_asc') res.sort((a,b) => (a.customerName||'').localeCompare(b.customerName||''));
    if (sortBy === 'customer_desc') res.sort((a,b) => (b.customerName||'').localeCompare(a.customerName||''));

    return res;
  }, [bookings, searchTerm, statusFilter, serviceFilter, vehicleFilter, dateFilter, sortBy]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminBookingService.updateBookingStatus(id, status);
      fetchBookings();
      window.dispatchEvent(new CustomEvent('data:bookings:changed'));
      addToast('success', 'Booking status updated');
    } catch (error) {
      console.error('Error updating status', error);
      addToast('error', (error as Error).message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (selectedBooking) {
      try {
        await adminBookingService.deleteBooking(selectedBooking._id);
        setIsDeleteModalOpen(false);
        setSelectedBooking(null);
        fetchBookings();
        window.dispatchEvent(new CustomEvent('data:bookings:changed'));
        addToast('success', 'Booking deleted');
      } catch (error) {
        console.error('Error deleting booking', error);
        addToast('error', (error as Error).message || 'Failed to delete booking');
      }
    }
  };

  const columns = [
    { key: 'bookingId', label: 'Booking ID', render: (b: Booking) => b.bookingId || b._id },
    { key: 'customerName', label: 'Customer' },
    { key: 'customerPhone', label: 'Phone' },
    { key: 'serviceType', label: 'Service' },
    { key: 'vehicleType', label: 'Vehicle' },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'deliveryLocation', label: 'Delivery' },
    { key: 'pickupDate', label: 'Pickup Date', render: (b: Booking) => (b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : '-') },
    { key: 'createdAt', label: 'Booking Date', render: (b: Booking) => (b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-') },
    {
      key: 'status',
      label: 'Status',
      render: (b: Booking) => {
        const colors: Record<string,string> = {
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Approved': 'bg-blue-100 text-blue-800',
          'Rejected': 'bg-red-100 text-red-800',
          'In Progress': 'bg-purple-100 text-purple-800',
          'Completed': 'bg-green-100 text-green-800',
        };
        const current = b.bookingStatus || 'Pending';
        return (
          <select
            value={current}
            onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer ${colors[current] || 'bg-gray-100 text-gray-800'}`}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (b: Booking) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedBooking(b); setIsViewModalOpen(true); }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => { setSelectedBooking(b); setIsEditModalOpen(true); }}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => { setSelectedBooking(b); setIsDeleteModalOpen(true); }}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by booking ID, customer, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative w-full sm:w-44">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="hidden sm:flex gap-2 items-center">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="block w-40 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Services</option>
            {[...new Set(bookings.map(b => b.serviceType).filter(Boolean))].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="block w-40 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Vehicles</option>
            {[...new Set(bookings.map(b => b.vehicleType).filter(Boolean))].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="block w-40 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-52 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="createdAt_desc">Booking Date (newest)</option>
            <option value="createdAt_asc">Booking Date (oldest)</option>
            <option value="pickupDate_desc">Pickup Date (newest)</option>
            <option value="pickupDate_asc">Pickup Date (oldest)</option>
            <option value="customer_asc">Customer A-Z</option>
            <option value="customer_desc">Customer Z-A</option>
          </select>
          <button
            onClick={() => { fetchBookings(); addToast('success', 'Refreshed bookings'); }}
            className="px-3 py-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            title="Refresh"
          >
            <RotateCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredBookings} 
        loading={loading} 
        emptyMessage={loading ? 'Loading bookings...' : 'No bookings found'}
        keyExtractor={(b) => b._id} 
      />

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this booking for <strong>{selectedBooking?.customerName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </AdminModal>

      {/* View Modal */}
      <AdminModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Booking ID</span>
              <p className="font-medium">{selectedBooking.bookingId || selectedBooking._id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Customer Name</span>
              <p className="font-medium">{selectedBooking.customerName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone</span>
              <p className="font-medium">{selectedBooking.customerPhone}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Pickup Date</span>
              <p className="font-medium">{selectedBooking.pickupDate ? new Date(selectedBooking.pickupDate).toLocaleDateString() : '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Pickup Location</span>
                <p className="font-medium">{selectedBooking.pickupLocation}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Delivery Location</span>
                <p className="font-medium">{selectedBooking.deliveryLocation}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Goods Description</span>
              <p className="font-medium bg-gray-50 p-3 rounded-lg border mt-1">{selectedBooking.goodsDescription}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const phone = (selectedBooking.customerPhone || '').replace(/[^0-9]/g, '');
                  const statusText = (selectedBooking.bookingStatus || '').toUpperCase();
                  const msg = `Hello ${selectedBooking.customerName},\n\nYour SJA TRANSPORT booking has been ${statusText}.\n\nBooking ID: ${selectedBooking.bookingId || selectedBooking._id}\nPickup: ${selectedBooking.pickupLocation}\nDelivery: ${selectedBooking.deliveryLocation}\nVehicle: ${selectedBooking.vehicleType || ''}\n\nThank you.`;
                  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                  window.open(url, '_blank');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send WhatsApp
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Booking"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Customer Name</label>
            <input value={editForm.customerName || ''} onChange={e => setEditForm({...editForm, customerName: e.target.value})} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={editForm.customerPhone || ''} onChange={e => setEditForm({ ...editForm, customerPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Pickup Location</label>
              <input value={editForm.pickupLocation || ''} onChange={e => setEditForm({...editForm, pickupLocation: e.target.value})} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Delivery Location</label>
              <input value={editForm.deliveryLocation || ''} onChange={e => setEditForm({...editForm, deliveryLocation: e.target.value})} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Pickup Date</label>
              <input type="date" value={editForm.pickupDate ? new Date(editForm.pickupDate as string).toISOString().slice(0,10) : ''} onChange={e => setEditForm({...editForm, pickupDate: e.target.value})} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Service Type</label>
              <input value={editForm.serviceType || ''} onChange={e => setEditForm({...editForm, serviceType: e.target.value})} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Vehicle Type</label>
            <input value={editForm.vehicleType || ''} onChange={e => setEditForm({...editForm, vehicleType: e.target.value})} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm text-gray-500">Goods Description</label>
            <textarea value={editForm.goodsDescription || ''} onChange={e => setEditForm({...editForm, goodsDescription: e.target.value})} className="w-full mt-1 p-2 border rounded h-24" />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      </AdminModal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default BookingManagement;
