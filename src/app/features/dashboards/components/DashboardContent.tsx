import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import { useState } from 'react';
import { CreateDashboardModal } from './CreateDashboardModal';
import { DraggableResizableBox } from './DraggableResizableBox';
import { useDrop } from 'react-dnd';

export const DashboardContent = () => {
  const { 
    dashboards, 
    selectedDashboard, 
    setSelectedDashboard, 
    createDashboard,
    addBox,
    updateBox,
  } = useDashboard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: (item: { id: string }, monitor) => {
      if (!selectedDashboard) return;
      
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const box = selectedDashboard.boxes.find(b => b.id === item.id);
      if (!box) return;

      const newPosition = {
        x: box.x + delta.x,
        y: box.y + delta.y,
      };
      
      updateBox(selectedDashboard.id, item.id, newPosition);
    },
  }), [selectedDashboard, updateBox]);

  const dropRef = (node: HTMLDivElement | null) => {
    drop(node);
  };

  const handleAddBox = () => {
    if (!selectedDashboard) return;
    if (selectedDashboard.boxes.length >= 20) return;
    
    const newBox = {
      id: `box-${Date.now()}`,
      x: 50,
      y: 50,
      width: 300,
      height: 200,
    };
    addBox(selectedDashboard.id, newBox);
  };

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
            display: dashboards.length > 1 ? 'flex' : 'block',
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

        <CreateDashboardModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={createDashboard}
        />
      </Box>
    );
  }
  
  return (
    <div 
      ref={dropRef} 
      data-drop-container
      style={{ 
        minHeight: '100vh', 
        position: 'relative', 
        backgroundColor: '#18181b', 
        padding: 24,
        width: '100%',
        height: '100%',
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddBox}
        disabled={selectedDashboard.boxes.length >= 20}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#e5e7eb',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
          '& .MuiSvgIcon-root': {
            color: '#6b7280',
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        Add Card
      </Button>

      {selectedDashboard.boxes.map((box) => (
        <DraggableResizableBox
          key={box.id}
          id={box.id}
          title={selectedDashboard.title}
          description={selectedDashboard.description}
          position={{ x: box.x, y: box.y }}
          size={{ width: box.width, height: box.height }}
          onResize={(newSize) => {
            updateBox(selectedDashboard.id, box.id, newSize);
          }}
        />
      ))}
    </div>
  );
}; 