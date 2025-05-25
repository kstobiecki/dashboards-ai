import { Box, List, ListItemButton, ListItemIcon, Typography } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExploreIcon from '@mui/icons-material/Explore';
import CloudIcon from '@mui/icons-material/Cloud';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  id: string;
}

interface LeftPanelProps {
  selectedItem: string;
  onSelect: (id: string) => void;
  menuWidth?: number;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboards', icon: <DashboardIcon />, id: 'dashboard' },
  { text: 'Explore', icon: <ExploreIcon />, id: 'explore' },
  { text: 'Hosting', icon: <CloudIcon />, id: 'hosting' },
  { text: 'Integrations', icon: <ExtensionIcon />, id: 'integrations' },
  { text: 'Settings', icon: <SettingsIcon />, id: 'settings' },
];

export const LeftPanel = ({ selectedItem, onSelect, menuWidth = 69 }: LeftPanelProps) => (
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
      onClick={() => onSelect('dashboard')}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <GridViewIcon sx={{ color: '#ffffff', fontSize: 20 }} />
      </Box>
    </Box>
    <List>
      {menuItems.map((item) => (
        <ListItemButton
          key={item.id}
          selected={selectedItem === item.id}
          onClick={() => onSelect(item.id)}
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
); 