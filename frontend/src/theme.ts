import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B0F19', // Main app background
      paper: '#111827',   // Panels & cards
    },
    primary: {
      main: '#2563EB',   // Action blue
      light: '#3B82F6',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#64748B',
    },
    success: {
      main: '#10B981',   // Approved / Pass green
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',   // Warnings / Review required amber
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',   // Flagged / Risk red
      light: '#F87171',
      dark: '#DC2626',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: '#1E293B',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#F8FAFC',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.05rem',
      color: '#F8FAFC',
    },
    subtitle1: {
      fontSize: '0.875rem',
      color: '#94A3B8',
    },
    subtitle2: {
      fontSize: '0.75rem',
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
      color: '#CBD5E1',
    },
    body2: {
      fontSize: '0.8125rem',
      color: '#94A3B8',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          border: '1px solid #1E293B',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131B2E',
          border: '1px solid #1E293B',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          fontSize: '0.8125rem',
          padding: '6px 14px',
        },
        containedPrimary: {
          backgroundColor: '#2563EB',
          '&:hover': {
            backgroundColor: '#1D4ED8',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
      },
    },
  },
});
