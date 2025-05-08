import { Typography } from '@mui/material';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface DraggableResizableBoxProps {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onResize: (size: { width: number; height: number }) => void;
}

export const DraggableResizableBox = ({ 
  id,
  title, 
  description, 
  position,
  size,
  onResize,
}: DraggableResizableBoxProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOX',
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id]);

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
        maxConstraints={[800, 600]}
        resizeHandles={['se']}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 4,
          padding: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'move',
          opacity: isDragging ? 0.5 : 1,
          zIndex: isDragging ? 1000 : 1,
        }}
      >
        <div ref={dragRef} style={{ height: '100%', width: '100%' }}>
          <Typography variant="h4" sx={{ color: '#e5e7eb', mb: 2 }}>
            {title}
          </Typography>
          <Typography sx={{ color: '#6b7280' }}>
            {description}
          </Typography>
        </div>
      </ResizableBox>

      <style jsx global>{`
        .react-resizable {
          padding: 0 !important;
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