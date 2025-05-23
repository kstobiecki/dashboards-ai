import { Box, Typography, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import { useState, useEffect } from 'react';
import { CreateDashboardModal } from './CreateDashboardModal';
import { DraggableResizableBox } from './DraggableResizableBox';
import { useDrop } from 'react-dnd';
import { AddCardModal } from './AddCardModal';

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
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});
  const [nextZIndex, setNextZIndex] = useState(1);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<{ prompts: string; html: string }>({ prompts: '', html: '' });
  const [intervalSettings, setIntervalSettings] = useState({ isEnabled: false, interval: 1, prompt: '' });

  useEffect(() => {
    if (selectedDashboard && selectedDashboard.boxes.length === 0) {
      setIsEditMode(true);
    }
  }, [selectedDashboard]);

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

  const handleAddBox = (intervalSettings: { isEnabled: boolean; interval: number; prompt: string }) => {
    if (!selectedDashboard || !isEditMode) return;
    if (selectedDashboard.boxes.length >= 20) return;
    
    const newBox = {
      id: `box-${Date.now()}`,
      x: 50,
      y: 50,
      width: 600,
      height: 380,
      html: generatedHtml,
      conversationHistory,
      intervalSettings,
    };
    addBox(selectedDashboard.id, newBox);
    setZIndexMap(prev => ({
      ...prev,
      [newBox.id]: nextZIndex
    }));
    setNextZIndex(prev => prev + 1);
    setGeneratedHtml('');
    setConversationHistory({ prompts: '', html: '' });
    setIntervalSettings({ isEnabled: false, interval: 1, prompt: '' });
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
  
  const isEmptyDashboard = selectedDashboard.boxes.length === 0;
  
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
      {!isEmptyDashboard && (
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
              onClick={() => setIsAddCardModalOpen(true)}
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
      )}

      {isEmptyDashboard ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#6b7280',
              textAlign: 'center',
              mb: 2,
            }}
          >
            No cards yet. Add your first card to get started.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddCardModalOpen(true)}
            sx={{
              backgroundColor: '#23232a',
              color: '#e5e7eb',
              '&:hover': {
                backgroundColor: '#2d2d35',
              },
              '& .MuiSvgIcon-root': {
                color: '#6b7280',
              },
            }}
          >
            Add Card
          </Button>
        </Box>
      ) : (
        selectedDashboard.boxes.map((box) => (
          <DraggableResizableBox
            key={box.id}
            id={box.id}
            htmlContent={box.html || ''}
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
            conversationHistory={box.conversationHistory}
            onUpdate={(html, conversationHistory, intervalSettings) => {
              updateBox(selectedDashboard.id, box.id, { html, conversationHistory, intervalSettings });
            }}
            intervalSettings={box.intervalSettings}
          />
        ))
      )}

      <AddCardModal
        open={isAddCardModalOpen}
        onClose={() => {
          setIsAddCardModalOpen(false);
          setGeneratedHtml('');
          setConversationHistory({ prompts: '', html: '' });
          setIntervalSettings({ isEnabled: false, interval: 1, prompt: '' });
        }}
        onSave={handleAddBox}
        onHtmlGenerated={(html) => {
          setGeneratedHtml(html);
          setConversationHistory(prev => ({ ...prev, html }));
        }}
        initialConversationHistory={conversationHistory}
        initialIntervalSettings={intervalSettings}
      />
    </div>
  );
}; 