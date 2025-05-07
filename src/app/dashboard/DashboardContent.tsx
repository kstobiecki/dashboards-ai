import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Dashboard } from '../types/dashboard';

interface DashboardContentProps {
  dashboards: Dashboard[];
  selectedDashboard: Dashboard | null;
  onDashboardSelect: (dashboard: Dashboard) => void;
  onCreateDashboard: () => void;
}

export const DashboardContent = ({
  dashboards,
  selectedDashboard,
  onDashboardSelect,
  onCreateDashboard,
}: DashboardContentProps) => {
  if (!selectedDashboard) {
    return (
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
              onClick={() => onDashboardSelect(dashboard)}
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
            onClick={onCreateDashboard}
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
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#e5e7eb', mb: 2 }}>
        {selectedDashboard.title}
      </Typography>
      <Typography sx={{ color: '#6b7280' }}>
        {selectedDashboard.description}
      </Typography>
    </Box>
  );
}; 