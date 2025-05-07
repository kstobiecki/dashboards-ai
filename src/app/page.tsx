'use client';

import { useState, useEffect } from 'react';
import {
  Box
} from '@mui/material';
import { Drawer } from './layouts/Drawer';
import { AppProviders } from './context/AppProviders';
import { LeftPanel } from './layouts/LeftPanel';
import { MainPanel } from './layouts/MainPanel';

const menuWidth = 69;

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
