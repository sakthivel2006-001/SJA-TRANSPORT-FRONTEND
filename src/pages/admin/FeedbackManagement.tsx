import React, { useEffect, useState } from 'react';
import { Check, X, Trash2, Eye } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import { adminFeedbackService, type Feedback } from '../../services/adminFeedbackService';

const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await adminFeedbackService.getAllFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminFeedbackService.updateFeedbackStatus(id, status);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await adminFeedbackService.deleteFeedback(id);
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback', error);
      }
    }
  };

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (f: Feedback) => (
        <div className="flex items-center text-yellow-500">
          {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
        </div>
      )
    },
    { 
      key: 'review', 
      label: 'Review',
      render: (f: Feedback) => (
        <span className="truncate block max-w-[200px]">{f.review || f.comment}</span>
      )
    },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'service', label: 'Service' },
    { 
      key: 'status', 
      label: 'Status',
      render: (f: Feedback) => {
        const colors: Record<string, string> = {
          'pending': 'bg-yellow-100 text-yellow-800',
          'approved': 'bg-green-100 text-green-800',
          'rejected': 'bg-red-100 text-red-800',
        };
        const statusKey = f.status || (f.approved ? 'approved' : 'pending');
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[statusKey] || 'bg-gray-100 text-gray-800'}`}>
            {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (f: Feedback) => (
        <div className="flex gap-2">
          <button 
            onClick={() => { setSelectedFeedback(f); setIsModalOpen(true); }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          {f.status !== 'approved' && (
            <button 
              onClick={() => handleUpdateStatus(f._id, 'approved')}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Approve"
            >
              <Check size={18} />
            </button>
          )}
          {f.status !== 'rejected' && (
            <button 
              onClick={() => handleUpdateStatus(f._id, 'rejected')}
              className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
              title="Reject"
            >
              <X size={18} />
            </button>
          )}
          <button 
            onClick={() => handleDelete(f._id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Feedback Management</h1>
      </div>

      <AdminTable 
        columns={columns} 
        data={feedbacks} 
        loading={loading} 
        keyExtractor={(f) => f._id} 
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Feedback Details"
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Customer Name</span>
              <p className="font-medium">{selectedFeedback.customerName}</p>
            </div>
            {selectedFeedback.phone && (
              <div>
                <span className="text-sm text-gray-500">Phone</span>
                <p className="font-medium">{selectedFeedback.phone}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Rating</span>
              <div className="text-yellow-500 text-lg">
                {'★'.repeat(selectedFeedback.rating)}{'☆'.repeat(5 - selectedFeedback.rating)}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Vehicle</span>
              <p className="font-medium">{selectedFeedback.vehicle || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Service</span>
              <p className="font-medium">{selectedFeedback.service || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p className="font-medium capitalize">{selectedFeedback.status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Review</span>
              <p className="bg-gray-50 p-4 rounded-lg border mt-1 whitespace-pre-wrap">
                {selectedFeedback.review || selectedFeedback.comment}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Date</span>
              <p className="font-medium">{new Date(selectedFeedback.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default FeedbackManagement;
