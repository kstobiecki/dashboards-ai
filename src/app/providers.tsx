'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useMemo } from 'react';

// Create a cache instance
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

export function Providers({ children }: { children: React.ReactNode }) {
  const cache = useMemo(() => createEmotionCache(), []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
} 