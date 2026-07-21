import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail } from 'lucide-react';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../layouts/MainLayout';
import Spinner from '../components/Spinner';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasFieldError, setHasFieldError] = useState(false);
  const isSubmittingRef = useRef(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [auth?.isAuthenticated, navigate]);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setErrorMessage('');
      setHasFieldError(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [errorMessage]);

  const clearLoginError = () => {
    if (errorMessage) {
      setErrorMessage('');
      setHasFieldError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setHasFieldError(false);
    setErrorMessage('');

    try {
      const data = await authService.login(email.trim(), password);
      const token = data?.token;

      if (!token) {
        throw new Error('Authentication failed');
      }

      auth?.login(token, data);
      toastContext?.addToast('success', 'Welcome back, Administrator.');
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setHasFieldError(true);
      setErrorMessage('Invalid email or password.');
      toastContext?.addToast('error', 'Invalid email or password.');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-primary px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-white/80">Secure access to SJA TRANSPORT</p>
          </div>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text/80 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearLoginError();
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl outline-none transition-all ${
                    hasFieldError
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent'
                  }`}
                  placeholder="admin@sjatransport.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text/80 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearLoginError();
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl outline-none transition-all ${
                    hasFieldError
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Spinner size={20} />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
