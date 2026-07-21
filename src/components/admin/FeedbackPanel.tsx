import React, { useEffect, useState } from 'react';
import SlidePanel from './SlidePanel';
import { useAdminMode } from '../../context/AdminModeContext';
import { adminFeedbackService, type Feedback } from '../../services/adminFeedbackService';
import AdminTable from './AdminTable';
import { Search, Trash2 } from 'lucide-react';

const FeedbackPanel: React.FC = () => {
  const { activePanel, closePanel } = useAdminMode();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await adminFeedbackService.getAllFeedback();
      setFeedbacks(res);
    } catch (error) {
      console.error('Error fetching feedback', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === 'feedback') fetchFeedback();
  }, [activePanel]);

  const handleUpdate = async (id: string, status: string) => {
    try {
      await adminFeedbackService.updateFeedbackStatus(id, status);
      fetchFeedback();
    } catch (error) {
      console.error('Error updating feedback status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await adminFeedbackService.deleteFeedback(id);
      fetchFeedback();
    } catch (error) {
      console.error('Error deleting feedback', error);
    }
  };

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (item: Feedback) => (
        <div className="flex text-accent">
          {Array.from({ length: item.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
          {Array.from({ length: 5 - item.rating }).map((_, i) => (
            <span key={i} className="text-gray-300">★</span>
          ))}
        </div>
      )
    },
    { 
      key: 'review', 
      label: 'Review',
      render: (item: Feedback) => (
        <span className="truncate max-w-xs block" title={item.comment || item.review}>
          {item.comment || item.review || 'N/A'}
        </span>
      )
    },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'service', label: 'Service' },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: Feedback) => (
        <select
          value={item.status || (item.approved ? 'approved' : 'pending')}
          onChange={(e) => handleUpdate(item._id, e.target.value)}
          className={`text-xs font-semibold rounded-full px-2 py-1 ${
            (item.status === 'approved' || item.approved) ? 'bg-green-100 text-green-800' : 
            item.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (item: Feedback) => (
        <div className="flex space-x-2">
          <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  let filtered = feedbacks.filter(f => f.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
  if (statusFilter !== 'all') filtered = filtered.filter(f => (f.status || (f.approved ? 'approved' : 'pending')) === statusFilter);
  if (vehicleFilter !== 'All') filtered = filtered.filter(f => f.vehicle === vehicleFilter);
  if (serviceFilter !== 'All') filtered = filtered.filter(f => f.service === serviceFilter);
  if (ratingFilter !== 'All') filtered = filtered.filter(f => f.rating === Number(ratingFilter));

  return (
    <SlidePanel 
      title="Feedback Management" 
      isOpen={activePanel === 'feedback'} 
      onClose={closePanel}
      width="max-w-6xl"
    >
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none w-full"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent bg-white">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent bg-white">
          <option value="All">All Vehicles</option>
          <option value="Tata Intra Pickup">Tata Intra Pickup</option>
          <option value="Ashok Leyland DOST">Ashok Leyland DOST</option>
          <option value="Tata Ace">Tata Ace</option>
        </select>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent bg-white">
          <option value="All">All Services</option>
          <option value="Household Items Transport">Household Items Transport</option>
          <option value="Coconut Transport">Coconut Transport</option>
          <option value="Cotton Box Transport">Cotton Box Transport</option>
          <option value="Machinery Items Transport">Machinery Items Transport</option>
        </select>
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent bg-white">
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <AdminTable 
        columns={columns} 
        data={filtered} 
        loading={loading}
        keyExtractor={(item) => item._id}
      />
    </SlidePanel>
  );
};

export default FeedbackPanel;
