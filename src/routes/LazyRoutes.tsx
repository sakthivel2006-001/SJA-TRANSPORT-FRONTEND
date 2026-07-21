import { lazy } from 'react';

export const HomePage = lazy(() => import('../pages/Home'));
export const AboutPage = lazy(() => import('../pages/About'));
export const ServicesPage = lazy(() => import('../pages/Services'));
export const GalleryPage = lazy(() => import('../pages/Gallery'));
export const BookShipmentPage = lazy(() => import('../pages/BookShipment'));
export const ContactPage = lazy(() => import('../pages/Contact'));
export const AdminLoginPage = lazy(() => import('../pages/AdminLogin'));
export const AdminLayoutPage = lazy(() => import('../layouts/AdminLayout'));
export const BookingManagementPage = lazy(() => import('../pages/admin/BookingManagement'));
export const DashboardPage = lazy(() => import('../pages/admin/Dashboard'));
export const VehicleManagementPage = lazy(() => import('../pages/admin/VehicleManagement'));
export const GalleryManagementPage = lazy(() => import('../pages/admin/GalleryManagement'));
export const ServicesManagementPage = lazy(() => import('../components/admin/ServicesPanel'));
export const AchievementPage = lazy(() => import('../pages/admin/AchievementManagement'));
export const FeedbackPage = lazy(() => import('../pages/admin/FeedbackManagement'));
export const ContactsPage = lazy(() => import('../pages/admin/ContactManagement'));
export const ProfilePage = lazy(() => import('../pages/admin/ProfileManagement'));
