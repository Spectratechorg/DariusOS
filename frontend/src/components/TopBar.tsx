import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useProject } from '../context/ProjectContext';

export const TopBar: React.FC<{ onOpenNav: () => void }> = ({ onOpenNav }) => {
  const {
    activeStage,
    setActiveStage,
    setSnackbarMessage,
    backendHealth,
    backendHealthError,
    isBackendChecking,
    projectData,
  } = useProject();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const getBreadcrumbs = () => {
    const projectSub = `${(projectData.projectName || 'ROAD DESIGN CORRIDOR').toUpperCase()} · ${(projectData.client || 'CIVIL WORKS').toUpperCase()}`;
    switch (activeStage) {
      case 'overview':
        return { subtitle: projectSub, title: 'Project overview' };
      case 'setup':
        return { subtitle: 'STAGE 1 · PROJECT SETUP', title: 'Corridor specifications' };
      case 'survey':
        return { subtitle: 'STAGE 2 · SURVEY INTAKE AND VALIDATION', title: 'Survey coordinates & validation' };
      case 'terrain':
        return { subtitle: 'STAGE 3 · TERRAIN ENGINE', title: 'Existing terrain surface' };
      case 'design':
        return { subtitle: 'STAGE 4 · ENGINEERING ENGINE AND VALIDATION', title: 'Geometric design engine' };
      case 'drawings':
        return { subtitle: 'STAGE 5 · CAD ENGINE', title: 'Engineering CAD drawings' };
      case 'beme':
        return { subtitle: 'STAGE 6 · QUANTITY ENGINE, BEME ENGINE AND REPORT', title: 'Quantities and BEME schedule' };
      default:
        return { subtitle: projectSub, title: 'Project overview' };
    }
  };

  const { subtitle, title } = getBreadcrumbs();

  const getPrimaryAction = (): { label: string; onClick: () => void; disabled?: boolean } => {
    switch (activeStage) {
      case 'overview':
        return { label: 'New project setup', onClick: () => setActiveStage('setup') };
      case 'setup':
        return { label: 'Proceed to survey intake', onClick: () => setActiveStage('survey') };
      case 'survey':
        return { label: 'Build terrain model', onClick: () => setActiveStage('terrain') };
      case 'terrain':
        return { label: 'Continue to design engine', onClick: () => setActiveStage('design') };
      case 'design':
        return { label: 'Continue to CAD drawings', onClick: () => setActiveStage('drawings') };
      case 'drawings':
        return { label: 'Generate BEME and report', onClick: () => setActiveStage('beme') };
      case 'beme':
        return {
          label: 'Sign & release package',
          onClick: () => setSnackbarMessage('Release package generated. COREN digital signature required.'),
        };
      default:
        return { label: 'Action', onClick: () => {} };
    }
  };

  const getSecondaryAction = () => {
    switch (activeStage) {
      case 'overview':
        return { label: 'Export report', onClick: () => setActiveStage('beme') };
      case 'setup':
        return { label: 'Save draft', onClick: () => setSnackbarMessage('Project setup specifications saved.') };
      case 'survey':
        return { label: 'Upload another file', onClick: () => setSnackbarMessage('Survey intake dropzone active.') };
      case 'terrain':
        return { label: 'Export contours', onClick: () => setSnackbarMessage('Contour shapefile and DXF contours exported.') };
      case 'design':
        return { label: 'Regenerate design', onClick: () => setSnackbarMessage('Pipeline regeneration executed. Unaffected stages served from cache.') };
      case 'drawings':
        return { label: 'Download PDF set', onClick: () => setSnackbarMessage('Complete CAD Drawing Set downloaded (PL-01, LP-01, XS-01).') };
      case 'beme':
        return { label: 'Export Excel', onClick: () => setSnackbarMessage('BEME Excel workbook with active formulas downloaded.') };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();
  const secondaryAction = getSecondaryAction();

  const isNeonConnected = Boolean(backendHealth?.neon?.connected || backendHealth?.database?.is_neon);

  const closeMenu = () => setMenuAnchor(null);

  return (
    <Box
      sx={{
        flexShrink: 0,
        minHeight: { xs: 60, md: 64 },
        px: { xs: 2, md: 3 },
        backgroundColor: '#0B0F19',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, md: 2 },
      }}
    >
      <IconButton
        aria-label="Open navigation"
        onClick={onOpenNav}
        sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: -0.75, width: 44, height: 44 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Title & Breadcrumbs */}
      <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#64748B',
            fontWeight: 600,
            letterSpacing: '0.04em',
            fontSize: '0.68rem',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1rem', md: '1.15rem' },
            color: '#F8FAFC',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Right Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, md: 1.5 }, flexShrink: 0 }}>
        {isNeonConnected && (
          <Chip
            size="small"
            label="Neon DB"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              color: '#38BDF8',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid #0284C7',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
        )}

        <Chip
          size="small"
          label={
            isBackendChecking
              ? 'Connecting API'
              : backendHealthError
                ? 'API offline'
                : `API ${backendHealth?.status ?? 'ready'}`
          }
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            color: backendHealthError ? '#FBBF24' : '#34D399',
            backgroundColor: backendHealthError ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${backendHealthError ? '#92400E' : '#065F46'}`,
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        />

        {/* Search */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            backgroundColor: '#131B2E',
            border: '1px solid #1E293B',
            borderRadius: 1.5,
            px: 1.5,
            py: 0.3,
            width: 200,
          }}
        >
          <SearchIcon sx={{ color: '#64748B', fontSize: '1.1rem', mr: 1 }} />
          <InputBase
            placeholder="Search drawings, BEME, surveys"
            sx={{
              color: '#F8FAFC',
              fontSize: '0.78rem',
              width: '100%',
              '& input::placeholder': { color: '#64748B', opacity: 1 },
            }}
          />
        </Box>

        {/* Secondary (desktop) */}
        {secondaryAction && (
          <Button
            variant="outlined"
            size="small"
            onClick={secondaryAction.onClick}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderColor: '#334155',
              color: '#F8FAFC',
              fontSize: '0.78rem',
              '&:hover': { borderColor: '#475569', backgroundColor: '#1E293B' },
            }}
          >
            {secondaryAction.label}
          </Button>
        )}

        {/* Primary (desktop) */}
        <Button
          variant="contained"
          size="small"
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            backgroundColor: primaryAction.disabled ? '#334155' : '#2563EB',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            '&:hover': {
              backgroundColor: primaryAction.disabled ? '#334155' : '#1D4ED8',
            },
          }}
        >
          {primaryAction.label}
        </Button>

        {/* Compact menu (mobile) */}
        <IconButton
          aria-label="More actions"
          onClick={e => setMenuAnchor(e.currentTarget)}
          sx={{ display: { xs: 'inline-flex', sm: 'none' }, width: 44, height: 44, border: '1px solid #1E293B' }}
        >
          <MoreHorizIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 210, mt: 0.75 } } }}
        >
          <MenuItem
            disabled={primaryAction.disabled}
            onClick={() => {
              primaryAction.onClick();
              closeMenu();
            }}
          >
            <ListItemText>{primaryAction.label}</ListItemText>
          </MenuItem>
          {secondaryAction && <Divider />}
          {secondaryAction && (
            <MenuItem
              onClick={() => {
                secondaryAction.onClick();
                closeMenu();
              }}
            >
              <ListItemText>{secondaryAction.label}</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
};
