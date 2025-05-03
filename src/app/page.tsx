'use client';

import { useState, useEffect } from 'react';
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
const drawerWidth = 280;

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

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

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    if (itemId === 'dashboard' && dashboards.length > 0) {
      setSelectedDashboard(dashboards[0]);
    }
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
            {/* Add Dashboard Button */}
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

            {/* Dashboards List */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
              <List sx={{ p: 0, m: 0, '& > .MuiListItemButton-root': { mb: 1 } }}>
                {dashboards.map((dashboard) => (
                  <ListItemButton
                    key={dashboard.id}
                    selected={selectedDashboard?.id === dashboard.id}
                    onClick={() => setSelectedDashboard(dashboard)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      height: 30,
                      p: 0,
                      pl: 3,
                      pr: 1,
                      m: 0,
                      borderRadius: '20px',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      },
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: selectedDashboard?.id === dashboard.id ? '#ffffff' : '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: selectedDashboard?.id === dashboard.id ? 500 : 400,
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dashboard.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDashboardToDelete(dashboard);
                        setIsDeleteModalOpen(true);
                      }}
                      sx={{
                        color: '#6b7280',
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                        '&:hover': {
                          color: '#ef4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        },
                        '.MuiListItemButton-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </Box>
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
            <>
              {!selectedDashboard && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                  }}
                >
                  <Box
                    sx={{
                      width: '33vw',
                      minWidth: 260,
                      maxWidth: 480,
                      mb: 1,
                      display: dashboards.length === 2 || dashboards.length === 3 ? 'flex' : 'block',
                      flexDirection: 'row',
                      gap: 2,
                    }}
                  >
                    {dashboards.slice(0, 3).map((dashboard) => (
                      <Box
                        key={dashboard.id}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 1,
                          p: 2,
                          cursor: 'pointer',
                          width:
                            dashboards.length === 1
                              ? '100%'
                              : dashboards.length === 2
                              ? '48%'
                              : dashboards.length === 3
                              ? '30%'
                              : '100%',
                          height: '260px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          },
                        }}
                        onClick={() => setSelectedDashboard(dashboard)}
                      >
                        <Typography variant="h6" sx={{ color: '#e5e7eb', mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dashboard.title}
                        </Typography>
                        <Typography sx={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 9,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis',
                        }}>
                          {dashboard.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 'auto',
                      minHeight: 'unset',
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setIsCreateModalOpen(true)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#e5e7eb',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#6b7280',
                        },
                      }}
                    >
                      Create Dashboard
                    </Button>
                  </Box>
                </Box>
              )}

              {selectedDashboard && (
                <Box>
                  <Typography variant="h4" sx={{ color: '#e5e7eb', mb: 2 }}>
                    {selectedDashboard.title}
                  </Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {selectedDashboard.description}
                  </Typography>
                </Box>
              )}
            </>
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
