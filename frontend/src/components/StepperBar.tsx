import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';
import { VIZ_TOKENS } from '../tokens';

export const StepperBar: React.FC = () => {
  const { activeStage, setActiveStage, hasSurveyUploaded } = useProject();

  const steps: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Setup' },
    { id: 'survey', number: 2, label: 'Survey' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'design', number: 4, label: 'Design' },
    { id: 'drawings', number: 5, label: 'Drawings' },
    { id: 'beme', number: 6, label: 'BEME & Report' },
  ];

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
        px: { xs: 2, md: 3 },
        py: 1.2,
        backgroundColor: '#090D16',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflowX: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          minWidth: 650,
          position: 'relative',
        }}
      >
        {/* Subtle connecting track line behind the steps */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            right: '20px',
            height: '2px',
            backgroundColor: '#1E293B',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />

        {steps.map((s) => {
          const isCompleted = s.number < currentStepNum || (hasSurveyUploaded && s.number <= 2);
          const isCurrent = s.id === activeStage;
          const statusColor = isCurrent ? '#38BDF8' : isCompleted ? '#16A34A' : '#64748B';

          return (
            <Box
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.2,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: isCurrent ? '#0F1E38' : '#090D16',
                border: isCurrent ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                zIndex: 1,
                transition: VIZ_TOKENS.transitions.cardHover,
                '&:hover': {
                  backgroundColor: '#0E1726',
                  borderColor: '#38BDF8',
                },
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `1.5px solid ${statusColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted ? '#16A34A' : isCurrent ? 'rgba(56, 189, 248, 0.15)' : '#090D16',
                  transition: 'all 180ms ease',
                }}
              >
                {isCompleted ? (
                  <CheckIcon sx={{ fontSize: '0.75rem', color: '#F8FAFC' }} />
                ) : (
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: isCurrent ? '#38BDF8' : '#64748B',
                      fontWeight: 700,
                      fontFamily: VIZ_TOKENS.typography.monoFont,
                    }}
                  >
                    {s.number}
                  </Typography>
                )}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#F8FAFC' : isCompleted ? '#CBD5E1' : '#64748B',
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
