import { Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import { useState, useEffect, useRef } from 'react';
import 'react-resizable/css/styles.css';
import { AddCardModal } from './AddCardModal';
import { useDashboard } from '../context/DashboardContext';
import { CardActionMenu } from './CardActionMenu';

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
  conversationHistory?: {
    prompts: string;
    html: string;
  };
  onUpdate: (html: string, conversationHistory: { prompts: string; html: string }) => void;
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
  conversationHistory,
  onUpdate,
}: DraggableResizableBoxProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const boxRef = useRef<HTMLDivElement>(null);
  const { dashboards, selectedDashboard, cloneBox } = useDashboard();

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

  useEffect(() => {
    if (isEditModalOpen) {
      setPreviewHtml(htmlContent);
    }
  }, [isEditModalOpen, htmlContent]);

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
    boxRef.current = node;
  };

  const handleEditSave = (html: string, newConversationHistory: { prompts: string; html: string }) => {
    onUpdate(html, { ...newConversationHistory, html });
    setIsEditModalOpen(false);
  };

  const handleEditClose = () => {
    setPreviewHtml('');
    setIsEditModalOpen(false);
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
            '&:hover .action-button, & .action-button.visible': {
              opacity: 1,
            },
          }}
        >
          <CardActionMenu
            isEditMode={isEditMode}
            isDeleting={isDeleting}
            isEditModalOpen={isEditModalOpen}
            onDelete={onDelete}
            onEditClick={() => setIsEditModalOpen(true)}
            onDeleteClick={() => setIsDeleting(true)}
            onCancelDelete={() => setIsDeleting(false)}
            onConfirmDelete={() => {
              onDelete();
              setIsDeleting(false);
            }}
            availableDashboards={dashboards.filter(d => d.id !== selectedDashboard?.id)}
            onMoveToDashboard={(targetDashboardId) => {
              if (selectedDashboard) {
                cloneBox(selectedDashboard.id, targetDashboardId, id);
              }
            }}
          />

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

      <AddCardModal
        open={isEditModalOpen}
        onClose={handleEditClose}
        onSave={() => handleEditSave(previewHtml, conversationHistory || { prompts: '', html: '' })}
        onHtmlGenerated={(html) => {
          setPreviewHtml(html);
        }}
        initialConversationHistory={conversationHistory}
      />

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