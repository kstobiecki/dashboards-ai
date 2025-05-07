'use client';

import { ReactNode } from 'react';
import { DashboardProvider } from './DashboardContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
} 