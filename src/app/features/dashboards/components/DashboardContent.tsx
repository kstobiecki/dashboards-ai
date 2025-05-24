import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import { useState, useEffect, useRef } from 'react';
import { CreateDashboardModal } from './CreateDashboardModal';
import { DraggableResizableBox } from './DraggableResizableBox';
import { useDrop } from 'react-dnd';
import { AddCardModal } from './AddCardModal';
import { CustomDragLayer } from './CustomDragLayer';
import { DashboardActionMenu } from './DashboardActionMenu';

export const DashboardContent = () => {
  const { 
    dashboards, 
    selectedDashboard, 
    setSelectedDashboard, 
    createDashboard,
    addBox,
    updateBox,
    deleteBox,
    setZoomForDashboard,
    getZoomForDashboard,
  } = useDashboard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});
  const [nextZIndex, setNextZIndex] = useState(1);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<{ prompts: string; html: string }>({ prompts: '', html: '' });
  const [intervalSettings, setIntervalSettings] = useState({ isEnabled: false, interval: 1, prompt: '' });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        x: box.x + delta.x / zoom,
        y: box.y + delta.y / zoom,
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

  // Helper to map zoom to display percent: 0.5 = 10%, 1.0 = 100%
  const zoomToDisplay = (zoom: number) => Math.round(((zoom - 0.5) / 0.5) * 90 + 10);
  const displayToZoom = (display: number) => ((display - 10) / 90) * 0.5 + 0.5;
  const minDisplay = 10;
  const maxDisplay = 100;
  const displayStep = 10;

  const zoom = selectedDashboard ? getZoomForDashboard(selectedDashboard.id) : 1;
  const handleSetZoom = (newZoom: number) => {
    if (selectedDashboard) setZoomForDashboard(selectedDashboard.id, newZoom);
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
    <>
      <CustomDragLayer zoom={zoom} boxes={selectedDashboard ? selectedDashboard.boxes : []} />
      <div ref={scrollContainerRef} tabIndex={0} style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'auto', outline: 'none' }}>
        {/* Buttons always visible at top-right of viewport */}
        {!isEmptyDashboard && (
          <DashboardActionMenu
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            zoom={zoom}
            setZoom={handleSetZoom}
            minDisplay={minDisplay}
            maxDisplay={maxDisplay}
            displayStep={displayStep}
            zoomToDisplay={zoomToDisplay}
            displayToZoom={displayToZoom}
            onAddCardClick={() => setIsAddCardModalOpen(true)}
            canAddCard={selectedDashboard.boxes.length < 20}
          />
        )}
        <div 
          ref={dropRef} 
          data-drop-container
          style={{ 
            minHeight: '300vh', 
            minWidth: '300vw',
            position: 'relative', 
            backgroundColor: '#18181b', 
            padding: 24,
            width: '100%',
            height: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {!isEmptyDashboard && selectedDashboard.boxes.map((box) => (
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
          ))}

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
        {isEmptyDashboard && !isAddCardModalOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: 'calc(50% + 35px)',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              zIndex: 3000,
              background: 'none',
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
        )}
      </div>
    </>
  );
}; 