import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';
import { tokens } from '../theme';

const pipelineStages: { id: StageId; label: string }[] = [
  { id: 'setup', label: 'Project setup' },
  { id: 'survey', label: 'Survey and validation' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'reasoning', label: 'AI reasoning' },
  { id: 'design', label: 'Design engine' },
  { id: 'drawings', label: 'Drawings' },
  { id: 'beme', label: 'BEME and report' },
];

const NavRow: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  dot?: boolean;
}> = ({ active, label, onClick, icon, dot }) => (
  <Box
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-current={active ? 'page' : undefined}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') onClick();
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.25,
      height: 34,
      px: 1.25,
      mb: 0.25,
      borderRadius: '8px',
      cursor: 'pointer',
      color: active ? tokens.text : tokens.muted,
      backgroundColor: active ? '#151A22' : 'transparent',
      boxShadow: active ? `inset 2px 0 0 ${tokens.accent}` : 'none',
      transition: 'background-color 140ms ease, color 140ms ease',
      '&:hover': { backgroundColor: active ? '#171D26' : 'rgba(255,255,255,0.035)', color: tokens.text },
      '&:focus-visible': { outline: `2px solid rgba(91,141,239,0.7)`, outlineOffset: 1 },
    }}
  >
    {icon ? (
      <Box sx={{ display: 'flex', color: active ? tokens.accent : tokens.faint }}>{icon}</Box>
    ) : (
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          ml: 0.9,
          mr: 0.6,
          backgroundColor: active ? tokens.accent : '#39414E',
          boxShadow: active ? `0 0 0 3px rgba(91,141,239,0.18)` : 'none',
          flexShrink: 0,
        }}
      />
    )}
    <Typography
      noWrap
      sx={{
        fontSize: '0.8125rem',
        fontWeight: active ? 600 : 400,
        color: 'inherit',
        letterSpacing: '-0.005em',
      }}
    >
      {label}
    </Typography>
    {dot && <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: tokens.warning, ml: 'auto' }} />}
  </Box>
);

export const Sidebar: React.FC = () => {
  const { activeStage, setActiveStage } = useProject();

  return (
    <Box
      component="nav"
      sx={{
        width: 224,
        minWidth: 224,
        height: '100%',
        backgroundColor: '#0B0E14',
        borderRight: `1px solid ${tokens.line}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      <Box sx={{ px: 1.5, pt: 2, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1, pb: 2 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              background: `linear-gradient(140deg, ${tokens.accent}, #3F6FD0)`,
              borderRadius: 1.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '-0.02em',
            }}
          >
            D
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2, color: tokens.text }}>
              DariusOS
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: tokens.faint, lineHeight: 1.3 }}>
              Road design platform
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ px: 1.25, mb: 0.5, color: tokens.faint }}>
          Workspace
        </Typography>
        <NavRow
          active={activeStage === 'overview'}
          label="Overview"
          onClick={() => setActiveStage('overview')}
          icon={<DashboardOutlinedIcon sx={{ fontSize: 16 }} />}
        />

        <Typography variant="subtitle2" sx={{ px: 1.25, mt: 2.5, mb: 0.5, color: tokens.faint }}>
          Pipeline
        </Typography>
        {pipelineStages.map(stage => (
          <NavRow
            key={stage.id}
            active={activeStage === stage.id}
            label={stage.label}
            onClick={() => setActiveStage(stage.id)}
          />
        ))}

        <Typography variant="subtitle2" sx={{ px: 1.25, mt: 2.5, mb: 0.5, color: tokens.faint }}>
          System
        </Typography>
        <NavRow
          active={activeStage === 'monitoring'}
          label="Routes and monitoring"
          onClick={() => setActiveStage('monitoring')}
          icon={<LayersOutlinedIcon sx={{ fontSize: 16 }} />}
        />
      </Box>

      <Box
        sx={{
          p: 1.75,
          borderTop: `1px solid ${tokens.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#1B212B',
            border: `1px solid ${tokens.lineStrong}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: tokens.muted,
            flexShrink: 0,
          }}
        >
          EL
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: '0.8125rem', fontWeight: 600, color: tokens.text, lineHeight: 1.3 }}>
            Engineering lead
          </Typography>
          <Typography noWrap sx={{ fontSize: '0.6875rem', color: tokens.faint, lineHeight: 1.3 }}>
            Reviewer and approver
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
