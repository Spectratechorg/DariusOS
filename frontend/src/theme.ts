import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B0F19', // Main CAD app background
      paper: '#111827',   // Panels & cards
    },
    primary: {
      main: '#2563EB',   // Action blue
      light: '#38BDF8',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#64748B',
    },
    success: {
      main: '#16A34A',   // Approved / Pass green (civil standard)
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',   // Warnings / Review required amber
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#DC2626',   // Flagged / Risk red (civil standard)
      light: '#EF4444',
      dark: '#991B1B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: '#1E293B',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: {
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', 'IBM Plex Mono', monospace",
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em',
    },
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
      fontSize: '0.72rem',
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontWeight: 700,
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
          backgroundColor: '#101626',
          border: '1px solid #1E293B',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F1626',
          border: '1px solid #1E293B',
          borderRadius: 8,
          transition: 'border-color 160ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 160ms cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
          fontSize: '0.8125rem',
          padding: '6px 14px',
          transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
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
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
        },
      },
    },
  },
});
