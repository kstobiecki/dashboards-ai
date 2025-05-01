'use client';

import { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { CollapsibleHeader } from './components/CollapsibleHeader';
import { CreateDashboardModal } from './components/CreateDashboardModal';
import { DeleteDashboardModal } from './components/DeleteDashboardModal';
import Image from 'next/image';
import { Dashboard } from './types/dashboard';

const menuWidth = 69;
const drawerWidth = 250;

// Generate a stable ID for dashboards
let idCounter = 0;
const generateId = () => {
  return `dashboard-${++idCounter}`;
};

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const theme = useTheme();

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

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    if (itemId === 'dashboard' && dashboards.length > 0) {
      setSelectedDashboard(dashboards[0]);
    }
  };

  const handleCreateDashboard = (title: string, description: string) => {
    const newDashboard: Dashboard = {
      id: generateId(),
      title,
      description,
      createdAt: new Date(),
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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" component="div" sx={{ mb: 3, color: '#e5e7eb' }}>
              DashboardsAI
            </Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List>
                {dashboards.map((dashboard) => (
                  <ListItemButton
                    key={dashboard.id}
                    selected={selectedDashboard?.id === dashboard.id}
                    onClick={() => setSelectedDashboard(dashboard)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                    }}
                  >
                    <Typography sx={{ color: selectedDashboard?.id === dashboard.id ? '#ffffff' : '#6b7280' }}>
                      {dashboard.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDashboardToDelete(dashboard);
                        setIsDeleteModalOpen(true);
                      }}
                      sx={{ color: '#6b7280' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateModalOpen(true)}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                mt: 2,
              }}
            >
              Add Dashboard
            </Button>
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
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  mb: 0.5,
                  color: selectedItem === item.id ? '#ffffff' : '#6b7280',
                }}
              >
                {item.icon}
              </ListItemIcon>
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

      {/* Collapsible Drawer */}
      <CollapsibleHeader 
        isVisible={isDrawerVisible} 
        onVisibilityChange={handleDrawerVisibilityChange}
        selectedItem={selectedItem}
      >
        {getDrawerContent()}
      </CollapsibleHeader>

      {/* Main Content */}
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
        {selectedItem === 'dashboard' && selectedDashboard && (
          <Box>
            <Typography variant="h4" sx={{ color: '#e5e7eb', mb: 2 }}>
              {selectedDashboard.title}
            </Typography>
            <Typography sx={{ color: '#6b7280' }}>
              {selectedDashboard.description}
            </Typography>
          </Box>
        )}
      </Box>

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
