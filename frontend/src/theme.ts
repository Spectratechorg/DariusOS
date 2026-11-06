import { createTheme } from '@mui/material/styles';

const ink = {
  base: '#0A0C11',
  surface: '#0F1319',
  raised: '#141922',
  sunken: '#080A0E',
  line: '#1B2029',
  lineStrong: '#252B36',
  text: '#E7EAF0',
  muted: '#9AA3B2',
  faint: '#6C7686',
  accent: '#5B8DEF',
  accentHover: '#7AA3F5',
  success: '#46B98A',
  warning: '#E3A948',
  danger: '#E4695E',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: ink.base, paper: ink.surface },
    primary: { main: ink.accent, light: ink.accentHover, dark: '#3F6FD0', contrastText: '#FFFFFF' },
    secondary: { main: ink.muted },
    success: { main: ink.success, light: '#64C9A1', dark: '#2F8F69' },
    warning: { main: ink.warning, light: '#EFC06A', dark: '#B98428' },
    error: { main: ink.danger, light: '#EE8B82', dark: '#BE4C43' },
    info: { main: ink.accent },
    text: { primary: ink.text, secondary: ink.muted, disabled: ink.faint },
    divider: ink.line,
    action: {
      hover: 'rgba(255,255,255,0.04)',
      selected: 'rgba(255,255,255,0.06)',
      disabledBackground: '#171C24',
      disabled: ink.faint,
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    fontSize: 13.5,
    h3: { fontSize: '1.5rem', fontWeight: 650, lineHeight: 1.25, letterSpacing: '-0.02em' },
    h4: { fontSize: '1.375rem', fontWeight: 650, lineHeight: 1.28, letterSpacing: '-0.02em' },
    h5: { fontSize: '1.0625rem', fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.01em' },
    h6: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.005em' },
    subtitle1: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.45, color: ink.text },
    subtitle2: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: ink.faint,
    },
    body1: { fontSize: '0.84375rem', lineHeight: 1.55, color: '#CDD3DD' },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5, color: '#C3C9D4' },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, color: ink.muted, letterSpacing: 0 },
    button: { fontSize: '0.8125rem', fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', height: '100%' },
        body: {
          backgroundColor: ink.base,
          color: ink.text,
          fontFeatureSettings: '"cv02","cv03","cv04","ss01"',
          height: '100%',
          overflowX: 'hidden',
        },
        '#root': { height: '100%' },
        '::selection': { backgroundColor: 'rgba(91,141,239,0.32)' },
        '*': { boxSizing: 'border-box' },
        '::-webkit-scrollbar': { width: 10, height: 10 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: '#242B36',
          borderRadius: 99,
          border: '3px solid transparent',
          backgroundClip: 'content-box',
        },
        '::-webkit-scrollbar-thumb:hover': { background: '#333C4A', backgroundClip: 'content-box' },
        ':focus-visible': { outline: '2px solid rgba(91,141,239,0.75)', outlineOffset: 2 },
        input: { fontVariantNumeric: 'tabular-nums' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: ink.surface,
          border: `1px solid ${ink.line}`,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: ink.surface,
          border: `1px solid ${ink.line}`,
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          minHeight: 44,
          '@media (min-width:900px)': { minHeight: 34 },
          padding: '6px 13px',
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
          letterSpacing: 0,
          transition: 'background-color 140ms ease, border-color 140ms ease, color 140ms ease',
        },
        containedPrimary: {
          backgroundColor: '#3E68BE',
          '&:hover': { backgroundColor: '#4A7AD1' },
          '&:active': { backgroundColor: '#345AA6' },
          '&.Mui-disabled': { backgroundColor: '#20262F', color: ink.faint },
        },
        outlined: {
          borderColor: ink.lineStrong,
          color: ink.text,
          '&:hover': { borderColor: '#3A4453', backgroundColor: 'rgba(255,255,255,0.035)' },
        },
        text: { color: ink.muted, '&:hover': { color: ink.text, backgroundColor: 'rgba(255,255,255,0.04)' } },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 8, color: ink.muted, '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: ink.text } } },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.71875rem',
          height: 22,
          backgroundColor: '#171C25',
          color: ink.muted,
          border: `1px solid ${ink.line}`,
        },
        label: { paddingLeft: 8, paddingRight: 8 },
        sizeSmall: { height: 22 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${ink.line}`,
          padding: '8px 9px',
          fontSize: '0.8125rem',
          color: '#C3C9D4',
          fontVariantNumeric: 'tabular-nums',
        },
        head: {
          fontSize: '0.65625rem',
          fontWeight: 600,
          letterSpacing: '0.045em',
          textTransform: 'uppercase',
          color: ink.faint,
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${ink.line}`,
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: { root: { '&:last-child td': { borderBottom: 0 } } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: ink.sunken,
          borderRadius: 8,
          fontSize: '0.8125rem',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: ink.lineStrong },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3A4453' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ink.accent,
            borderWidth: 1,
            boxShadow: '0 0 0 3px rgba(91,141,239,0.16)',
          },
        },
        input: { padding: '8px 11px' },
      },
    },
    MuiSelect: { styleOverrides: { select: { paddingTop: 8, paddingBottom: 8 } } },
    MuiInputLabel: { styleOverrides: { root: { fontSize: '0.8125rem', color: ink.muted } } },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 8 },
        track: { backgroundColor: '#2A313C', opacity: 1, borderRadius: 99 },
        thumb: { backgroundColor: '#B7C0CE', boxShadow: 'none' },
        switchBase: {
          '&.Mui-checked': {
            '& + .MuiSwitch-track': { backgroundColor: 'rgba(91,141,239,0.45)', opacity: 1 },
            '& .MuiSwitch-thumb': { backgroundColor: ink.accent },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 99, backgroundColor: '#1B212B' },
        bar: { borderRadius: 99, backgroundColor: ink.accent },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: '#10141B', border: `1px solid ${ink.line}`, borderRadius: 14 },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontSize: '1rem', fontWeight: 600 } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1B212B',
          color: ink.text,
          fontSize: '0.75rem',
          borderRadius: 7,
          border: `1px solid ${ink.lineStrong}`,
          padding: '6px 9px',
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: ink.line } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiSnackbarContent: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.8125rem' },
      },
    },
    MuiTabs: { styleOverrides: { indicator: { height: 2, borderRadius: 2 } } },
  },
});

export const tokens = ink;
