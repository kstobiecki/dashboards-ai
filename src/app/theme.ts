import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-inter), Inter, Arial, sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#18181b',
      paper: '#18181b',
    },
    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1f1f23',
          borderRight: '1px solid #27272a',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
}); 