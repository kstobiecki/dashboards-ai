'use client';

import { ReactNode } from 'react';
import { DashboardProvider } from '../features/dashboards/context/DashboardContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
} 