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
  const { createDashboard, setIsAnyModalOpen } = useDashboard();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const drawerWidth = 250;
  const menuWidth = 69;

  // Update isAnyModalOpen when modals change
  useEffect(() => {
    setIsAnyModalOpen(isCreateModalOpen || !!dashboardToDelete);
  }, [isCreateModalOpen, dashboardToDelete, setIsAnyModalOpen]);

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
      case 'explore':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
              Explore
            </Typography>
            <Typography sx={{ color: '#6b7280', mb: 2 }}>
              Future Release
            </Typography>
            <Typography sx={{ color: '#e5e7eb', lineHeight: 1.6 }}>
              Discover and explore the most popular and trending dashboards created by our community. Browse through publicly shared cards, find inspiration, and like your favorites. This feature will help you discover new ways to visualize and present your data while connecting with other dashboard creators.
            </Typography>
          </Box>
        );
      case 'hosting':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
              Hosting
            </Typography>
            <Typography sx={{ color: '#6b7280', mb: 2 }}>
              Future Release
            </Typography>
            <Typography sx={{ color: '#e5e7eb', lineHeight: 1.6 }}>
              This feature will enable users to host their dashboards under custom domains, making them publicly accessible. You&apos;ll be able to share your dashboards with anyone through a unique URL, perfect for team collaboration or public presentations.
            </Typography>
          </Box>
        );
      case 'integrations':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
              Integrations
            </Typography>
            <Typography sx={{ color: '#6b7280', mb: 2 }}>
              Future Release
            </Typography>
            <Typography sx={{ color: '#e5e7eb', lineHeight: 1.6 }}>
              Seamless integration with popular services like Google Calendar, Slack, and more. Display real-time data from your favorite tools directly in your dashboard cards, creating a unified view of all your important information.
            </Typography>
          </Box>
        );
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
              Settings
            </Typography>
            <Typography sx={{ color: '#6b7280', mb: 2 }}>
              Future Release
            </Typography>
            <Typography sx={{ color: '#e5e7eb', lineHeight: 1.6 }}>
              Manage your account settings, view usage statistics, and customize your dashboard experience. Track your prompt usage, manage API keys, and configure your preferences all in one place.
            </Typography>
          </Box>
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