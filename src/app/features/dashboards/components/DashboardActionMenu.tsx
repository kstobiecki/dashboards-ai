import { Box, IconButton, Button } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from '@mui/icons-material';
import React from 'react';

interface DashboardActionMenuProps {
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  minDisplay: number;
  maxDisplay: number;
  displayStep: number;
  zoomToDisplay: (zoom: number) => number;
  displayToZoom: (display: number) => number;
  onAddCardClick: () => void;
  canAddCard: boolean;
}

export const DashboardActionMenu: React.FC<DashboardActionMenuProps> = ({
  isEditMode,
  setIsEditMode,
  zoom,
  setZoom,
  minDisplay,
  maxDisplay,
  displayStep,
  zoomToDisplay,
  displayToZoom,
  onAddCardClick,
  canAddCard,
}) => {
  return (
    <Box 
      sx={{ 
        position: 'fixed',
        top: 24,
        right: 24,
        display: 'flex',
        gap: 2,
        zIndex: 100,
      }}
    >
      <IconButton
        onClick={() => setIsEditMode(!isEditMode)}
        sx={{
          backgroundColor: '#23232a',
          color: '#e5e7eb',
          transition: 'opacity 0.3s ease-in-out',
          opacity: 1
        }}
      >
        {isEditMode ? <CheckIcon /> : <EditIcon />}
      </IconButton>
      {/* Zoom Out Button */}
      <IconButton
        onClick={() => {
          const currentDisplay = zoomToDisplay(zoom);
          const newDisplay = Math.max(minDisplay, currentDisplay - displayStep);
          setZoom(displayToZoom(newDisplay));
        }}
        sx={{ backgroundColor: '#23232a', color: '#e5e7eb', '&:hover': { backgroundColor: '#2d2d35' } }}
        aria-label="Zoom out"
      >
        <ZoomOutIcon />
      </IconButton>
      {/* Zoom Level Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', color: '#e5e7eb', px: 1, fontWeight: 500, fontSize: 16, minWidth: 48, justifyContent: 'center' }}>
        {zoomToDisplay(zoom)}%
      </Box>
      {/* Zoom In Button */}
      <IconButton
        onClick={() => {
          const currentDisplay = zoomToDisplay(zoom);
          const newDisplay = Math.min(maxDisplay, currentDisplay + displayStep);
          setZoom(displayToZoom(newDisplay));
        }}
        sx={{ backgroundColor: '#23232a', color: '#e5e7eb', '&:hover': { backgroundColor: '#2d2d35' } }}
        aria-label="Zoom in"
      >
        <ZoomInIcon />
      </IconButton>
      {isEditMode && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddCardClick}
          disabled={!canAddCard}
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
  );
}; 