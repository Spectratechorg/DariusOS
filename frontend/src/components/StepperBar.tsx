import React from 'react';
import { Box, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';

export const StepperBar: React.FC = () => {
  const { activeStage, setActiveStage, hasSurveyUploaded } = useProject();

  const steps: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Setup' },
    { id: 'survey', number: 2, label: 'Survey' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'design', number: 4, label: 'Design' },
    { id: 'drawings', number: 5, label: 'Drawings' },
    { id: 'beme', number: 6, label: 'BEME and report' },
  ];

  // Stage order index for progress indicator
  const stageOrder: Record<string, number> = {
    overview: hasSurveyUploaded ? 3 : 1,
    setup: 1,
    survey: 2,
    terrain: 3,
    reasoning: 4,
    design: 4,
    drawings: 5,
    beme: 6,
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
          const isCompleted = s.number < currentStepNum || (hasSurveyUploaded && s.number <= 2);
          const isCurrent = s.id === activeStage;
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
                opacity: isCurrent || isCompleted ? 1 : 0.6,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 },
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `1.5px solid ${color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted ? color : 'transparent',
                }}
              >
                {isCompleted ? (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#0A0E17' }} />
                ) : (
                  <Typography sx={{ fontSize: '0.6rem', color, fontWeight: 700 }}>
                    {s.number}
                  </Typography>
                )}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#F8FAFC' : color,
                  fontSize: '0.75rem',
                  letterSpacing: '0.01em',
                }}
              >
                {s.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
