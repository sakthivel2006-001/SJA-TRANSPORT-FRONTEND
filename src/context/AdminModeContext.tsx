import React, { createContext, useState, useContext, type ReactNode } from 'react';

type PanelType = 'dashboard' | 'bookings' | 'feedback' | 'contacts' | 'settings' | 'fleet' | 'services' | null;

interface AdminModeContextType {
  activePanel: PanelType;
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

export const AdminModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const openPanel = (panel: PanelType) => setActivePanel(panel);
  const closePanel = () => setActivePanel(null);

  return (
    <AdminModeContext.Provider value={{ activePanel, openPanel, closePanel }}>
      {children}
    </AdminModeContext.Provider>
  );
};

export const useAdminMode = () => {
  const context = useContext(AdminModeContext);
  if (context === undefined) {
    throw new Error('useAdminMode must be used within an AdminModeProvider');
  }
  return context;
};
