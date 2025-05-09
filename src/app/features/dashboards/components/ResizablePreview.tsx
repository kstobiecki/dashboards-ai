import { Box, IconButton } from '@mui/material';
import { ResizableBox } from 'react-resizable';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useCallback, useRef } from 'react';
import 'react-resizable/css/styles.css';

interface ResizablePreviewProps {
  htmlContent: string;
  onClose: () => void;
}

export function ResizablePreview({ htmlContent, onClose }: ResizablePreviewProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const isResizing = useRef(false);

  const handleResizeStart = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    isResizing.current = true;
  }, []);

  const handleResizeStop = useCallback((e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    e.stopPropagation();
    isResizing.current = false;
    setDimensions(size);
  }, []);

  const handleResize = useCallback((e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    e.stopPropagation();
    if (isResizing.current) {
      setDimensions(size);
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <Box onClick={handleClick}>
        <ResizableBox
          width={dimensions.width}
          height={dimensions.height}
          minConstraints={[400, 300]}
          maxConstraints={[1200, 900]}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
          draggableOpts={{ enableUserSelectHack: false }}
          resizeHandles={['se']}
          style={{
            backgroundColor: '#23232a',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            userSelect: 'none',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#e5e7eb',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            srcDoc={htmlContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none',
            }}
            title="Resizable Preview"
          />
        </ResizableBox>
      </Box>

      <style jsx global>{`
        .react-resizable {
          padding: 0 !important;
          border: 0 !important;
          position: relative !important;
        }

        .react-resizable-handle {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          padding: 0;
          width: 10px;
          height: 10px;
          position: absolute !important;
          bottom: 0 !important;
          right: 0 !important;
          cursor: se-resize !important;
          z-index: 2 !important;
          touch-action: none !important;
        }

        .react-resizable-handle:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .react-resizable-handle-se {
          bottom: 0 !important;
          right: 0 !important;
          cursor: se-resize !important;
        }

        .react-resizable-handle-se:active {
          background-color: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </Box>
  );
} 