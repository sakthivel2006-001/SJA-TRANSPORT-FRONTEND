import React, { useEffect, useState } from 'react';
import SlidePanel from './SlidePanel';
import { useAdminMode } from '../../context/AdminModeContext';
import { Package, CheckCircle, Clock, XCircle, MessageSquare, Image as ImageIcon, Mail } from 'lucide-react';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from './StatCard';
import { adminBookingService } from '../../services/adminBookingService';
import { adminFeedbackService } from '../../services/adminFeedbackService';
import { adminGalleryService } from '../../services/adminGalleryService';
import { adminContactService } from '../../services/adminContactService';

const DashboardPanel: React.FC = () => {
  const { activePanel, closePanel } = useAdminMode();
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalFeedback: 0,
    galleryImages: 0,
    contactMessages: 0
  });

  const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);

  useEffect(() => {
    if (activePanel !== 'dashboard') return;

    const fetchDashboardData = async () => {
      try {
        const [bookings, feedbacks, gallery, contacts] = await Promise.all([
          adminBookingService.getAllBookings(),
          adminFeedbackService.getAllFeedback(),
          adminGalleryService.getAllImages(),
          adminContactService.getAllMessages()
        ]);

        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.bookingStatus === 'Pending').length,
          completedBookings: bookings.filter((b: any) => b.bookingStatus === 'Completed').length,
          cancelledBookings: bookings.filter((b: any) => b.bookingStatus === 'Cancelled').length,
          totalFeedback: feedbacks.length,
          galleryImages: gallery.length,
          contactMessages: contacts.length
        });

        setBookingStatusData([
          { name: 'Pending', value: bookings.filter((b: any) => b.bookingStatus === 'Pending').length, color: '#f59e0b' },
          { name: 'Approved', value: bookings.filter((b: any) => b.bookingStatus === 'Approved').length, color: '#3b82f6' },
          { name: 'In Progress', value: bookings.filter((b: any) => b.bookingStatus === 'In Progress').length, color: '#8b5cf6' },
          { name: 'Completed', value: bookings.filter((b: any) => b.bookingStatus === 'Completed').length, color: '#10b981' },
          { name: 'Rejected', value: bookings.filter((b: any) => b.bookingStatus === 'Rejected').length, color: '#f97316' },
          { name: 'Cancelled', value: bookings.filter((b: any) => b.bookingStatus === 'Cancelled').length, color: '#ef4444' }
        ].filter(item => item.value > 0));

      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    fetchDashboardData();
  }, [activePanel]);

  return (
    <SlidePanel 
      title="Admin Dashboard" 
      isOpen={activePanel === 'dashboard'} 
      onClose={closePanel}
      width="max-w-4xl"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={Package} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Pending" value={stats.pendingBookings} icon={Clock} colorClass="bg-yellow-50 text-yellow-600" />
        <StatCard title="Completed" value={stats.completedBookings} icon={CheckCircle} colorClass="bg-green-50 text-green-600" />
        <StatCard title="Cancelled" value={stats.cancelledBookings} icon={XCircle} colorClass="bg-red-50 text-red-600" />
        <StatCard title="Feedback" value={stats.totalFeedback} icon={MessageSquare} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Gallery Images" value={stats.galleryImages} icon={ImageIcon} colorClass="bg-pink-50 text-pink-600" />
        <StatCard title="Messages" value={stats.contactMessages} icon={Mail} colorClass="bg-teal-50 text-teal-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-heading font-bold text-primary mb-4">Booking Status</h3>
          {bookingStatusData.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {bookingStatusData.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No booking data yet
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-heading font-bold text-primary mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-600">Booking Completion Rate</span>
              <span className="font-bold text-green-600">
                {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-600">Pending Ratio</span>
              <span className="font-bold text-yellow-600">
                {stats.totalBookings > 0 ? Math.round((stats.pendingBookings / stats.totalBookings) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-600">Gallery Images</span>
              <span className="font-bold text-purple-600">{stats.galleryImages}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Unread Messages</span>
              <span className="font-bold text-blue-600">{stats.contactMessages}</span>
            </div>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
};

export default DashboardPanel;
