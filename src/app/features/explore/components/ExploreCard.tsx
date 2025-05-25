'use client';

import { ExploreCard as ExploreCardType } from '../context/ExploreContext';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDashboard } from '../../dashboards/context/DashboardContext';
import { nanoid } from 'nanoid';

interface ExploreCardProps {
  card: ExploreCardType;
}

export const ExploreCard = ({ card }: ExploreCardProps) => {
  const { dashboards, addBox } = useDashboard();
  const [moveMenuAnchor, setMoveMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    console.log('Available dashboards:', dashboards);
  }, [dashboards]);

  const handleMoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMoveMenuAnchor(e.currentTarget);
  };

  const handleMoveMenuClose = () => {
    setMoveMenuAnchor(null);
  };

  const handleMoveToDashboard = (targetDashboardId: string) => {
    // Create a new box with the explore card's content
    const newBox = {
      id: `box-${Date.now()}-${nanoid(10)}`,
      x: 50,  // Initial x position
      y: 50,  // Initial y position
      width: 400,  // Default width
      height: 300,  // Default height
      html: card.conversationHistory.html,
      conversationHistory: card.conversationHistory,
      intervalSettings: card.intervalSettings,
    };

    // Add the box to the target dashboard
    addBox(targetDashboardId, newBox);
    handleMoveMenuClose();
  };

  // Show all dashboards in the menu
  const availableDashboards = dashboards;
  console.log('Available dashboards for menu:', availableDashboards);

  return (
    <Box
      sx={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        '&:hover .action-button': {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        <IconButton
          size="small"
          onClick={handleMoveClick}
          className={`action-button ${moveMenuAnchor ? 'visible' : ''}`}
          disabled={availableDashboards.length === 0}
          sx={{
            color: '#6b7280',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': {
              color: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            '&.Mui-disabled': {
              opacity: 0,
            },
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>

      <iframe
        srcDoc={card.conversationHistory.html}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin"
      />

      <Menu
        anchorEl={moveMenuAnchor}
        open={Boolean(moveMenuAnchor)}
        onClose={handleMoveMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1f2937',
            color: '#e5e7eb',
            width: '150px',
            maxHeight: '127px',
            overflowY: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '& .MuiMenuItem-root': {
              padding: '10px 16px',
              minHeight: 'unset',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            },
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
        }}
      >
        {availableDashboards.map((dashboard) => (
          <MenuItem
            key={dashboard.id}
            onClick={() => handleMoveToDashboard(dashboard.id)}
            sx={{
              color: '#e5e7eb',
              fontSize: '0.875rem',
              maxWidth: '100%',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}
            >
              {dashboard.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}; 