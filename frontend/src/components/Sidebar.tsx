import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';
import { VIZ_TOKENS } from '../tokens';

export const Sidebar: React.FC = () => {
  const { activeStage, setActiveStage } = useProject();

  const pipelineStages: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: '1 · Project setup' },
    { id: 'survey', number: 2, label: '2 · Survey & validation' },
    { id: 'terrain', number: 3, label: '3 · Terrain engine' },
    { id: 'design', number: 4, label: '4 · Design engine' },
    { id: 'drawings', number: 5, label: '5 · CAD drawings' },
    { id: 'beme', number: 6, label: '6 · BEME & report' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        minWidth: 240,
        height: '100vh',
        backgroundColor: '#090D16',
        borderRight: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      <Box>
        {/* Brand Header */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #141C2E' }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              backgroundColor: '#2563EB',
              borderRadius: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: VIZ_TOKENS.typography.monoFont,
              boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            D
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.05rem', lineHeight: 1.1 }}>
              DariusOS
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              ROAD DESIGN CAD
            </Typography>
          </Box>
        </Box>

        {/* WORKSPACE */}
        <Box sx={{ px: 2, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ px: 1, mb: 0.8, color: '#64748B', fontSize: '0.68rem' }}>
            WORKSPACE
          </Typography>
          <List disablePadding>
            <ListItemButton
              selected={activeStage === 'overview'}
              onClick={() => setActiveStage('overview')}
              sx={{
                borderRadius: 1.5,
                py: 0.8,
                px: 1.5,
                mb: 0.5,
                backgroundColor: activeStage === 'overview' ? '#141E34' : 'transparent',
                border: activeStage === 'overview' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                '&.Mui-selected': {
                  backgroundColor: '#141E34',
                  '&:hover': { backgroundColor: '#141E34' },
                },
                '&:hover': { backgroundColor: '#0F1626' },
                transition: VIZ_TOKENS.transitions.cardHover,
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: activeStage === 'overview' ? '#38BDF8' : '#64748B' }}>
                <DashboardOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Corridor Overview"
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
          <Typography variant="subtitle2" sx={{ px: 1, mb: 0.8, color: '#64748B', fontSize: '0.68rem' }}>
            ENGINEERING PIPELINE
          </Typography>
          <List disablePadding>
            {pipelineStages.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <ListItemButton
                  key={stage.id}
                  selected={isSelected}
                  onClick={() => setActiveStage(stage.id)}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.7,
                    px: 1.5,
                    mb: 0.5,
                    backgroundColor: isSelected ? '#141E34' : 'transparent',
                    border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                    '&.Mui-selected': {
                      backgroundColor: '#141E34',
                      '&:hover': { backgroundColor: '#141E34' },
                    },
                    '&:hover': { backgroundColor: '#0F1626' },
                    transition: VIZ_TOKENS.transitions.cardHover,
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#38BDF8' : '#1A2438',
                      color: isSelected ? '#090D16' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      fontFamily: VIZ_TOKENS.typography.monoFont,
                      mr: 1.5,
                    }}
                  >
                    {stage.number}
                  </Box>
                  <ListItemText
                    primary={stage.label.split('· ')[1]}
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
      </Box>

      {/* User Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #1E293B', backgroundColor: '#080C14' }}>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textTransform: 'uppercase', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em' }}>
          COREN REGISTERED REVIEWER
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.825rem', mt: 0.2 }}>
          Engr. Lead Consultant
        </Typography>
        <Typography variant="caption" sx={{ color: '#16A34A', fontSize: '0.7rem', fontWeight: 600 }}>
          ● Licensed Signing Authority
        </Typography>
      </Box>
    </Box>
  );
};
