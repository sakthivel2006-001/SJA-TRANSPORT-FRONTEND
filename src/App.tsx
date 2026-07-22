import { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layout
import MainLayout from './layouts/MainLayout';

// Lazy loaded pages
import {
  HomePage,
  AboutPage,
  ServicesPage,
  GalleryPage,
  BookShipmentPage,
  ContactPage,
  AdminLoginPage,
  AdminLayoutPage,
  BookingManagementPage,
  DashboardPage,
  VehicleManagementPage,
  GalleryManagementPage,
  ServicesManagementPage,
  AchievementPage,
  FeedbackPage,
  ContactsPage,
  ProfilePage,
} from './routes/LazyRoutes';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AdminModeProvider } from './context/AdminModeContext';
import Preloader from './components/Preloader';
import PageLoader from './components/PageLoader';
import InstallPWA from './components/InstallPWA';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  return (
    <AuthProvider>
      <AdminModeProvider>
        <AnimatePresence mode="wait">
          {isInitialLoading && (
            <Preloader key="preloader" onComplete={() => setIsInitialLoading(false)} />
          )}
        </AnimatePresence>

        {!isInitialLoading && (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Router>
              <InstallPWA />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
                    <Route path="about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
                    <Route path="services" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
                    <Route path="gallery" element={<Suspense fallback={<PageLoader />}><GalleryPage /></Suspense>} />
                    <Route path="book" element={<Suspense fallback={<PageLoader />}><BookShipmentPage /></Suspense>} />
                    <Route path="contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
                  </Route>

                  <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLoginPage /></Suspense>} />
                  <Route path="/admin" element={<ProtectedRoute />}>
                    <Route element={<Suspense fallback={<PageLoader />}><AdminLayoutPage /></Suspense>}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
                      <Route path="bookings" element={<Suspense fallback={<PageLoader />}><BookingManagementPage /></Suspense>} />
                      <Route path="gallery" element={<Suspense fallback={<PageLoader />}><GalleryManagementPage /></Suspense>} />
                      <Route path="achievements" element={<Suspense fallback={<PageLoader />}><AchievementPage /></Suspense>} />
                      <Route path="feedback" element={<Suspense fallback={<PageLoader />}><FeedbackPage /></Suspense>} />
                      <Route path="contacts" element={<Suspense fallback={<PageLoader />}><ContactsPage /></Suspense>} />
                      <Route path="profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
                      <Route path="vehicles" element={<Suspense fallback={<PageLoader />}><VehicleManagementPage /></Suspense>} />
                      <Route path="services" element={<Suspense fallback={<PageLoader />}><ServicesManagementPage /></Suspense>} />
                    </Route>
                  </Route>
                </Routes>
              </AnimatePresence>
            </Router>
          </motion.div>
        )}
      </AdminModeProvider>
    </AuthProvider>
  );
}

export default App;
