import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontSize: '3rem', 
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: { 
      fontSize: '2.5rem', 
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: { 
      fontSize: '2rem', 
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: { 
      fontSize: '1.75rem', 
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: { 
      fontSize: '1.5rem', 
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: { 
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
