import React from 'react';
import { Box, Paper, Typography, Grid, Button, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useProject } from '../context/ProjectContext';
import { MOCK_AUDIT_TRAIL } from '../data/mockData';
import { tokens } from '../theme';

type Status = { label: string; color: string };

const pipelineStatus: {
  num: number;
  name: string;
  desc: string;
  engine: string;
  status: Status;
  stageId: string;
}[] = [
  {
    num: 1,
    name: 'Project setup',
    desc: 'Road class, standards, pavement and drainage requirements set',
    engine: 'Project context',
    status: { label: 'Complete', color: tokens.success },
    stageId: 'setup',
  },
  {
    num: 2,
    name: 'Survey and validation',
    desc: '1,842 points checked, 3 warnings acknowledged',
    engine: 'Validation',
    status: { label: 'Complete', color: tokens.success },
    stageId: 'survey',
  },
  {
    num: 3,
    name: 'Terrain',
    desc: 'TIN, contours, existing-ground profile and slope analysis',
    engine: 'Terrain engine',
    status: { label: 'Complete', color: tokens.success },
    stageId: 'terrain',
  },
  {
    num: 4,
    name: 'Design engine',
    desc: '22 of 27 checks pass, 1 needs review',
    engine: 'Engineering engine',
    status: { label: 'In progress', color: tokens.accent },
    stageId: 'design',
  },
  {
    num: 5,
    name: 'Drawings',
    desc: 'Plan, profile and cross-sections as DXF and PDF',
    engine: 'CAD engine',
    status: { label: 'Waiting', color: tokens.faint },
    stageId: 'drawings',
  },
  {
    num: 6,
    name: 'BEME and report',
    desc: 'Quantity times rate, traced to one design revision',
    engine: 'Quantity and BEME',
    status: { label: 'Draft', color: tokens.warning },
    stageId: 'beme',
  },
];

const reviewItems = [
  {
    title: 'Gradient exceeds limit at Ch 1+840',
    meta: 'Design engine · Rev C · vertical alignment',
    badge: 'Review required',
    color: tokens.danger,
    stage: 'design',
  },
  {
    title: 'Steep side slope in cut, Ch 2+100 to 2+260',
    meta: 'Design engine · Rev C · cross-sections',
    badge: 'Warning',
    color: tokens.warning,
    stage: 'design',
  },
] as const;

const Stat: React.FC<{ label: string; value: string; meta: React.ReactNode }> = ({ label, value, meta }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: 2.5, py: 2 }}>
    <Typography variant="subtitle2" sx={{ color: tokens.faint, mb: 1 }}>
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: '1.625rem',
        fontWeight: 650,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        color: tokens.text,
        fontVariantNumeric: 'tabular-nums',
        mb: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>{meta}</Box>
  </Box>
);

const Meta: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <Typography sx={{ fontSize: '0.71875rem', color: color ?? tokens.muted, lineHeight: 1.4 }}>
    {children}
  </Typography>
);

const StatusPill: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
      flexShrink: 0,
      fontSize: '0.71875rem',
      fontWeight: 500,
      color,
    }}
  >
    <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: color }} />
    {label}
  </Box>
);

export const OverviewView: React.FC = () => {
  const { setActiveStage } = useProject();

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Summary strip */}
      <Paper
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
          mb: 2.5,
          overflow: 'hidden',
          '& > *': { borderTop: `1px solid ${tokens.line}`, borderLeft: `1px solid ${tokens.line}` },
        }}
      >
        <Stat
          label="Survey points"
          value="1,842"
          meta={
            <>
              <Meta color={tokens.warning}>3 warnings</Meta>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#39414E' }} />
              <Meta color={tokens.success}>0 errors</Meta>
            </>
          }
        />
        <Stat label="Alignment" value="3.20 km" meta={<Meta>Ch 0+000 to 3+200 · rolling terrain</Meta>} />
        <Stat
          label="Earthworks"
          value="18,420 m³"
          meta={<Meta>Cut ~15,960 m³ · fill 2,460 m³ net spoil</Meta>}
        />
        <Stat
          label="BEME total (draft)"
          value="₦666.5M"
          meta={
            <>
              <Meta>Rev C</Meta>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#39414E' }} />
              <Meta color={tokens.warning}>Awaiting approval</Meta>
            </>
          }
        />
      </Paper>

      <Grid container spacing={2.5}>
        {/* Left column */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ mb: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2.5,
                pt: 2.25,
                pb: 1.5,
              }}
            >
              <Box>
                <Typography variant="h6">Workflow pipeline</Typography>
                <Typography variant="caption" sx={{ color: tokens.faint }}>
                  Six stages from survey to signed report
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.71875rem', color: tokens.faint, display: { xs: 'none', sm: 'block' } }}>Design revision C</Typography>
            </Box>
            <Divider />
            <Box sx={{ px: 1 }}>
              {pipelineStatus.map((stage, index) => (
                <Box
                  key={stage.num}
                  onClick={() => setActiveStage(stage.stageId as never)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setActiveStage(stage.stageId as never);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, md: 2 },
                    px: 1.5,
                    py: 1.25,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    borderBottom: index === pipelineStatus.length - 1 ? 'none' : `1px solid ${tokens.line}`,
                    transition: 'background-color 140ms ease',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
                  }}
                >
                  <Typography
                    sx={{
                      width: 22,
                      flexShrink: 0,
                      fontSize: '0.71875rem',
                      fontWeight: 600,
                      color: tokens.faint,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {String(stage.num).padStart(2, '0')}
                  </Typography>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: '0.84375rem', fontWeight: 600, color: tokens.text, lineHeight: 1.45 }}>
                      {stage.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: tokens.muted,
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {stage.desc}
                    </Typography>
                  </Box>

                  <Typography
                    noWrap
                    sx={{
                      fontSize: '0.71875rem',
                      color: tokens.faint,
                      display: { xs: 'none', md: 'block' },
                      width: 120,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {stage.engine}
                  </Typography>

                  <Box sx={{ width: 96, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    <StatusPill label={stage.status.label} color={stage.status.color} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ px: 2.5, py: 2.25 }}>
            <Typography variant="h6" sx={{ mb: 0.25 }}>
              How every output is produced
            </Typography>
            <Typography variant="caption" sx={{ color: tokens.muted, display: 'block', mb: 2.5 }}>
              The engine never issues the final answer on its own. It calculates, validation checks every result, and an
              engineer reviews the output.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
              {[
                ['Survey is ingested', 'Points are validated and cleaned before design.'],
                ['Engine calculates', 'Deterministic maths produces alignment, profile and volumes.'],
                ['Validation checks', 'Every result is marked pass, warning or review.'],
                ['Engineer approves', 'Nothing is released without a qualified sign-off.'],
              ].map(([title, body], i) => (
                <Box key={title} sx={{ flex: '1 1 150px', minWidth: 0, position: 'relative', pl: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Typography
                      sx={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: tokens.accent,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Typography>
                    <Box sx={{ flex: 1, height: 1, backgroundColor: tokens.line }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: tokens.text, mb: 0.4 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: tokens.muted, lineHeight: 1.5 }}>{body}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.25, pt: 2, pb: 1.5 }}>
              <Typography variant="h6">Needs engineer review</Typography>
              <Typography sx={{ fontSize: '0.71875rem', color: tokens.danger, fontWeight: 500 }}>2 open</Typography>
            </Box>
            <Divider />
            <Box sx={{ px: 1, py: 0.5 }}>
              {reviewItems.map(item => (
                <Box
                  key={item.title}
                  sx={{
                    px: 1.25,
                    py: 1.25,
                    borderRadius: '8px',
                    borderLeft: `2px solid ${item.color}`,
                    mb: 0.25,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mb: 0.4, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: tokens.text, lineHeight: 1.45 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6875rem', color: item.color, fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {item.badge}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.71875rem', color: tokens.faint, mb: 0.75 }}>{item.meta}</Typography>
                  <Button
                    size="small"
                    onClick={() => setActiveStage(item.stage as never)}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                    sx={{ p: 0, minHeight: 0, fontSize: '0.75rem', color: tokens.muted, '&:hover': { color: tokens.text, backgroundColor: 'transparent' } }}
                  >
                    Open item
                  </Button>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ px: 2.25, py: 2.25 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Audit trail
            </Typography>
            <Box sx={{ position: 'relative', pl: 2 }}>
              <Box sx={{ position: 'absolute', left: 3, top: 4, bottom: 4, width: 1, backgroundColor: tokens.line }} />
              {MOCK_AUDIT_TRAIL.map((evt, idx) => {
                const color =
                  evt.type === 'approval' ? tokens.success : evt.type === 'warning' ? tokens.warning : tokens.accent;
                return (
                  <Box key={idx} sx={{ position: 'relative', mb: idx === MOCK_AUDIT_TRAIL.length - 1 ? 0 : 2 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -14.5,
                        top: 4,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: color,
                        boxShadow: `0 0 0 3px ${tokens.surface}`,
                      }}
                    />
                    <Typography sx={{ fontSize: '0.8125rem', color: tokens.text, lineHeight: 1.45 }}>
                      {evt.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.71875rem', color: tokens.faint }}>{evt.time}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
