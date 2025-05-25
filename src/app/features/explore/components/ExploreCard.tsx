'use client';

import { ExploreCard as ExploreCardType } from '../context/ExploreContext';
import { Box } from '@mui/material';

interface ExploreCardProps {
  card: ExploreCardType;
}

export const ExploreCard = ({ card }: ExploreCardProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '300px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <iframe
        srcDoc={card.conversationHistory.html}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </Box>
  );
}; 