import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CalendarDays, MessageSquare, Mail, Settings, LogOut, Edit3, Eye, Truck, Package, Image as ImageIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useAdminMode } from '../../context/AdminModeContext';
import { useNavigate } from 'react-router-dom';

const AdminToolbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const { openPanel } = useAdminMode();
  const navigate = useNavigate();

  if (!auth?.isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-primary text-white p-2 rounded-full shadow-2xl border border-white/10"
      >
        <div className="flex items-center px-4 py-2 bg-white/10 rounded-full mr-2">
          <span className="text-sm font-bold uppercase tracking-wider text-accent mr-2">SJA Admin</span>
        </div>

        <button
          onClick={auth.toggleEditMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            auth.editMode ? 'bg-accent text-primary' : 'hover:bg-white/10'
          }`}
        >
          {auth.editMode ? (
            <>
              <Edit3 size={16} /> Edit Mode
            </>
          ) : (
            <>
              <Eye size={16} /> Preview
            </>
          )}
        </button>

        <div className="w-px h-6 bg-white/20 mx-2"></div>

        <button
          onClick={() => openPanel('dashboard')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Dashboard"
        >
          <LayoutDashboard size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => openPanel('bookings')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Bookings"
        >
          <CalendarDays size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => navigate('/admin/vehicles')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Vehicle Management"
        >
          <Truck size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => openPanel('services')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Services Management"
        >
          <Package size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => openPanel('feedback')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Feedback"
        >
          <MessageSquare size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => openPanel('contacts')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Contacts"
        >
          <Mail size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => openPanel('settings')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Settings"
        >
          <Settings size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={() => navigate('/admin/gallery')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors group relative"
          title="Gallery Management"
        >
          <ImageIcon size={20} className="group-hover:text-accent transition-colors" />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2"></div>

        <button
          onClick={() => {
            auth.logout();
            window.location.href = '/';
          }}
          className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminToolbar;
