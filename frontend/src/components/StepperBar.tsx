import React from 'react';
import { Box, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';

export const StepperBar: React.FC = () => {
  const { activeStage, setActiveStage } = useProject();

  const steps: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Setup' },
    { id: 'survey', number: 2, label: 'Survey' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'reasoning', number: 4, label: 'AI reasoning' },
    { id: 'design', number: 5, label: 'Design' },
    { id: 'drawings', number: 6, label: 'Drawings' },
    { id: 'beme', number: 7, label: 'BEME and report' },
  ];

  // Stage order index for progress indicator
  const stageOrder: Record<StageId, number> = {
    overview: 5,
    setup: 1,
    survey: 2,
    terrain: 3,
    reasoning: 4,
    design: 5,
    drawings: 6,
    beme: 7,
    monitoring: 7,
  };

  const currentStepNum = stageOrder[activeStage] || 1;

  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        backgroundColor: '#0A0E17',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        {steps.map(s => {
          const isCompleted = s.number < currentStepNum;
          const isCurrent = s.id === activeStage || (activeStage === 'overview' && s.number <= 4);
          const color = isCurrent ? '#38BDF8' : isCompleted ? '#10B981' : '#64748B';

          return (
            <Box
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                py: 0.4,
                px: 1,
                borderRadius: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color,
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.75rem',
                }}
              >
                {s.number} · {s.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Progress Line */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 2,
          backgroundColor: '#1E293B',
          width: '100%',
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: '#10B981',
            width: `${Math.min(100, (currentStepNum / 7) * 100)}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    </Box>
  );
};
