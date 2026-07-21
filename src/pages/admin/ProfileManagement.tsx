import React, { useState, useEffect, useRef } from 'react';
import { User, Save, Loader2, KeyRound, Mail, Phone, Calendar, Clock, Camera, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileManagement: React.FC = () => {
  const { admin } = useAuth(); 
  
  // Profile State
  const [profileLoading, setProfileLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password State
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load Initial Data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const fullProfile = await authService.getProfile();
        setFormData({
          name: fullProfile.name || '',
          email: fullProfile.email || '',
          phone: fullProfile.phone || '',
        });
        setProfilePhoto(fullProfile.profilePhoto || null);
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    
    if (admin) {
      loadProfile();
    }
  }, [admin]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, WEBP)');
        return;
      }
      
      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProfilePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      
      if (selectedFile) {
        submitData.append('profilePhoto', selectedFile);
      } else if (profilePhoto === null && admin?.profilePhoto) {
         // Currently, API doesn't handle pure deletion nicely unless we send a specific flag, 
         // but we assume if they don't upload a new one it keeps the old one. If they actively removed it, 
         // we might need a separate endpoint or field. We'll leave it as is for simplicity.
      }
      
      const updatedProfile = await authService.updateProfile(submitData);
      setProfilePhoto(updatedProfile.profilePhoto || null);
      
      toast.success('Profile updated successfully!');
      
      // Clear preview state since it's now synced
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    try {
      setPasswordLoading(true);
      
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully! Please log in again.');
      
      // Clear fields
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Logout user after 2 seconds
      setTimeout(async () => {
        await authService.logout();
        window.location.href = '/admin/login';
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (profilePhoto) return `http://localhost:5000${profilePhoto}`;
    return null;
  };

  const displayImage = getImageUrl();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and secure your profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Profile Card & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="px-6 pb-6 relative">
              <div className="relative -mt-16 mb-4 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg relative group">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt="Profile" 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-bold">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white hover:text-blue-200"
                      title="Upload new photo"
                    >
                      <Camera size={20} />
                    </button>
                    {displayImage && (
                      <button 
                        type="button" 
                        onClick={handleRemovePhoto}
                        className="text-white hover:text-red-300"
                        title="Remove photo"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{formData.name || 'Admin User'}</h2>
                <div className="flex items-center justify-center gap-1 text-blue-600 mt-1 font-medium">
                  <ShieldCheck size={16} />
                  <span className="capitalize">{admin?.role || 'Administrator'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Member Since</p>
                  <p className="text-gray-900">
                    {/* Assuming createdAt is populated if we fetch full profile, though we fallback if missing */}
                    {(admin as any)?.createdAt ? new Date((admin as any).createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Last Login</p>
                  <p className="text-gray-900">
                    {(admin as any)?.lastLogin ? new Date((admin as any).lastLogin).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <User size={16} className="text-gray-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {profileLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <KeyRound size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full md:w-2/3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    className="w-full md:w-2/3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    className="w-full md:w-2/3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? <Loader2 size={18} className="animate-spin text-gray-400" /> : <ShieldCheck size={18} className="text-gray-400" />}
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
