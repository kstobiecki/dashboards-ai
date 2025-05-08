import { Box, List, ListItemButton, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import { Dashboard } from '../types/dashboard';

interface DashboardListProps {
  onDeleteClick: (dashboard: Dashboard) => void;
  dashboardToDelete: Dashboard | null;
  onDeleteCancel: () => void;
}

export const DashboardList = ({ onDeleteClick, dashboardToDelete, onDeleteCancel }: DashboardListProps) => {
  const { dashboards, selectedDashboard, setSelectedDashboard, deleteDashboard } = useDashboard();

  const handleConfirmDelete = () => {
    if (dashboardToDelete) {
      deleteDashboard(dashboardToDelete);
      onDeleteCancel();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', p: 0 }}>
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
                  onDeleteClick(dashboard);
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
      <Dialog 
        open={!!dashboardToDelete} 
        onClose={onDeleteCancel}
        PaperProps={{
          sx: {
            backgroundColor: '#23232a',
            color: '#e5e7eb',
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 340,
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem', background: 'none', pb: 0 }}>
          Delete Dashboard
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#bdbdbd', fontSize: '1rem' }}>
            Are you sure you want to delete the dashboard "{dashboardToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={onDeleteCancel} sx={{ color: '#bdbdbd' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ color: '#ef4444', fontWeight: 600 }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 