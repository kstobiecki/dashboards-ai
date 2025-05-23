'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDashboard } from '../features/dashboards/context/DashboardContext';
import { DashboardList } from '../features/dashboards/components/DashboardList';
import { CreateDashboardModal } from '../features/dashboards/components/CreateDashboardModal';
import { Dashboard } from '../features/dashboards/types/dashboard';

interface DrawerProps {
  selectedItem: string;
}

export const Drawer = ({ 
  selectedItem,
}: DrawerProps) => {
  const { createDashboard } = useDashboard();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const drawerWidth = 250;
  const menuWidth = 69;

  const onVisibilityChange = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        // When drawer is hidden, show it only when cursor is over the menu
        if (e.clientX < menuWidth) {
          onVisibilityChange(true);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible, onVisibilityChange, menuWidth]);

  // Hide drawer when any modal is opened
  useEffect(() => {
    if (isCreateModalOpen || dashboardToDelete) {
      onVisibilityChange(false);
    }
  }, [isCreateModalOpen, dashboardToDelete, onVisibilityChange]);

  const handleDrawerMouseLeave = () => {
    onVisibilityChange(false);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'dashboard':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', p: 0 }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
              pr: 0,
            }}>
              <IconButton
                onClick={() => setIsCreateModalOpen(true)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiSvgIcon-root': {
                      color: '#ffffff',
                      transform: 'rotate(90deg)',
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#6b7280',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <DashboardList 
              onDeleteClick={setDashboardToDelete}
              dashboardToDelete={dashboardToDelete}
              onDeleteCancel={() => setDashboardToDelete(null)}
            />
            <CreateDashboardModal
              open={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={createDashboard}
            />
          </Box>
        );
      case 'analytics':
        return (
          <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
            Analytics Overview
          </Typography>
        );
      case 'users':
        return (
          <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
            User Management
          </Typography>
        );
      case 'settings':
        return (
          <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
            Settings & Preferences
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      ref={drawerRef}
      onMouseLeave={handleDrawerMouseLeave}
      sx={{
        position: 'fixed',
        top: 0,
        left: `${menuWidth}px`,
        width: drawerWidth,
        height: '100vh',
        backgroundColor: '#1f1f23',
        borderRight: '1px solid #27272a',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        transform: `translateX(${isVisible ? 0 : -drawerWidth}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {renderContent()}
    </Box>
  );
}; 