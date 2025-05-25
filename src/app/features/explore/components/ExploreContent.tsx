'use client';

import { Box } from '@mui/material';
import { useExplore } from '../context/ExploreContext';
import { ExploreCard } from './ExploreCard';

export const ExploreContent = () => {
  const { cards } = useExplore();

  // Split cards into two rows
  const firstRow = cards.slice(0, 3);
  const secondRow = cards.slice(3, 6);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
        }}
      >
        {/* First row */}
        <Box
          sx={{
            display: 'flex',
            gap: '24px',
          }}
        >
          {firstRow.map((card) => (
            <Box
              key={card.id}
              sx={{
                flex: 1,
              }}
            >
              <ExploreCard card={card} />
            </Box>
          ))}
        </Box>

        {/* Second row */}
        <Box
          sx={{
            display: 'flex',
            gap: '24px',
          }}
        >
          {secondRow.map((card) => (
            <Box
              key={card.id}
              sx={{
                flex: 1,
              }}
            >
              <ExploreCard card={card} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 