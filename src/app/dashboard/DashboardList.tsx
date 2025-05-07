import { Box, List, ListItemButton, Typography, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Dashboard } from '../types/dashboard';

interface DashboardListProps {
  dashboards: Dashboard[];
  selectedDashboard: Dashboard | null;
  onDashboardSelect: (dashboard: Dashboard) => void;
  onDashboardDelete: (dashboard: Dashboard) => void;
}

export const DashboardList = ({
  dashboards,
  selectedDashboard,
  onDashboardSelect,
  onDashboardDelete,
}: DashboardListProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', p: 0 }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
        <List sx={{ p: 0, m: 0, '& > .MuiListItemButton-root': { mb: 1 } }}>
          {dashboards.map((dashboard) => (
            <ListItemButton
              key={dashboard.id}
              selected={selectedDashboard?.id === dashboard.id}
              onClick={() => onDashboardSelect(dashboard)}
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
                  onDashboardDelete(dashboard);
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
}; 