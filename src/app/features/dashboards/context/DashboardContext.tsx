'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Dashboard } from '../types/dashboard';

interface DashboardContextType {
  dashboards: Dashboard[];
  selectedDashboard: Dashboard | null;
  setSelectedDashboard: (dashboard: Dashboard | null) => void;
  createDashboard: (title: string, description: string) => void;
  deleteDashboard: (dashboard: Dashboard) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  const generateId = () => {
    return `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const createDashboard = (title: string, description: string) => {
    const newDashboard: Dashboard = {
      id: generateId(),
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newDashboard);
  };

  const deleteDashboard = (dashboard: Dashboard) => {
    setDashboards(dashboards.filter(d => d.id !== dashboard.id));
    if (selectedDashboard?.id === dashboard.id) {
      setSelectedDashboard(null);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboards,
        selectedDashboard,
        setSelectedDashboard,
        createDashboard,
        deleteDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 