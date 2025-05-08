import { Typography } from '@mui/material';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import { useState } from 'react';
import 'react-resizable/css/styles.css';

interface DraggableResizableBoxProps {
  title: string;
  description: string;
  position: { x: number; y: number };
}

export const DraggableResizableBox = ({ 
  title, 
  description, 
  position
}: DraggableResizableBoxProps) => {
  const [size, setSize] = useState({ width: 300, height: 200 });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOX',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <>
      <ResizableBox
        width={size.width}
        height={size.height}
        onResizeStop={(e, { size: newSize }) => setSize(newSize)}
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