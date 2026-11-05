import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import { useProject } from '../context/ProjectContext';
import { tokens } from '../theme';

export const TopBar: React.FC = () => {
  const {
    activeStage,
    setActiveStage,
    isSampleData,
    setIsSampleData,
    setSnackbarMessage,
    backendHealth,
    backendHealthError,
    isBackendChecking,
  } = useProject();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const getHeader = () => {
    switch (activeStage) {
      case 'overview':
        return { meta: 'Pilot road project', title: 'Project overview' };
      case 'setup':
        return { meta: 'Stage 1 of 7', title: 'Create a project' };
      case 'survey':
        return { meta: 'Stage 2 of 7', title: 'Survey data' };
      case 'terrain':
        return { meta: 'Stage 3 of 7', title: 'Existing terrain' };
      case 'reasoning':
        return { meta: 'Stage 4 of 7', title: 'AI reasoning' };
      case 'design':
        return { meta: 'Stage 5 of 7', title: 'Design engine', tag: 'Rev C' };
      case 'drawings':
        return { meta: 'Stage 6 of 7', title: 'Engineering drawings', tag: 'Rev C' };
      case 'beme':
        return { meta: 'Stage 7 of 7', title: 'Quantities and BEME', tag: 'Draft' };
      case 'monitoring':
        return { meta: 'Full system', title: 'Routes and monitoring' };
      default:
        return { meta: 'Pilot road project', title: 'Project overview' };
    }
  };

  const { meta, title, tag } = getHeader();

  const getPrimaryAction = () => {
    switch (activeStage) {
      case 'overview':
        return { label: 'New project', onClick: () => setActiveStage('setup') };
      case 'setup':
        return { label: 'Continue to survey', onClick: () => setActiveStage('survey') };
      case 'survey':
        return { label: 'Build terrain model', onClick: () => setActiveStage('terrain') };
      case 'terrain':
        return { label: 'Continue to reasoning', onClick: () => setActiveStage('reasoning') };
      case 'reasoning':
        return { label: 'Continue to design', onClick: () => setActiveStage('design') };
      case 'design':
        return {
          label: 'Continue to drawings',
          disabled: true,
          hint: '1 review item must be cleared before drawings can be released.',
          onClick: () => setActiveStage('drawings'),
        };
      case 'drawings':
        return { label: 'Continue to BEME', onClick: () => setActiveStage('beme') };
      case 'beme':
        return {
          label: 'Approve BEME',
          onClick: () =>
            setSnackbarMessage('BEME Rev C approved and signed off by the registered engineer.'),
        };
      case 'monitoring':
        return {
          label: 'Export report',
          onClick: () =>
            setSnackbarMessage('Deviation report generated for flight re-survey comparison.'),
        };
      default:
        return { label: 'New project', onClick: () => setActiveStage('setup') };
    }
  };

  const getSecondaryAction = () => {
    switch (activeStage) {
      case 'overview':
        return { label: 'Export report', onClick: () => setActiveStage('beme') };
      case 'setup':
        return { label: 'Save draft', onClick: () => setSnackbarMessage('Project setup draft saved.') };
      case 'survey':
        return { label: 'Upload file', onClick: () => setSnackbarMessage('Drop CSV, XYZ or LAS files to upload.') };
      case 'terrain':
        return { label: 'Export contours', onClick: () => setSnackbarMessage('Contour shapefile and DXF exported.') };
      case 'reasoning':
        return { label: 'Reopen', onClick: () => setSnackbarMessage('Parameter set v2 opened for engineer adjustments.') };
      case 'design':
        return { label: 'Regenerate', onClick: () => setSnackbarMessage('Pipeline regenerated. Unaffected stages served from cache.') };
      case 'drawings':
        return { label: 'Download PDF', onClick: () => setSnackbarMessage('Drawing set downloaded (PL-01, LP-01, XS-01).') };
      case 'beme':
        return { label: 'Export Excel', onClick: () => setSnackbarMessage('BEME workbook with active formulas downloaded.') };
      case 'monitoring':
        return { label: 'Upload flight', onClick: () => setSnackbarMessage('Drone telemetry upload accepted.') };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();
  const secondaryAction = getSecondaryAction();

  const apiState = isBackendChecking
    ? { label: 'Connecting', color: tokens.warning }
    : backendHealthError
      ? { label: 'API offline', color: tokens.warning }
      : { label: `API ${backendHealth?.status ?? 'ready'}`, color: tokens.success };

  return (
    <Box
      sx={{
        flexShrink: 0,
        minHeight: 68,
        px: 3,
        backgroundColor: tokens.base,
        borderBottom: `1px solid ${tokens.line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle2"
          noWrap
          sx={{ color: tokens.faint, mb: 0.35, display: 'block' }}
        >
          {meta}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography
            noWrap
            sx={{
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: tokens.text,
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              minWidth: 0,
            }}
          >
            {title}
          </Typography>
          {tag && (
            <Box
              sx={{
                flexShrink: 0,
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: tokens.muted,
                border: `1px solid ${tokens.lineStrong}`,
                borderRadius: '5px',
                px: 0.75,
                py: '1px',
                lineHeight: 1.5,
              }}
            >
              {tag}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <Tooltip title={backendHealthError ? 'Backend health check failed' : 'Backend health status'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pr: 0.5 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: apiState.color,
                boxShadow: `0 0 0 3px ${apiState.color}22`,
              }}
            />
            <Typography sx={{ fontSize: '0.71875rem', color: tokens.faint, whiteSpace: 'nowrap' }}>
              {apiState.label}
            </Typography>
          </Box>
        </Tooltip>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.line}`,
            borderRadius: 2,
            height: 34,
            px: 1.25,
            width: { md: 170, lg: 200 },
            transition: 'border-color 140ms ease, box-shadow 140ms ease',
            '&:focus-within': {
              borderColor: '#3A4453',
              boxShadow: '0 0 0 3px rgba(255,255,255,0.04)',
            },
          }}
        >
          <SearchIcon sx={{ color: tokens.faint, fontSize: '1rem', mr: 1 }} />
          <InputBase
            placeholder="Search drawings, BEME"
            sx={{
              color: tokens.text,
              fontSize: '0.8125rem',
              width: '100%',
              '& input::placeholder': { color: tokens.faint, opacity: 1 },
            }}
          />
        </Box>

        <Tooltip title="More actions">
          <IconButton
            size="small"
            aria-label="More actions"
            onClick={e => setMenuAnchor(e.currentTarget)}
            sx={{ width: 34, height: 34, border: `1px solid ${tokens.line}` }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 190, mt: 0.75 } } }}
        >
          {secondaryAction && (
            <MenuItem
              onClick={() => {
                secondaryAction.onClick();
                setMenuAnchor(null);
              }}
            >
              <ListItemText>{secondaryAction.label}</ListItemText>
            </MenuItem>
          )}
          {secondaryAction && <Divider />}
          <MenuItem
            onClick={() => {
              setIsSampleData(!isSampleData);
              setSnackbarMessage(isSampleData ? 'Switched to a clean project.' : 'Sample project loaded.');
              setMenuAnchor(null);
            }}
          >
            <Box sx={{ width: 18, display: 'flex', alignItems: 'center' }}>
              {isSampleData && <CheckIcon sx={{ fontSize: 15, color: tokens.accent }} />}
            </Box>
            <ListItemText>Sample data</ListItemText>
          </MenuItem>
        </Menu>

        <Tooltip title={!primaryAction.disabled ? '' : (primaryAction as { hint?: string }).hint ?? ''}>
          <span>
            <Button
              variant="contained"
              size="small"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
