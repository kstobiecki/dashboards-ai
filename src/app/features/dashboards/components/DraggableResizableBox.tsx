import { Box } from '@mui/material';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import { useState, useEffect, useRef } from 'react';
import 'react-resizable/css/styles.css';
import { AddCardModal } from './AddCardModal';
import { useDashboard } from '../context/DashboardContext';
import { CardActionMenu } from './CardActionMenu';
import CircularProgress from '@mui/material/CircularProgress';

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
  onUpdate: (html: string, conversationHistory: { prompts: string; html: string }, intervalSettings?: { isEnabled: boolean; interval: number; prompt: string }) => void;
  intervalSettings?: {
    isEnabled: boolean;
    interval: number;
    prompt: string;
  };
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
  intervalSettings,
}: DraggableResizableBoxProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const boxRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { dashboards, selectedDashboard, cloneBox } = useDashboard();
  const [isIntervalLoading, setIsIntervalLoading] = useState(false);

  const executeIntervalPrompt = async () => {
    if (!intervalSettings?.isEnabled || !intervalSettings?.prompt) return;
    setIsIntervalLoading(true);
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: intervalSettings.prompt,
          conversationHistory,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate card');
      }
      if (data.html) {
        onUpdate(data.html, {
          prompts: conversationHistory?.prompts ? `${conversationHistory.prompts}\n${intervalSettings.prompt}` : intervalSettings.prompt,
          html: data.html,
        }, intervalSettings);
      }
    } catch (error) {
      console.error('Error executing interval prompt:', error);
    } finally {
      setIsIntervalLoading(false);
    }
  };

  useEffect(() => {
    if (intervalSettings?.isEnabled && intervalSettings?.prompt) {
      // Execute immediately when enabled
      executeIntervalPrompt();

      // Set up interval
      intervalRef.current = setInterval(() => {
        executeIntervalPrompt();
      }, intervalSettings.interval * 60 * 1000); // Convert minutes to milliseconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [intervalSettings?.isEnabled, intervalSettings?.interval, intervalSettings?.prompt]);

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

  const handleEditSave = (
    html: string,
    newConversationHistory: { prompts: string; html: string },
    newIntervalSettings: { isEnabled: boolean; interval: number; prompt: string }
  ) => {
    onUpdate(html, { ...newConversationHistory, html }, newIntervalSettings);
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
          {/* Loader overlay when not in edit mode and interval loading */}
          {!isEditMode && isIntervalLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(35, 35, 38, 0.5)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
              }}
            >
              <CircularProgress sx={{ color: '#e5e7eb' }} />
            </Box>
          )}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              pointerEvents: !isEditMode && isIntervalLoading ? 'none' : 'auto',
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
        </Box>
      </ResizableBox>

      <AddCardModal
        open={isEditModalOpen}
        onClose={handleEditClose}
        onSave={(newIntervalSettings) => handleEditSave(previewHtml, conversationHistory || { prompts: '', html: '' }, newIntervalSettings)}
        onHtmlGenerated={(html) => {
          setPreviewHtml(html);
        }}
        initialConversationHistory={conversationHistory}
        initialIntervalSettings={intervalSettings}
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