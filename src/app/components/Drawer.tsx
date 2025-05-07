'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Dashboard } from '../types/dashboard';
import { DashboardList } from '../dashboard/DashboardList';

interface DrawerProps {
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  selectedItem: string;
  dashboards: Dashboard[];
  selectedDashboard: Dashboard | null;
  onDashboardSelect: (dashboard: Dashboard) => void;
  onDashboardDelete: (dashboard: Dashboard) => void;
  onCreateDashboard: () => void;
}

export const Drawer = ({ 
  isVisible, 
  onVisibilityChange, 
  selectedItem,
  dashboards,
  selectedDashboard,
  onDashboardSelect,
  onDashboardDelete,
  onCreateDashboard,
}: DrawerProps) => {
  const [mouseX, setMouseX] = useState(0);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const drawerWidth = 250;
  const menuWidth = 69;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      
      if (isVisible) {
        // When drawer is visible, hide it when cursor moves beyond menu + drawer width
        if (e.clientX > menuWidth + drawerWidth) {
          setIsHoveringLeft(false);
          onVisibilityChange(false);
        }
      } else {
        // When drawer is hidden, show it only when cursor is over the menu
        if (e.clientX < menuWidth) {
          setIsHoveringLeft(true);
          onVisibilityChange(true);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible, onVisibilityChange, drawerWidth, menuWidth]);

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
                onClick={onCreateDashboard}
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
              dashboards={dashboards}
              selectedDashboard={selectedDashboard}
              onDashboardSelect={onDashboardSelect}
              onDashboardDelete={onDashboardDelete}
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