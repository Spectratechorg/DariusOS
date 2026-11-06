import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { StageId } from '../types';
import { tokens } from '../theme';

const steps: { id: StageId; number: number; label: string }[] = [
  { id: 'setup', number: 1, label: 'Setup' },
  { id: 'survey', number: 2, label: 'Survey' },
  { id: 'terrain', number: 3, label: 'Terrain' },
  { id: 'design', number: 4, label: 'Design' },
  { id: 'drawings', number: 5, label: 'Drawings' },
  { id: 'beme', number: 6, label: 'BEME' },
];

const stageOrder: Record<StageId, number> = {
  overview: 0,
  setup: 1,
  survey: 2,
  terrain: 3,
  design: 4,
  drawings: 5,
  beme: 6,
  monitoring: 6,
};

export const StepperBar: React.FC = () => {
  const { activeStage, setActiveStage } = useProject();
  const current = stageOrder[activeStage] ?? 0;

  return (
    <Box
      sx={{
        flexShrink: 0,
        height: { xs: 44, sm: 38 },
        px: { xs: 2, md: 3 },
        backgroundColor: tokens.base,
        borderBottom: `1px solid ${tokens.line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: tokens.faint, flexShrink: 0, mb: 0, display: { xs: 'none', sm: 'block' } }}
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
                  flex: 1,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:focus-visible': { outline: `2px solid rgba(91,141,239,0.7)`, outlineOffset: 2, borderRadius: 99 },
                  '& .bar': {
                    height: 3,
                    width: '100%',
                    borderRadius: 99,
                    backgroundColor: isCurrent
                      ? tokens.accent
                      : isComplete
                        ? 'rgba(91,141,239,0.45)'
                        : '#1E242E',
                    transition: 'background-color 160ms ease, height 160ms ease',
                  },
                  '&:hover .bar': { height: 5, backgroundColor: isCurrent ? tokens.accentHover : '#3A4453' },
                }}
              >
                <Box className="bar" />
              </Box>
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
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {current === 0 ? 'Overview' : `Stage ${current} of 6`}
      </Typography>
    </Box>
  );
};
