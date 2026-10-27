import React, { useState } from 'react';
import { Box, Card, Typography, Grid, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useProject } from '../context/ProjectContext';
import { MOCK_GRADIENT_SEGMENTS } from '../data/mockData';

export const DesignEngineView: React.FC = () => {
  const { 
    activeDesignTab, 
    setActiveDesignTab, 
    designIssues, 
    acceptDesignIssue 
  } = useProject();

  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [engineerNote, setEngineerNote] = useState(
    'Topography allows 9.2% grade over 100m tangent crest with adequate stopping sight distance. Pavement wearing course friction verified.'
  );

  const issue1840 = designIssues.find(i => i.id === 'di1');
  const isAccepted1840 = issue1840?.isAccepted ?? false;

  const handleConfirmAccept = () => {
    acceptDesignIssue('di1', engineerNote);
    setOpenNoteModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Engine Progress Bar */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#0A0E17', border: '1px solid #1E293B' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon sx={{ color: '#10B981', fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
                  AI proposes
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  Parameter set v2 approved
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon sx={{ color: '#10B981', fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
                  Engine calculates
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  Revision C generated
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAccepted1840 ? (
                <CheckCircleOutlinedIcon sx={{ color: '#10B981', fontSize: '1.1rem' }} />
              ) : (
                <ErrorOutlineOutlinedIcon sx={{ color: '#EF4444', fontSize: '1.1rem' }} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isAccepted1840 ? '#10B981' : '#EF4444', fontSize: '0.8rem' }}>
                  Validation checks
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  {isAccepted1840 ? 'All items accepted with notes' : '22 pass · 4 warnings · 1 review'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberOutlinedIcon sx={{ color: isAccepted1840 ? '#10B981' : '#64748B', fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isAccepted1840 ? '#F8FAFC' : '#94A3B8', fontSize: '0.8rem' }}>
                  Engineer approves
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  {isAccepted1840 ? 'Ready for CAD sheet issuance' : 'Blocked until review is cleared'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Main Visual Profile / Alignment / Cross-section Card */}
          <Card sx={{ p: 3, mb: 3 }}>
            {/* View Switcher Tabs */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2.5, borderBottom: '1px solid #1E293B', pb: 1.5 }}>
              {(['Longitudinal profile', 'Horizontal alignment', 'Cross-section'] as const).map(tab => (
                <Button
                  key={tab}
                  size="small"
                  onClick={() => setActiveDesignTab(tab)}
                  sx={{
                    px: 1.8,
                    py: 0.5,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    color: activeDesignTab === tab ? '#F8FAFC' : '#64748B',
                    backgroundColor: activeDesignTab === tab ? '#1E293B' : 'transparent',
                    '&:hover': { backgroundColor: activeDesignTab === tab ? '#1E293B' : 'rgba(255,255,255,0.02)' },
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>

            {/* Profile Chart Canvas */}
            <Box
              sx={{
                width: '100%',
                height: 250,
                backgroundColor: '#090D16',
                borderRadius: 1.5,
                border: '1px solid #1E293B',
                position: 'relative',
                overflow: 'hidden',
                mb: 2.5,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 700 250" preserveAspectRatio="none">
                {/* Horizontal Grid */}
                <line x1="40" y1="30" x2="680" y2="30" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="80" x2="680" y2="80" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="130" x2="680" y2="130" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="180" x2="680" y2="180" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="220" x2="680" y2="220" stroke="#162238" />

                <text x="15" y="34" fill="#64748B" fontSize="9" fontFamily="monospace">275</text>
                <text x="15" y="84" fill="#64748B" fontSize="9" fontFamily="monospace">266</text>
                <text x="15" y="134" fill="#64748B" fontSize="9" fontFamily="monospace">257</text>
                <text x="15" y="184" fill="#64748B" fontSize="9" fontFamily="monospace">248</text>

                {/* Existing Ground (Blue line) */}
                <polyline
                  points="40,190 120,165 200,140 280,110 360,75 420,130 500,170 580,145 680,120"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.2"
                />

                {/* Proposed Design Grade Line (Orange line) */}
                <polyline
                  points="40,185 120,160 220,135 320,110 380,68 440,145 520,155 600,138 680,118"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.2"
                />

                {/* Annotations */}
                <text x="310" y="150" fill="#64748B" fontSize="9" fontFamily="sans-serif">CUT through the ridge</text>
                <text x="470" y="195" fill="#64748B" fontSize="9" fontFamily="sans-serif">FILL across the valley</text>

                {/* Flagged Review Point at Ch 1+840 */}
                <circle cx="380" cy="68" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <line x1="380" y1="68" x2="415" y2="40" stroke="#EF4444" strokeWidth="1.2" />
                <rect x="420" y="30" width="95" height="18" rx="3" fill="#1E1515" stroke="#EF4444" strokeWidth="1" />
                <text x="426" y="42" fill="#F87171" fontSize="9" fontWeight="700" fontFamily="sans-serif">Ch 1+840 · 9.2 %</text>

                {/* X Axis Chainage */}
                <text x="40" y="238" fill="#64748B" fontSize="9" fontFamily="sans-serif">0+000</text>
                <text x="180" y="238" fill="#64748B" fontSize="9" fontFamily="sans-serif">0+800</text>
                <text x="320" y="238" fill="#64748B" fontSize="9" fontFamily="sans-serif">1+650</text>
                <text x="480" y="238" fill="#64748B" fontSize="9" fontFamily="sans-serif">2+400</text>
                <text x="640" y="238" fill="#64748B" fontSize="9" fontFamily="sans-serif">3+200</text>
              </svg>

              {/* Legend Bottom */}
              <Box sx={{ position: 'absolute', bottom: 8, left: 16, display: 'flex', gap: 2.5, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2, backgroundColor: '#38BDF8' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Existing ground</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2, backgroundColor: '#F59E0B' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Proposed profile</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <Typography variant="caption" sx={{ color: '#EF4444', fontSize: '0.7rem' }}>Flagged for review</Typography>
                </Box>
              </Box>
            </Box>

            {/* Gradient Segments Table */}
            <TableContainer sx={{ borderRadius: 1, border: '1px solid #1E293B' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#0A0E17' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>CHAINAGE</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>GRADIENT</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>RESULT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_GRADIENT_SEGMENTS.map((seg, idx) => {
                    const isReview = seg.result === 'Review required';
                    return (
                      <TableRow key={idx} sx={{ backgroundColor: isReview ? 'rgba(239, 68, 68, 0.05)' : 'transparent', '&:hover': { backgroundColor: '#131D2E' } }}>
                        <TableCell sx={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {seg.chainage}
                        </TableCell>
                        <TableCell sx={{ color: isReview ? '#EF4444' : '#CBD5E1', fontWeight: isReview ? 700 : 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {seg.gradient}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isReview && isAccepted1840 ? 'Accepted (Note)' : seg.result}
                            size="small"
                            sx={{
                              backgroundColor: (isReview && !isAccepted1840) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: (isReview && !isAccepted1840) ? '#EF4444' : '#34D399',
                              fontWeight: 600,
                              fontSize: '0.68rem',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Validation
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
                27 CHECKS
              </Typography>
            </Box>

            {/* 3 Metric Badges */}
            <Grid container spacing={1} sx={{ mb: 2.5 }}>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#34D399' }}>22</Typography>
                  <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.65rem' }}>PASS</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#FBBF24' }}>4</Typography>
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.65rem' }}>WARNING</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: isAccepted1840 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isAccepted1840 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: isAccepted1840 ? '#34D399' : '#EF4444' }}>{isAccepted1840 ? 0 : 1}</Typography>
                  <Typography variant="caption" sx={{ color: isAccepted1840 ? '#10B981' : '#EF4444', fontWeight: 600, fontSize: '0.65rem' }}>REVIEW</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Issues List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              {designIssues.map(issue => {
                const isReview = issue.severity === 'Review required';
                const isItemAccepted = issue.id === 'di1' && isAccepted1840;

                return (
                  <Box
                    key={issue.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      border: '1px solid #1E293B',
                      backgroundColor: '#0F1626',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem', pr: 1 }}>
                        {issue.title}
                      </Typography>
                      <Chip
                        label={isItemAccepted ? 'Accepted' : issue.severity}
                        size="small"
                        sx={{
                          backgroundColor: isItemAccepted ? 'rgba(16, 185, 129, 0.15)' : isReview ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isItemAccepted ? '#34D399' : isReview ? '#EF4444' : '#FBBF24',
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          height: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem', display: 'block' }}>
                      {issue.description}
                    </Typography>
                    {issue.engineerNote && (
                      <Typography variant="caption" sx={{ color: '#38BDF8', fontSize: '0.7rem', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                        Note: {issue.engineerNote}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Engineer Action Button */}
            {!isAccepted1840 ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => setOpenNoteModal(true)}
                sx={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  py: 1,
                  '&:hover': { backgroundColor: '#1D4ED8' },
                }}
              >
                Accept Ch 1+840 with engineer note
              </Button>
            ) : (
              <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 600, display: 'block' }}>
                  ✓ Review item cleared with registered engineer note
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Engineer Note Acceptance Modal */}
      <Dialog open={openNoteModal} onClose={() => setOpenNoteModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#111827', border: '1px solid #1E293B' } }}>
        <DialogTitle sx={{ color: '#F8FAFC', fontWeight: 600 }}>
          Accept Ch 1+840 Grade Exceedance
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
            The calculated gradient is +9.20% over 100 metres (maximum standard is 8.00%). A registered engineer may accept this variant with an official design review note.
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={engineerNote}
            onChange={e => setEngineerNote(e.target.value)}
            sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
          <Button onClick={() => setOpenNoteModal(false)} sx={{ color: '#94A3B8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAccept} sx={{ backgroundColor: '#2563EB' }}>
            Confirm & Sign Off
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
