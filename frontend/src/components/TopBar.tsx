import React from 'react';
import { Box, Typography, Button, InputBase, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';

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

  const getBreadcrumbs = () => {
    switch (activeStage) {
      case 'overview':
        return { subtitle: 'PILOT ROAD PROJECT · MASTODON ENGINEERING SERVICES', title: 'Project overview' };
      case 'setup':
        return { subtitle: 'STAGE 1 · PROJECT SETUP', title: 'Create a project' };
      case 'survey':
        return { subtitle: 'STAGE 2 · SURVEY INTAKE AND VALIDATION', title: 'Survey data' };
      case 'terrain':
        return { subtitle: 'STAGE 3 · TERRAIN ENGINE', title: 'Existing terrain' };
      case 'reasoning':
        return { subtitle: 'STAGE 4 · INTELLIGENCE ENGINE', title: 'AI reasoning and engineer review' };
      case 'design':
        return { subtitle: 'STAGE 5 · ENGINEERING ENGINE AND VALIDATION · REVISION C', title: 'Design engine' };
      case 'drawings':
        return { subtitle: 'STAGE 6 · CAD ENGINE · REVISION C', title: 'Engineering drawings' };
      case 'beme':
        return { subtitle: 'STAGE 7 · QUANTITY ENGINE, BEME ENGINE AND REPORT', title: 'Quantities and BEME' };
      case 'monitoring':
        return { subtitle: 'FULL SYSTEM · DRONE-ENABLED INTELLIGENCE PACKAGE', title: 'Routes and construction monitoring' };
      default:
        return { subtitle: 'PILOT ROAD PROJECT', title: 'Project overview' };
    }
  };

  const { subtitle, title } = getBreadcrumbs();

  const getPrimaryAction = () => {
    switch (activeStage) {
      case 'overview':
        return { label: 'New project', onClick: () => setActiveStage('setup') };
      case 'setup':
        return { label: 'Continue to survey upload', onClick: () => setActiveStage('survey') };
      case 'survey':
        return { label: 'Build terrain model', onClick: () => setActiveStage('terrain') };
      case 'terrain':
        return { label: 'Continue to AI reasoning', onClick: () => setActiveStage('reasoning') };
      case 'reasoning':
        return { label: 'Continue to design engine', onClick: () => setActiveStage('design') };
      case 'design':
        return { 
          label: 'Approval blocked by 1 item', 
          disabled: true,
          onClick: () => setActiveStage('drawings') 
        };
      case 'drawings':
        return { label: 'Continue to BEME', onClick: () => setActiveStage('beme') };
      case 'beme':
        return { 
          label: 'Approve BEME Rev C', 
          onClick: () => setSnackbarMessage('BEME Rev C officially approved and signed off by Registered Engineer.') 
        };
      case 'monitoring':
        return { 
          label: 'Export deviation report', 
          onClick: () => setSnackbarMessage('Deviation report generated for flight re-survey comparison.') 
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
        return { label: 'Save draft', onClick: () => setSnackbarMessage('Project setup draft saved successfully.') };
      case 'survey':
        return { label: 'Upload another file', onClick: () => setSnackbarMessage('Survey intake modal open: drop CSV, XYZ, LAS files.') };
      case 'terrain':
        return { label: 'Export contours', onClick: () => setSnackbarMessage('Contour shapefile and DXF contours exported.') };
      case 'reasoning':
        return { label: 'Reopen for changes', onClick: () => setSnackbarMessage('Parameter set v2 opened for engineer adjustments.') };
      case 'design':
        return { label: 'Regenerate design', onClick: () => setSnackbarMessage('Pipeline regeneration executed. Unaffected stages served from cache.') };
      case 'drawings':
        return { label: 'Download PDF set', onClick: () => setSnackbarMessage('Complete CAD Drawing Set downloaded (PL-01, LP-01, XS-01).') };
      case 'beme':
        return { label: 'Export Excel', onClick: () => setSnackbarMessage('BEME Excel workbook with active formulas downloaded.') };
      case 'monitoring':
        return { label: 'Upload flight data', onClick: () => setSnackbarMessage('Drone telemetry upload accepted.') };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();
  const secondaryAction = getSecondaryAction();

  return (
    <Box
      sx={{
        height: 64,
        px: 3,
        backgroundColor: '#0B0F19',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Title & Breadcrumbs */}
      <Box>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.04em', fontSize: '0.68rem', display: 'block' }}>
          {subtitle}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.15rem', color: '#F8FAFC', lineHeight: 1.2 }}>
          {title}
        </Typography>
      </Box>

      {/* Right Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Chip
          size="small"
          label={isBackendChecking ? 'Connecting API' : backendHealthError ? 'API offline' : `API ${backendHealth?.status ?? 'ready'}`}
          sx={{
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
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#131B2E',
            border: '1px solid #1E293B',
            borderRadius: 1.5,
            px: 1.5,
            py: 0.3,
            width: 230,
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

        {/* Sample Data Toggle Button */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setIsSampleData(!isSampleData);
            setSnackbarMessage(isSampleData ? 'Switched to clean input mode.' : 'Sample demonstration project loaded.');
          }}
          sx={{
            borderColor: '#334155',
            color: isSampleData ? '#38BDF8' : '#94A3B8',
            backgroundColor: isSampleData ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            fontSize: '0.78rem',
            '&:hover': {
              borderColor: '#475569',
              backgroundColor: isSampleData ? 'rgba(56, 189, 248, 0.12)' : '#1E293B',
            },
          }}
        >
          Sample data
        </Button>

        {/* Secondary Action */}
        {secondaryAction && (
          <Button
            variant="outlined"
            size="small"
            onClick={secondaryAction.onClick}
            sx={{
              borderColor: '#334155',
              color: '#F8FAFC',
              fontSize: '0.78rem',
              '&:hover': { borderColor: '#475569', backgroundColor: '#1E293B' },
            }}
          >
            {secondaryAction.label}
          </Button>
        )}

        {/* Primary Action */}
        <Button
          variant="contained"
          size="small"
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          sx={{
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
      </Box>
    </Box>
  );
};
