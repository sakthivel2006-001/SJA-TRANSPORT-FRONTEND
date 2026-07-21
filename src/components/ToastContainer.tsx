import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<{ toast: ToastData; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${
        toast.type === 'success'
          ? 'bg-white border-green-200 text-green-800'
          : 'bg-white border-red-200 text-red-800'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircle2 className="text-green-500 shrink-0" size={22} />
      ) : (
        <XCircle className="text-red-500 shrink-0" size={22} />
      )}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </motion.div>
  );
};

const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onClose={() => removeToast(t.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
