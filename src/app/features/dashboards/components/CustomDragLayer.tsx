import React from 'react';
import { useDragLayer } from 'react-dnd';
import { Box } from '@mui/material';
import { Box as DashboardBox } from '../context/DashboardContext';

interface CustomDragLayerProps {
  zoom: number;
  boxes: DashboardBox[];
}

interface DragOffset {
  x: number;
  y: number;
}

function getItemStyles(
  initialOffset: DragOffset | null,
  currentOffset: DragOffset | null,
  initialSourceClientOffset: DragOffset | null,
  zoom: number
): React.CSSProperties {
  if (!initialOffset || !currentOffset || !initialSourceClientOffset) {
    return { display: 'none' };
  }
  // Calculate the offset between pointer and top-left of the box
  const offsetX = initialOffset.x - initialSourceClientOffset.x;
  const offsetY = initialOffset.y - initialSourceClientOffset.y;
  // Position the preview so the pointer stays at the same relative spot
  const x = currentOffset.x - offsetX / zoom;
  const y = currentOffset.y - offsetY / zoom;
  return {
    position: 'fixed',
    pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    left: 0,
    top: 0,
    transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    WebkitTransform: `translate(${x}px, ${y}px) scale(${zoom})`,
    zIndex: 3000,
  };
}

export const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ zoom, boxes }) => {
  const {
    isDragging,
    item,
    initialOffset,
    currentOffset,
    initialSourceClientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialClientOffset(),
    currentOffset: monitor.getClientOffset(),
    initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !item) {
    return null;
  }

  // Find the box being dragged
  const box = boxes.find((b) => b.id === item.id);
  if (!box) return null;

  return (
    <div style={getItemStyles(initialOffset, currentOffset, initialSourceClientOffset, zoom)}>
      <Box
        sx={{
          width: box.width,
          height: box.height,
          backgroundColor: '#23232a',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: 0.7,
          overflow: 'hidden',
          boxShadow: 6,
          pointerEvents: 'none',
        }}
      >
        <iframe
          srcDoc={box.html}
          style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
          title={`drag-preview-${box.id}`}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </Box>
    </div>
  );
}; 