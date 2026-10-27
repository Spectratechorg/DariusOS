import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';

export const Sidebar: React.FC = () => {
  const { activeStage, setActiveStage } = useProject();

  const pipelineStages: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Project setup' },
    { id: 'survey', number: 2, label: 'Survey and validation' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'reasoning', number: 4, label: 'AI reasoning' },
    { id: 'design', number: 5, label: 'Design engine' },
    { id: 'drawings', number: 6, label: 'Drawings' },
    { id: 'beme', number: 7, label: 'BEME and report' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        minWidth: 240,
        height: '100vh',
        backgroundColor: '#0A0E17',
        borderRight: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      <Box>
        {/* Brand Header */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              backgroundColor: '#2563EB',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            D
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
            DariusOS
          </Typography>
        </Box>

        {/* WORKSPACE */}
        <Box sx={{ px: 2, mt: 1 }}>
          <Typography variant="subtitle2" sx={{ px: 1, mb: 0.5, color: '#64748B', fontSize: '0.7rem' }}>
            WORKSPACE
          </Typography>
          <List disablePadding>
            <ListItemButton
              selected={activeStage === 'overview'}
              onClick={() => setActiveStage('overview')}
              sx={{
                borderRadius: 1.5,
                py: 0.7,
                px: 1.5,
                mb: 0.5,
                backgroundColor: activeStage === 'overview' ? '#1E293B' : 'transparent',
                '&.Mui-selected': {
                  backgroundColor: '#1E293B',
                  '&:hover': { backgroundColor: '#1E293B' },
                },
                '&:hover': { backgroundColor: '#131D2E' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: activeStage === 'overview' ? '#38BDF8' : '#64748B' }}>
                <DashboardOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Overview"
                primaryTypographyProps={{
                  fontSize: '0.825rem',
                  fontWeight: activeStage === 'overview' ? 600 : 400,
                  color: activeStage === 'overview' ? '#F8FAFC' : '#94A3B8',
                }}
              />
            </ListItemButton>
          </List>
        </Box>

        {/* PIPELINE */}
        <Box sx={{ px: 2, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ px: 1, mb: 0.5, color: '#64748B', fontSize: '0.7rem' }}>
            PIPELINE
          </Typography>
          <List disablePadding>
            {pipelineStages.map(stage => {
              const isSelected = activeStage === stage.id;
              return (
                <ListItemButton
                  key={stage.id}
                  selected={isSelected}
                  onClick={() => setActiveStage(stage.id)}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.6,
                    px: 1.5,
                    mb: 0.4,
                    backgroundColor: isSelected ? '#1E293B' : 'transparent',
                    '&.Mui-selected': {
                      backgroundColor: '#1E293B',
                      '&:hover': { backgroundColor: '#1E293B' },
                    },
                    '&:hover': { backgroundColor: '#131D2E' },
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#10B981' : '#1E293B',
                      color: isSelected ? '#0B0F19' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      mr: 1.5,
                    }}
                  >
                    {stage.number}
                  </Box>
                  <ListItemText
                    primary={stage.label}
                    primaryTypographyProps={{
                      fontSize: '0.825rem',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#F8FAFC' : '#94A3B8',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* FULL SYSTEM */}
        <Box sx={{ px: 2, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ px: 1, mb: 0.5, color: '#64748B', fontSize: '0.7rem' }}>
            FULL SYSTEM
          </Typography>
          <List disablePadding>
            <ListItemButton
              selected={activeStage === 'monitoring'}
              onClick={() => setActiveStage('monitoring')}
              sx={{
                borderRadius: 1.5,
                py: 0.6,
                px: 1.5,
                backgroundColor: activeStage === 'monitoring' ? '#1E293B' : 'transparent',
                '&.Mui-selected': {
                  backgroundColor: '#1E293B',
                  '&:hover': { backgroundColor: '#1E293B' },
                },
                '&:hover': { backgroundColor: '#131D2E' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: activeStage === 'monitoring' ? '#38BDF8' : '#64748B' }}>
                <LayersOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Routes and monitoring"
                primaryTypographyProps={{
                  fontSize: '0.825rem',
                  fontWeight: activeStage === 'monitoring' ? 600 : 400,
                  color: activeStage === 'monitoring' ? '#F8FAFC' : '#94A3B8',
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Box>

      {/* User Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #1E293B', backgroundColor: '#090D15' }}>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>
          SIGNED IN
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.825rem', mt: 0.2 }}>
          Engineering lead
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
          Reviewer and approver
        </Typography>
      </Box>
    </Box>
  );
};
