'use client';

import { useState, useEffect } from 'react';
import {
  Box
} from '@mui/material';
import { Drawer } from './layouts/Drawer';
import { AppProviders } from './context/AppProviders';
import { DashboardContent } from './features/dashboards/components/DashboardContent';
import { LeftPanel } from './layouts/LeftPanel';
import { MainPanel } from './layouts/MainPanel';

const menuWidth = 69;

export default function Home() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerVisibilityChange = (visible: boolean) => {
    setIsDrawerVisible(visible);
  };

  return (
    <AppProviders>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Left Menu */}
        {mounted && (
          <LeftPanel
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
            menuWidth={menuWidth}
          />
        )}

        {/* Drawer */}
        {mounted && (
          <Drawer 
            isVisible={isDrawerVisible} 
            onVisibilityChange={handleDrawerVisibilityChange}
            selectedItem={selectedItem}
          />
        )}

        {/* Main Content */}
        {mounted && (
          <MainPanel
            selectedItem={selectedItem}
            menuWidth={menuWidth}
          />
        )}
      </Box>
    </AppProviders>
  );
}
