import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';
import { tokens } from '../theme';

const steps: { id: StageId; number: number; label: string }[] = [
  { id: 'setup', number: 1, label: 'Setup' },
  { id: 'survey', number: 2, label: 'Survey' },
  { id: 'terrain', number: 3, label: 'Terrain' },
  { id: 'reasoning', number: 4, label: 'AI reasoning' },
  { id: 'design', number: 5, label: 'Design' },
  { id: 'drawings', number: 6, label: 'Drawings' },
  { id: 'beme', number: 7, label: 'BEME' },
];

const stageOrder: Record<StageId, number> = {
  overview: 0,
  setup: 1,
  survey: 2,
  terrain: 3,
  reasoning: 4,
  design: 5,
  drawings: 6,
  beme: 7,
  monitoring: 7,
};

export const StepperBar: React.FC = () => {
  const { activeStage, setActiveStage } = useProject();
  const current = stageOrder[activeStage] ?? 0;

  return (
    <Box
      sx={{
        flexShrink: 0,
        height: 38,
        px: 3,
        backgroundColor: tokens.base,
        borderBottom: `1px solid ${tokens.line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: tokens.faint, flexShrink: 0, mb: 0 }}
      >
        Pipeline
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
        {steps.map(step => {
          const isComplete = step.number < current;
          const isCurrent = step.number === current;
          return (
            <Tooltip key={step.id} title={`${step.number}. ${step.label}`} placement="bottom">
              <Box
                onClick={() => setActiveStage(step.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveStage(step.id);
                }}
                aria-label={`Go to ${step.label}`}
                sx={{
                  height: 3,
                  flex: 1,
                  borderRadius: 99,
                  cursor: 'pointer',
                  backgroundColor: isCurrent
                    ? tokens.accent
                    : isComplete
                      ? 'rgba(91,141,239,0.45)'
                      : '#1E242E',
                  transition: 'background-color 160ms ease, height 160ms ease',
                  '&:hover': { height: 5, backgroundColor: isCurrent ? tokens.accentHover : '#3A4453' },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>

      <Typography
        sx={{
          flexShrink: 0,
          fontSize: '0.71875rem',
          color: tokens.faint,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {current === 0 ? 'Overview' : `Stage ${current} of 7`}
      </Typography>
    </Box>
  );
};
