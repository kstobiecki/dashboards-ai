import { Typography } from '@mui/material';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface DraggableResizableBoxProps {
  id: string;
  title: string;
  htmlContent: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onResize: (size: { width: number; height: number }) => void;
  isEditMode: boolean;
}

export const DraggableResizableBox = ({ 
  id,
  title, 
  htmlContent,
  position,
  size,
  onResize,
  isEditMode,
}: DraggableResizableBoxProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOX',
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode,
  }), [id, isEditMode]);

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <>
      <ResizableBox
        width={size.width}
        height={size.height}
        onResizeStop={(e, { size: newSize }) => onResize(newSize)}
        minConstraints={[200, 150]}
        maxConstraints={[2000, 2000]}
        resizeHandles={isEditMode ? ['se'] : []}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: '#23232a',
          borderRadius: 4,
          padding: 0,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: isEditMode ? 'move' : 'default',
          opacity: isDragging ? 0.5 : 1,
          zIndex: isDragging ? 1000 : 1,
        }}
      >
        <div ref={dragRef} style={{ height: '100%', width: '100%' }}>
          <iframe
            srcDoc={htmlContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              overflow: 'hidden',
              pointerEvents: isEditMode ? 'none' : 'auto',
            }}
            sandbox="allow-scripts allow-same-origin"
            title={`iframe-${id}`}
          />
        </div>
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