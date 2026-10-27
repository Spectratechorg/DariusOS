import React from 'react';
import { Box, Card, Typography, Grid, Chip, Button } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { MOCK_AUDIT_TRAIL } from '../data/mockData';

export const OverviewView: React.FC = () => {
  const { setActiveStage } = useProject();

  const pipelineStatus = [
    { num: 1, name: 'Project setup', desc: 'Road class, standards, pavement and drainage requirements set', engine: 'PROJECT CONTEXT', status: 'Complete', color: '#10B981', stageId: 'setup' },
    { num: 2, name: 'Survey and validation', desc: '1,842 points checked, 3 warnings acknowledged', engine: 'VALIDATION', status: 'Complete', color: '#10B981', stageId: 'survey' },
    { num: 3, name: 'Terrain', desc: 'TIN, contours, existing-ground profile and slope analysis', engine: 'TERRAIN ENGINE', status: 'Complete', color: '#10B981', stageId: 'terrain' },
    { num: 4, name: 'AI reasoning', desc: 'Parameter set approved by the engineering lead', engine: 'INTELLIGENCE ENGINE', status: 'Approved', color: '#10B981', stageId: 'reasoning' },
    { num: 5, name: 'Design engine', desc: '22 of 27 checks pass, 1 needs review', engine: 'ENGINEERING ENGINE', status: 'In progress', color: '#38BDF8', stageId: 'design' },
    { num: 6, name: 'Drawings', desc: 'Plan, profile and cross-sections as DXF and PDF', engine: 'CAD ENGINE', status: 'Waiting', color: '#64748B', stageId: 'drawings' },
    { num: 7, name: 'BEME and report', desc: 'Quantity times rate, traced to one design revision', engine: 'QUANTITY AND BEME', status: 'Draft', color: '#F59E0B', stageId: 'beme' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* 4 Summary Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.2, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
              SURVEY POINTS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1.5, letterSpacing: '-0.02em' }}>
              1,842
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="3 warnings" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontSize: '0.7rem' }} />
              <Chip label="0 errors" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.7rem' }} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.2, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
              ALIGNMENT
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1, letterSpacing: '-0.02em' }}>
              3.20 km
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
              Ch 0+000 to 3+200 · rolling terrain
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.2, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
              EARTHWORKS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1, letterSpacing: '-0.02em' }}>
              18,420 m³
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
              cut ~15,960 m³ fill · 2,460 m³ net spoil
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.2, height: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
              BEME TOTAL (DRAFT)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 1.5, letterSpacing: '-0.02em' }}>
              ₦666.5M
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Rev C" size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.7rem' }} />
              <Chip label="awaiting approval" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontSize: '0.7rem' }} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Workflow Pipeline */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Workflow pipeline
              </Typography>
              <Chip label="DESIGN REVISION C" size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {pipelineStatus.map(stage => (
                <Box
                  key={stage.num}
                  onClick={() => setActiveStage(stage.stageId as any)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 1.5,
                    border: '1px solid #1E293B',
                    backgroundColor: '#0F1626',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#334155', backgroundColor: '#141E33' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stage.color,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {stage.num}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                        {stage.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {stage.desc}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem' }}>
                      {stage.engine}
                    </Typography>
                    <Chip
                      label={stage.status}
                      size="small"
                      sx={{
                        backgroundColor: `${stage.color}18`,
                        color: stage.color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: `1px solid ${stage.color}40`,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* How Every Output is Produced Card */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              How every output is produced
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              The AI never issues the final answer. It proposes, the engineering engine calculates, the validation engine checks, and an engineer approves.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    01
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    AI proposes
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Intelligence engine suggests parameters and alternatives, with reasons.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    02
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    Engine calculates
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Deterministic maths produces alignment, profile, sections and earthworks.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    03
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    Validation checks
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Every result is marked PASS, WARNING or REVIEW REQUIRED.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    04
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    Engineer approves
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Nothing is released until a qualified engineer signs it off.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Needs Engineer Review */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Needs engineer review
              </Typography>
              <Chip label="3 open" size="small" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontWeight: 700, fontSize: '0.7rem' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Review Item 1 */}
              <Box sx={{ p: 1.8, borderRadius: 1.5, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Gradient exceeds limit at Ch 1+840
                  </Typography>
                  <Chip label="Review required" size="small" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                  Design engine · Rev C · vertical alignment
                </Typography>
                <Button size="small" onClick={() => setActiveStage('design')} sx={{ color: '#38BDF8', p: 0, fontSize: '0.75rem', textTransform: 'none' }}>
                  Open item →
                </Button>
              </Box>

              {/* Review Item 2 */}
              <Box sx={{ p: 1.8, borderRadius: 1.5, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Steep side slope in cut, Ch 2+100 to 2+260
                  </Typography>
                  <Chip label="Warning" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                  Design engine · Rev C · cross-sections
                </Typography>
                <Button size="small" onClick={() => setActiveStage('design')} sx={{ color: '#38BDF8', p: 0, fontSize: '0.75rem', textTransform: 'none' }}>
                  Open item →
                </Button>
              </Box>

              {/* Review Item 3 */}
              <Box sx={{ p: 1.8, borderRadius: 1.5, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Curve radius options for the bend at Ch 0+950
                  </Typography>
                  <Chip label="Awaiting approval" size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                  AI reasoning · three alternatives compared
                </Typography>
                <Button size="small" onClick={() => setActiveStage('reasoning')} sx={{ color: '#38BDF8', p: 0, fontSize: '0.75rem', textTransform: 'none' }}>
                  Open item →
                </Button>
              </Box>
            </Box>
          </Card>

          {/* Audit Trail */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Audit trail
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {MOCK_AUDIT_TRAIL.map((evt, idx) => (
                <Box key={idx} sx={{ borderLeft: '2px solid #1E293B', pl: 1.8, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -5,
                      top: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: evt.type === 'approval' ? '#10B981' : evt.type === 'warning' ? '#F59E0B' : '#38BDF8',
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#F8FAFC', fontSize: '0.8125rem' }}>
                    {evt.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                    {evt.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
