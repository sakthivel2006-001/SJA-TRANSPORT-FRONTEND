import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  Truck, 
  MessageSquare, 
  Image as ImageIcon,
  Users,
  Mail 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import { adminDashboardService } from '../../services/adminDashboardService';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
    completedDeliveries: 0,
    totalCustomers: 0,
    totalFeedback: 0,
    approvedReviews: 0,
    galleryImages: 0,
    services: 0,
    vehicles: 0,
    contactMessages: 0,
  });

  // Remove unused state
  // const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  // const [latestFeedback, setLatestFeedback] = useState<Feedback[]>([]);
  
  // Chart Data State
  const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await adminDashboardService.getStats();
        setStats(res);

        // Build bookingStatusData for pie chart using real status counts
        const pending = res.pendingBookings || 0;
        const approved = res.approvedBookings || res.confirmedBookings || 0;
        const completed = res.completedBookings || res.completedDeliveries || 0;
        const cancelled = res.cancelledBookings || 0;
        setBookingStatusData([
          { name: 'Pending', value: pending, color: '#f59e0b' },
          { name: 'Approved', value: approved, color: '#3b82f6' },
          { name: 'Completed', value: completed, color: '#10b981' },
          { name: 'Cancelled', value: cancelled, color: '#ef4444' },
        ].filter(item => item.value > 0));

        // Set Recent Data (removed state setters to fix unused warnings)

      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const onDataChanged = () => fetchDashboardData();
    window.addEventListener('data:bookings:changed', onDataChanged);
    // Poll every 10 seconds for live updates
    const id = setInterval(fetchDashboardData, 10000);

    return () => {
      clearInterval(id);
      window.removeEventListener('data:bookings:changed', onDataChanged);
    };
  }, []);

  // Build monthly data from live stats (current calendar month)
  const now = new Date();
  const monthName = now.toLocaleString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
  const monthlyData = [{ name: monthName, bookings: stats.monthlyBookings || 0 }];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon={CalendarDays} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Pending Bookings" 
          value={stats.pendingBookings} 
          icon={Clock} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
        <StatCard 
          title="Approved Reviews" 
          value={stats.approvedReviews} 
          icon={CheckCircle} 
          colorClass="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="Completed Deliveries" 
          value={stats.completedDeliveries} 
          icon={Truck} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Feedback" 
          value={stats.totalFeedback} 
          icon={MessageSquare} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Gallery Images" 
          value={stats.galleryImages} 
          icon={ImageIcon} 
          colorClass="bg-pink-100 text-pink-600" 
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={Users} 
          colorClass="bg-teal-100 text-teal-600" 
        />
        <StatCard 
          title="Total Contacts" 
          value={stats.contactMessages} 
          icon={Mail} 
          colorClass="bg-rose-100 text-rose-600" 
        />
        <StatCard 
          title="New Messages" 
          value={stats.contactNew || 0} 
          icon={Mail} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Replied Messages" 
          value={stats.contactReplied || 0} 
          icon={Mail} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard title="Services" value={stats.services} icon={Truck} colorClass="bg-sky-100 text-sky-600" />
        <StatCard title="Vehicles" value={stats.vehicles} icon={Truck} colorClass="bg-emerald-100 text-emerald-600" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Bookings</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Booking Status</h3>
          <div className="h-80 w-full flex flex-col items-center justify-center">
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No data available</div>
            )}
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {bookingStatusData.map((entry, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
