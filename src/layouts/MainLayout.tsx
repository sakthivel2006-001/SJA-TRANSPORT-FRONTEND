import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastContainer, { type ToastData } from '../components/ToastContainer';

export const ToastContext = React.createContext<{
  addToast: (type: 'success' | 'error', message: string) => void;
}>({ addToast: () => {} });

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ToastContext.Provider>
  );
};

export default MainLayout;
