import React, { useEffect, useState } from 'react';
import SlidePanel from './SlidePanel';
import { useAdminMode } from '../../context/AdminModeContext';
import { adminContactService, type ContactMessage } from '../../services/adminContactService';
import AdminTable from './AdminTable';
import { Search, Reply, Trash2 } from 'lucide-react';

const ContactsPanel: React.FC = () => {
  const { activePanel, closePanel } = useAdminMode();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminContactService.getAllMessages();
      setMessages(res);
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === 'contacts') fetchMessages();
  }, [activePanel]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminContactService.deleteMessage(id);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message', error);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { 
      key: 'message', 
      label: 'Message',
      render: (item: ContactMessage) => (
        <span className="truncate max-w-xs block" title={item.message}>
          {item.message}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (item: ContactMessage) => (
        <div className="flex space-x-2">
          <a href={`mailto:${item.email}?subject=RE: ${item.subject}`} className="text-gray-400 hover:text-blue-500" title="Reply">
            <Reply size={18} />
          </a>
          <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SlidePanel 
      title="Contact Messages" 
      isOpen={activePanel === 'contacts'} 
      onClose={closePanel}
      width="max-w-4xl"
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none w-full sm:w-64"
        />
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

export default ContactsPanel;
