import { Box, Typography, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import { useState } from 'react';
import { CreateDashboardModal } from './CreateDashboardModal';
import { DraggableResizableBox } from './DraggableResizableBox';
import { useDrop } from 'react-dnd';

const CLOCK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Responsive Boxes with Clock and Date</title>
    <script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }
        .container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: stretch;
            flex-wrap: wrap;
        }
        .box {
            flex: 1 1 300px;
            min-width: 200px;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
            border: 1px solid #ccc;
        }
        .box:nth-child(1) { background-color: #f8b400; }
        .box:nth-child(2) { background-color: #28c76f; color: white; }
        .box:nth-child(3) { background-color: #00cfe8; }

        .clock-time {
            font-size: 2rem;
            font-weight: bold;
        }
        .clock-date {
            font-size: 1.2rem;
            margin-top: 0.5em;
        }

        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="box">Box 1</div>
    <div class="box">
        <div class="clock-time" id="clock-time">--:--:--</div>
        <div class="clock-date" id="clock-date">Loading date...</div>
    </div>
    <div class="box">Box 3</div>
</div>

<script>
    function updateClock() {
        const now = dayjs();
        document.getElementById("clock-time").textContent = now.format('HH:mm:ss');
        document.getElementById("clock-date").textContent = now.format('dddd, MMMM D, YYYY');
    }

    setInterval(updateClock, 1000);
    updateClock(); // initial call
</script>
</body>
</html>`;

export const DashboardContent = () => {
  const { 
    dashboards, 
    selectedDashboard, 
    setSelectedDashboard, 
    createDashboard,
    addBox,
    updateBox,
    deleteBox,
  } = useDashboard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});
  const [nextZIndex, setNextZIndex] = useState(1);

  const handleCardFocus = (cardId: string) => {
    setZIndexMap(prev => ({
      ...prev,
      [cardId]: nextZIndex
    }));
    setNextZIndex(prev => prev + 1);
  };

  const [, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: (item: { id: string }, monitor) => {
      if (!selectedDashboard || !isEditMode) return;
      
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
  }), [selectedDashboard, updateBox, isEditMode]);

  const dropRef = (node: HTMLDivElement | null) => {
    drop(node);
  };

  const handleAddBox = () => {
    if (!selectedDashboard || !isEditMode) return;
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ 
        minHeight: '100vh', 
        position: 'relative', 
        backgroundColor: '#18181b', 
        padding: 24,
        width: '100%',
        height: '100%',
      }}
    >
      <Box 
        sx={{ 
          position: 'fixed',
          top: 24,
          right: 24,
          display: 'flex',
          gap: 2,
          zIndex: 2000,
        }}
      >
        <IconButton
          onClick={() => setIsEditMode(!isEditMode)}
          sx={{
            backgroundColor: '#23232a',
            color: '#e5e7eb',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isEditMode ? 1 : (isHovering ? 1 : 0),
            '&:hover': {
              backgroundColor: '#2d2d35',
            },
          }}
        >
          {isEditMode ? <CheckIcon /> : <EditIcon />}
        </IconButton>
        {isEditMode && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBox}
            disabled={selectedDashboard.boxes.length >= 20}
            sx={{
              backgroundColor: '#23232a',
              color: '#e5e7eb',
              '&:hover': {
                backgroundColor: '#2d2d35',
              },
              '& .MuiSvgIcon-root': {
                color: '#6b7280',
              },
              '&.Mui-disabled': {
                backgroundColor: '#1a1a1d',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Add Card
          </Button>
        )}
      </Box>

      {selectedDashboard.boxes.map((box) => (
        <DraggableResizableBox
          key={box.id}
          id={box.id}
          title={selectedDashboard.title}
          htmlContent={CLOCK_HTML}
          position={{ x: box.x, y: box.y }}
          size={{ width: box.width, height: box.height }}
          onResize={(newSize) => {
            updateBox(selectedDashboard.id, box.id, newSize);
          }}
          onDelete={() => {
            deleteBox(selectedDashboard.id, box.id);
          }}
          isEditMode={isEditMode}
          zIndex={zIndexMap[box.id] || 1}
          onFocus={() => handleCardFocus(box.id)}
        />
      ))}
    </div>
  );
}; 