import React, { useContext, useState } from 'react';
import SlidePanel from './SlidePanel';
import { useAdminMode } from '../../context/AdminModeContext';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ToastContext } from '../../layouts/MainLayout';
import { Save, User, Lock, Mail } from 'lucide-react';
import Spinner from '../Spinner';

const SettingsPanel: React.FC = () => {
  const { activePanel, closePanel } = useAdminMode();
  const auth = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [name, setName] = useState(auth?.admin?.name || '');
  const [email, setEmail] = useState(auth?.admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    type ProfileUpdate = { name: string; email: string; currentPassword?: string; newPassword?: string; };
    const payload: ProfileUpdate = { name, email };
    if (currentPassword) payload.currentPassword = currentPassword;
    if (newPassword) payload.newPassword = newPassword;

    try {
      const res: any = await authService.updateProfile(payload as any);
      const adminData = res?.data || res;
      if (adminData?.token) {
        auth?.login(adminData.token, adminData);
      }
      addToast('success', 'Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      addToast('error', error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlidePanel 
      title="Admin Settings" 
      isOpen={activePanel === 'settings'} 
      onClose={closePanel}
      width="max-w-xl"
    >
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-heading font-bold text-primary mb-6">Profile Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-100" />
          <h4 className="font-heading font-semibold text-primary mb-4">Change Password</h4>

          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text/80 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                placeholder="New strong password"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {loading ? <Spinner size={20} /> : <><Save size={20} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>

      </div>
    </SlidePanel>
  );
};

export default SettingsPanel;
