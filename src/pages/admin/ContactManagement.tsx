import React, { useEffect, useState, useContext } from 'react';
import { Check, Trash2, Eye, Reply } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import { adminContactService, type ContactMessage } from '../../services/adminContactService';
import { ToastContext } from '../../layouts/MainLayout';

const ContactManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useContext(ToastContext);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await adminContactService.getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminContactService.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const handleUpdateReplyStatus = async (id: string, status: string) => {
    try {
      await adminContactService.updateReplyStatus(id, status);
      fetchMessages();
    } catch (error) {
      console.error('Error updating reply status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await adminContactService.deleteMessage(id);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message', error);
      }
    }
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) {
      addToast('error', 'Reply message cannot be empty');
      return;
    }
    try {
      setReplyLoading(true);
      await adminContactService.replyToMessage(id, replyText);
      addToast('success', 'Reply sent successfully');
      setReplyText('');
      setIsModalOpen(false);
      fetchMessages();
    } catch (err) {
      console.error('Reply error', err);
      addToast('error', 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (!msg.isRead) {
      handleMarkAsRead(msg._id);
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Sender',
      render: (m: ContactMessage) => (
        <div className="flex flex-col">
          <span className={`font-medium ${m.isRead ? 'text-gray-700' : 'text-black'}`}>{m.name}</span>
          <span className="text-xs text-gray-500">{m.email}</span>
        </div>
      )
    },
    { 
      key: 'subject', 
      label: 'Subject',
      render: (m: ContactMessage) => (
        <span className={m.isRead ? 'text-gray-600' : 'font-semibold text-gray-900'}>{m.subject}</span>
      )
    },
    { 
      key: 'date', 
      label: 'Date',
      render: (m: ContactMessage) => <span className="text-sm">{new Date(m.createdAt).toLocaleDateString()}</span>
    },
    { 
      key: 'replyStatus', 
      label: 'Status',
      render: (m: ContactMessage) => {
        const isReplied = m.replyStatus === 'Replied';
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${
            isReplied ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isReplied && <Check size={12} />}
            {m.replyStatus}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (m: ContactMessage) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleViewMessage(m)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Read Message"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={() => handleUpdateReplyStatus(m._id, m.replyStatus === 'Replied' ? 'Pending' : 'Replied')}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
            title={m.replyStatus === 'Replied' ? 'Mark as Pending' : 'Mark as Replied'}
          >
            <Reply size={18} />
          </button>
          <button 
            onClick={() => handleDelete(m._id)}
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
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded-lg">
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
          </select>
        </div>
      </div>

      <AdminTable 
        columns={columns} 
        data={messages.filter(m => (
          (statusFilter === 'All' || m.replyStatus === statusFilter) &&
          (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase()) || m.subject.toLowerCase().includes(searchTerm.toLowerCase()))
        ))}
        loading={loading} 
        keyExtractor={(m) => m._id} 
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Message Details"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                <p className="text-gray-600">From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
              </div>
              <span className="text-sm text-gray-500">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border whitespace-pre-wrap text-gray-800">
              {selectedMessage.message}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <div className="w-full">
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-3 border rounded-lg mb-3"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(selectedMessage._id)}
                    disabled={replyLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {replyLoading ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default ContactManagement;
