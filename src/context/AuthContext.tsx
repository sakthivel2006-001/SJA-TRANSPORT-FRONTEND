import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { Admin } from '../services/authService';

const TOKEN_STORAGE_KEY = 'token';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, adminData: Admin) => void;
  logout: () => void;
  editMode: boolean;
  toggleEditMode: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          try {
            const profile = await authService.getProfile();
            setAdmin(profile);
          } catch {
            window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, adminData: Admin) => {
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAdmin(adminData);
    setEditMode(true); // Default to edit mode when logged in
  };

  const logout = () => {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setAdmin(null);
    setEditMode(false);
  };

  const isAuthenticated = !!admin;

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout, editMode, toggleEditMode: () => setEditMode(prev => !prev) }}>
      {children}
    </AuthContext.Provider>
  );
};
