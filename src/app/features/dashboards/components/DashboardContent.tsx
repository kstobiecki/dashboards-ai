import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import { useState } from 'react';
import { CreateDashboardModal } from './CreateDashboardModal';
import { useDrag, useDrop } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Custom styles for resize handles
const resizeHandleStyles = {
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
};

export const DashboardContent = () => {
  const { dashboards, selectedDashboard, setSelectedDashboard, createDashboard } = useDashboard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 200 });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOX',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: (_, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        setPosition(prev => ({
          x: prev.x + delta.x,
          y: prev.y + delta.y,
        }));
      }
    },
  }));

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

  const dropRef = (node: HTMLDivElement | null) => {
    drop(node);
  };

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <div ref={dropRef} style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#18181b', padding: 24 }}>
      <ResizableBox
        width={size.width}
        height={size.height}
        onResizeStop={(e, { size: newSize }) => setSize(newSize)}
        minConstraints={[200, 150]}
        maxConstraints={[800, 600]}
        resizeHandles={['se']}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 4,
          padding: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'move',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <div ref={dragRef} style={{ height: '100%', width: '100%' }}>
          <Typography variant="h4" sx={{ color: '#e5e7eb', mb: 2 }}>
            {selectedDashboard.title}
          </Typography>
          <Typography sx={{ color: '#6b7280' }}>
            {selectedDashboard.description}
          </Typography>
        </div>
      </ResizableBox>

      <style jsx global>{`
        .react-resizable {
          padding: 0 !important;
        }

        .react-resizable-handle {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          padding: 0;
          width: 10px;
          height: 10px;
        }
        .react-resizable-handle:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .react-resizable-handle-se {
          bottom: 0;
          right: 0;
          cursor: se-resize;
        }
      `}</style>
    </div>
  );
}; 