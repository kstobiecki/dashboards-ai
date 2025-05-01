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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { CollapsibleHeader } from './components/CollapsibleHeader';
import Image from 'next/image';

const menuWidth = 69;
const drawerWidth = 250;

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
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
      />

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
        <Box sx={{ mt: 0 }}>
          {/* Main content will go here */}
        </Box>
      </Box>
    </Box>
  );
}
