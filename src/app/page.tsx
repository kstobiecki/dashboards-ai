'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { Drawer } from './components/Drawer';
import { CreateDashboardModal } from './components/CreateDashboardModal';
import { DeleteDashboardModal } from './components/DeleteDashboardModal';
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

      {/* Drawer */}
      {mounted && (
        <Drawer 
          isVisible={isDrawerVisible} 
          onVisibilityChange={handleDrawerVisibilityChange}
          selectedItem={selectedItem}
          dashboards={dashboards}
          selectedDashboard={selectedDashboard}
          onDashboardSelect={setSelectedDashboard}
          onDashboardDelete={(dashboard) => {
            setDashboardToDelete(dashboard);
            setIsDeleteModalOpen(true);
          }}
          onCreateDashboard={() => setIsCreateModalOpen(true)}
        />
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
