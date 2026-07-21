import React, { useEffect, useState } from 'react';
import SlidePanel from './SlidePanel';
import { useAdminMode } from '../../context/AdminModeContext';
import { adminBookingService, type Booking } from '../../services/adminBookingService';
import AdminTable from './AdminTable';
import { Search, Eye, Trash2 } from 'lucide-react';

const BookingsPanel: React.FC = () => {
  const { activePanel, closePanel } = useAdminMode();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const itemsPerPage = 8;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminBookingService.getAllBookings();
      setBookings(res);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === 'bookings') fetchBookings();
  }, [activePanel]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminBookingService.updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await adminBookingService.deleteBooking(id);
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking', error);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Customer,Service,Pickup,Dropoff,Status\n';
    const csvContent = "data:text/csv;charset=utf-8," + 
      headers + bookings.map(b => `${b.customerName},${b.serviceType},"${b.pickupLocation}","${b.deliveryLocation}",${b.bookingStatus}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'serviceType', label: 'Service' },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'deliveryLocation', label: 'Dropoff' },
    { 
      key: 'bookingStatus', 
      label: 'Status',
      render: (item: Booking) => (
        <select 
          value={item.bookingStatus}
          onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-2 py-1 ${
                    item.bookingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    item.bookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (item: Booking) => (
        <div className="flex space-x-2">
          <button onClick={() => setSelectedBooking(item)} className="text-gray-400 hover:text-blue-500 transition-colors"><Eye size={18} /></button>
          <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  let filtered = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (statusFilter !== 'All') {
    filtered = filtered.filter(b => b.bookingStatus === statusFilter);
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <SlidePanel 
      title="Booking Management" 
      isOpen={activePanel === 'bookings'} 
      onClose={closePanel}
      width="max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none w-full"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>
      </div>

      <AdminTable 
        columns={columns} 
        data={paginatedData} 
        loading={loading}
        keyExtractor={(item) => item._id}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
      />

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-heading font-bold text-gray-800">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Tracking ID</label>
                  <p className="mt-1 font-medium">{selectedBooking.trackingId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <span className={`inline-block mt-1 text-xs font-semibold rounded-full px-2 py-1 ${
                    selectedBooking.bookingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    selectedBooking.bookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedBooking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Customer Name</label>
                  <p className="mt-1">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Contact Number</label>
                  <p className="mt-1">{selectedBooking.phone}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Email</label>
                <p className="mt-1">{(selectedBooking as any).email || 'N/A'}</p>
              </div>
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Pickup Location</label>
                  <p className="mt-1">{selectedBooking.pickupLocation}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Delivery Location</label>
                  <p className="mt-1">{selectedBooking.deliveryLocation}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Service Type</label>
                  <p className="mt-1">{selectedBooking.serviceType || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Vehicle Type</label>
                  <p className="mt-1">{selectedBooking.vehicleType || 'N/A'}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Destination State</label>
                <p className="mt-1">{selectedBooking.destinationState || 'N/A'}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Goods Description</label>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedBooking.goodsDescription || 'No description provided.'}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => window.print()} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-white transition-colors text-sm font-medium text-gray-700">
                Print
              </button>
              <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </SlidePanel>
  );
};

export default BookingsPanel;
