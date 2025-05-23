'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { nanoid } from 'nanoid';

export interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  html?: string;
  conversationHistory?: {
    prompts: string;
    html: string;
  };
  intervalSettings?: {
    isEnabled: boolean;
    interval: number; // in minutes
    prompt: string;
  };
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  boxes: Box[];
}

interface DashboardContextType {
  dashboards: Dashboard[];
  selectedDashboard: Dashboard | null;
  setSelectedDashboard: (dashboard: Dashboard) => void;
  createDashboard: (title: string, description: string) => void;
  deleteDashboard: (dashboard: Dashboard) => void;
  addBox: (dashboardId: string, box: Box) => void;
  updateBox: (dashboardId: string, boxId: string, updates: Partial<Box>) => void;
  deleteBox: (dashboardId: string, boxId: string) => void;
  cloneBox: (sourceDashboardId: string, targetDashboardId: string, boxId: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  const createDashboard = (title: string, description: string) => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}-${nanoid(10)}`,
      title,
      description,
      createdAt: new Date().toISOString(),
      boxes: [],
    };
    setDashboards((prev) => [...prev, newDashboard]);
    setSelectedDashboard(newDashboard);
  };

  const deleteDashboard = (dashboard: Dashboard) => {
    setDashboards(dashboards.filter(d => d.id !== dashboard.id));
    if (selectedDashboard?.id === dashboard.id) {
      setSelectedDashboard(null);
    }
  };

  const addBox = (dashboardId: string, box: Box) => {
    setDashboards((prev) =>
      prev.map((dashboard) =>
        dashboard.id === dashboardId
          ? { ...dashboard, boxes: [...dashboard.boxes, box] }
          : dashboard
      )
    );
    setSelectedDashboard((prev) =>
      prev?.id === dashboardId
        ? { ...prev, boxes: [...prev.boxes, box] }
        : prev
    );
  };

  const updateBox = (dashboardId: string, boxId: string, updates: Partial<Box>) => {
    setDashboards((prev) =>
      prev.map((dashboard) =>
        dashboard.id === dashboardId
          ? {
              ...dashboard,
              boxes: dashboard.boxes.map((box) =>
                box.id === boxId ? { ...box, ...updates } : box
              ),
            }
          : dashboard
      )
    );
    setSelectedDashboard((prev) =>
      prev?.id === dashboardId
        ? {
            ...prev,
            boxes: prev.boxes.map((box) =>
              box.id === boxId ? { ...box, ...updates } : box
            ),
          }
        : prev
    );
  };

  const deleteBox = (dashboardId: string, boxId: string) => {
    setDashboards(prev => prev.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            boxes: dashboard.boxes.filter(box => box.id !== boxId),
          }
        : dashboard
    ));
    setSelectedDashboard(prev => 
      prev?.id === dashboardId
        ? {
            ...prev,
            boxes: prev.boxes.filter(box => box.id !== boxId),
          }
        : prev
    );
  };

  const cloneBox = (sourceDashboardId: string, targetDashboardId: string, boxId: string) => {
    const sourceDashboard = dashboards.find(d => d.id === sourceDashboardId);
    const boxToClone = sourceDashboard?.boxes.find(b => b.id === boxId);
    
    if (!boxToClone) return;

    const clonedBox: Box = {
      ...boxToClone,
      id: `box-${Date.now()}-${nanoid(10)}`,
      x: 50,  // Initial x position
      y: 50,  // Initial y position
    };

    setDashboards(prev => prev.map(dashboard =>
      dashboard.id === targetDashboardId
        ? {
            ...dashboard,
            boxes: [...dashboard.boxes, clonedBox],
          }
        : dashboard
    ));

    if (selectedDashboard?.id === targetDashboardId) {
      setSelectedDashboard(prev => 
        prev ? {
          ...prev,
          boxes: [...prev.boxes, clonedBox],
        } : prev
      );
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
        addBox,
        updateBox,
        deleteBox,
        cloneBox,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 