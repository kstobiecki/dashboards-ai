import { Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useState } from 'react';

interface Dashboard {
  id: string;
  title: string;
}

interface CardActionMenuProps {
  isEditMode: boolean;
  isDeleting: boolean;
  isEditModalOpen: boolean;
  onDelete: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  availableDashboards: Dashboard[];
  onMoveToDashboard: (targetDashboardId: string) => void;
}

export const CardActionMenu = ({
  isEditMode,
  isDeleting,
  isEditModalOpen,
  onEditClick,
  onDeleteClick,
  onCancelDelete,
  onConfirmDelete,
  availableDashboards,
  onMoveToDashboard,
}: CardActionMenuProps) => {
  const [moveMenuAnchor, setMoveMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMoveMenuAnchor(e.currentTarget);
  };

  const handleMoveMenuClose = () => {
    setMoveMenuAnchor(null);
  };

  const handleMoveToDashboard = (targetDashboardId: string) => {
    onMoveToDashboard(targetDashboardId);
    handleMoveMenuClose();
  };

  return (
    <>
      {isEditMode && !isDeleting && (
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
            onClick={onEditClick}
            className={`action-button ${isEditModalOpen || moveMenuAnchor ? 'visible' : ''}`}
            sx={{
              color: '#6b7280',
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                color: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
            }}
          >
            <EditIcon sx={{ fontSize: 28 }} />
          </IconButton>
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
          <IconButton
            size="small"
            onClick={onDeleteClick}
            className={`action-button ${isDeleting || moveMenuAnchor ? 'visible' : ''}`}
            sx={{
              color: '#6b7280',
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      )}

      {isDeleting && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            zIndex: 3,
            opacity: 0,
            animation: 'fadeIn 0.2s ease-in-out forwards',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
              },
              '100%': {
                opacity: 1,
              },
            },
          }}
        >
          <Typography sx={{ color: '#e5e7eb', mb: 1 }}>
            Delete this card?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancelDelete}
              sx={{
                color: '#e5e7eb',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onConfirmDelete}
              sx={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}

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
    </>
  );
}; 