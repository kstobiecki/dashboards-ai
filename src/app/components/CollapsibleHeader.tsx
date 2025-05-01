'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface CollapsibleHeaderProps {
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export function CollapsibleHeader({ isVisible, onVisibilityChange }: CollapsibleHeaderProps) {
  const [mouseX, setMouseX] = useState(0);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const drawerWidth = 250;
  const menuWidth = 69;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      
      if (isVisible) {
        // When drawer is visible, hide it when cursor moves beyond menu + drawer width
        if (e.clientX > menuWidth + drawerWidth) {
          setIsHoveringLeft(false);
          onVisibilityChange(false);
        }
      } else {
        // When drawer is hidden, show it only when cursor is over the menu
        if (e.clientX < menuWidth) {
          setIsHoveringLeft(true);
          onVisibilityChange(true);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible, onVisibilityChange, drawerWidth, menuWidth]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: `${menuWidth}px`,
        width: drawerWidth,
        height: '100vh',
        backgroundColor: '#1f1f23',
        borderRight: '1px solid #27272a',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        transform: `translateX(${isVisible ? 0 : -drawerWidth}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Typography variant="h6" component="div" sx={{ mb: 3 }}>
        DashboardsAI
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: '#3b82f6',
          '&:hover': {
            backgroundColor: '#2563eb',
          },
        }}
      >
        Add Tile
      </Button>
    </Box>
  );
} 