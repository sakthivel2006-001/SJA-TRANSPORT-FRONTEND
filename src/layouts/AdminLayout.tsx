import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  CalendarDays,
  Image as ImageIcon,
  Award,
  MessageSquare,
  Mail,
  User,
  LogOut,
  Menu,
  X,
  Truck
} from 'lucide-react';
import { authService } from '../services/authService';

const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      logout();
      navigate('/admin/login');
    }
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/bookings', icon: <CalendarDays size={20} />, label: 'Bookings' },
    { to: '/admin/vehicles', icon: <Truck size={20} />, label: 'Vehicles' },
    { to: '/admin/gallery', icon: <ImageIcon size={20} />, label: 'Gallery Management' },
    { to: '/admin/achievements', icon: <Award size={20} />, label: 'Achievements' },
    { to: '/admin/feedback', icon: <MessageSquare size={20} />, label: 'Feedback' },
    { to: '/admin/contacts', icon: <Mail size={20} />, label: 'Contacts' },
    { to: '/admin/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-700">
              Welcome, {admin?.name || 'Admin'}
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
