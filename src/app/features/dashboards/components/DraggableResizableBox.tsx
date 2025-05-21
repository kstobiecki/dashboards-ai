import { Typography, IconButton, Box, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import { useState, useEffect, useRef } from 'react';
import 'react-resizable/css/styles.css';

interface DraggableResizableBoxProps {
  id: string;
  htmlContent: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onResize: (size: { width: number; height: number }) => void;
  onDelete: () => void;
  isEditMode: boolean;
  zIndex: number;
  onFocus: () => void;
}

export const DraggableResizableBox = ({ 
  id,
  htmlContent,
  position,
  size,
  onResize,
  onDelete,
  isEditMode,
  zIndex,
  onFocus,
}: DraggableResizableBoxProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOX',
    item: () => {
      onFocus();
      return { id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode && !isDeleting,
  }), [id, isEditMode, isDeleting, onFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDeleting && boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsDeleting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeleting]);

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
    boxRef.current = node;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(false);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setIsDeleting(false);
  };

  return (
    <>
      <ResizableBox
        width={size.width}
        height={size.height}
        onResizeStop={(e, { size: newSize }) => onResize(newSize)}
        minConstraints={[380, 270]}
        maxConstraints={[2000, 2000]}
        resizeHandles={isEditMode ? ['se'] : []}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: '#23232a',
          borderRadius: '8px',
          padding: 0,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: isEditMode && !isDeleting ? 'move' : 'default',
          opacity: isDragging ? 0.5 : 1,
          zIndex: isDragging ? 1000 : zIndex,
          overflow: 'hidden',
        }}
      >
        <Box 
          ref={dragRef} 
          onClick={onFocus}
          sx={{ 
            height: '100%', 
            width: '100%', 
            position: 'relative',
            overflow: 'hidden',
            '&:hover .delete-button': {
              opacity: 1,
            },
          }}
        >
          {isEditMode && !isDeleting && (
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              className="delete-button"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                color: '#6b7280',
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
                '&:hover': {
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
                zIndex: 2,
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
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
                  onClick={handleCancelDelete}
                  sx={{
                    color: '#e5e7eb',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmDelete}
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
          <iframe
            srcDoc={htmlContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              overflow: 'auto',
              pointerEvents: isEditMode ? 'none' : 'auto',
              display: 'block',
            }}
            sandbox="allow-scripts allow-same-origin allow-popups"
            title={`iframe-${id}`}
          />
        </Box>
      </ResizableBox>

      <style jsx global>{`
        .react-resizable {
          padding: 0 !important;
          border: 0 !important;
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
    </>
  );
}; 