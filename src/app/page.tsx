'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { CollapsibleHeader } from './components/CollapsibleHeader';
import { CreateDashboardModal } from './dashboard/modals/CreateDashboardModal';
import { DeleteDashboardModal } from './dashboard/modals/DeleteDashboardModal';
import { DashboardList } from './dashboard/DashboardList';
import { DashboardContent } from './dashboard/DashboardContent';
import Image from 'next/image';
import { Dashboard } from './types/dashboard';

const menuWidth = 69;

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { text: 'Dashboards', icon: <DashboardIcon />, id: 'dashboard' },
    { text: 'Analytics', icon: <BarChartIcon />, id: 'analytics' },
    { text: 'Users', icon: <PeopleIcon />, id: 'users' },
    { text: 'Settings', icon: <SettingsIcon />, id: 'settings' },
  ];

  const handleDrawerVisibilityChange = (visible: boolean) => {
    setIsDrawerVisible(visible);
  };

  const handleLogoClick = () => {
    setSelectedItem('dashboard');
  };


  const generateId = () => {
    return `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleCreateDashboard = (title: string, description: string) => {
    const newDashboard: Dashboard = {
      id: generateId(),
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    setDashboards([...dashboards, newDashboard]);
    setSelectedDashboard(newDashboard);
  };

  const handleDeleteDashboard = () => {
    if (dashboardToDelete) {
      setDashboards(dashboards.filter(d => d.id !== dashboardToDelete.id));
      if (selectedDashboard?.id === dashboardToDelete.id) {
        setSelectedDashboard(null);
      }
      setDashboardToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const getDrawerContent = () => {
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
              dashboards={dashboards}
              selectedDashboard={selectedDashboard}
              onDashboardSelect={setSelectedDashboard}
              onDashboardDelete={(dashboard) => {
                setDashboardToDelete(dashboard);
                setIsDeleteModalOpen(true);
              }}
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Menu */}
      {mounted && (
        <Box
          sx={{
            width: menuWidth,
            flexShrink: 0,
            backgroundColor: '#1f1f23',
            borderRight: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1001,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              p: 2,
              borderBottom: '1px solid #27272a',
              minHeight: 64,
              cursor: 'pointer',
            }}
            onClick={handleLogoClick}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/assets/logos/main.png"
                alt="DashboardsAI Logo"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </Box>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedItem === item.id}
                onClick={() => setSelectedItem(item.id)}
                sx={{
                  minHeight: 48,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: 1,
                  py: 1.5,
                  backgroundColor: 'transparent',
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                  },
                  '&:hover:not(.Mui-selected)': {
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 0.5,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: selectedItem === item.id 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'transparent',
                      transition: 'background-color 0.2s ease-in-out',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      color: selectedItem === item.id ? '#ffffff' : '#6b7280',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    lineHeight: 1,
                    color: selectedItem === item.id ? '#ffffff' : '#6b7280',
                  }}
                >
                  {item.text}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}

      {/* Collapsible Drawer */}
      {mounted && (
        <CollapsibleHeader 
          isVisible={isDrawerVisible} 
          onVisibilityChange={handleDrawerVisibilityChange}
          selectedItem={selectedItem}
        >
          {getDrawerContent()}
        </CollapsibleHeader>
      )}

      {/* Main Content */}
      {mounted && (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#18181b',
            minHeight: '100vh',
            marginLeft: `${menuWidth}px`,
            width: `calc(100% - ${menuWidth}px)`,
            position: 'relative',
          }}
        >
          {selectedItem === 'dashboard' && (
            <DashboardContent
              dashboards={dashboards}
              selectedDashboard={selectedDashboard}
              onDashboardSelect={setSelectedDashboard}
              onCreateDashboard={() => setIsCreateModalOpen(true)}
            />
          )}
        </Box>
      )}

      {/* Modals */}
      <CreateDashboardModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateDashboard}
      />
      <DeleteDashboardModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteDashboard}
        dashboardTitle={dashboardToDelete?.title || ''}
      />
    </Box>
  );
}
