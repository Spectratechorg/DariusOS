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
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Top Engine Progress Bar */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#080A0E', border: '1px solid #1B2029' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon sx={{ color: '#46B98A', fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#E7EAF0', fontSize: '0.8125rem' }}>
                  Survey ingested
                </Typography>
                <Typography variant="caption" sx={{ color: '#6C7686', fontSize: '0.75rem' }}>
                  Existing survey validated
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon sx={{ color: '#46B98A', fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#E7EAF0', fontSize: '0.8125rem' }}>
                  Engine calculates
                </Typography>
                <Typography variant="caption" sx={{ color: '#6C7686', fontSize: '0.75rem' }}>
                  Revision C generated
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAccepted1840 ? (
                <CheckCircleOutlinedIcon sx={{ color: '#46B98A', fontSize: '1.1rem' }} />
              ) : (
                <ErrorOutlineOutlinedIcon sx={{ color: '#E4695E', fontSize: '1.1rem' }} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isAccepted1840 ? '#46B98A' : '#E4695E', fontSize: '0.8125rem' }}>
                  Validation checks
                </Typography>
                <Typography variant="caption" sx={{ color: '#6C7686', fontSize: '0.75rem' }}>
                  {isAccepted1840 ? 'All items accepted with notes' : '22 pass · 4 warnings · 1 review'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberOutlinedIcon sx={{ color: isAccepted1840 ? '#46B98A' : '#6C7686', fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isAccepted1840 ? '#E7EAF0' : '#9AA3B2', fontSize: '0.8125rem' }}>
                  Engineer approves
                </Typography>
                <Typography variant="caption" sx={{ color: '#6C7686', fontSize: '0.75rem' }}>
                  {isAccepted1840 ? 'Ready for CAD sheet issuance' : 'Blocked until review is cleared'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Main Visual Profile / Alignment / Cross-section Card */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            {/* View Switcher Tabs */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2.5, borderBottom: '1px solid #1B2029', pb: 1.5, overflowX: 'auto', '& > *': { flexShrink: 0 } }}>
              {(['Longitudinal profile', 'Horizontal alignment', 'Cross-section'] as const).map(tab => (
                <Button
                  key={tab}
                  size="small"
                  onClick={() => setActiveDesignTab(tab)}
                  sx={{
                    px: 1.8,
                    py: 0.5,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    color: activeDesignTab === tab ? '#E7EAF0' : '#6C7686',
                    backgroundColor: activeDesignTab === tab ? '#1B2029' : 'transparent',
                    '&:hover': { backgroundColor: activeDesignTab === tab ? '#1B2029' : 'rgba(255,255,255,0.02)' },
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', mb: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 14, height: 2, backgroundColor: '#5B8DEF' }} />
                <Typography sx={{ fontSize: '0.71875rem', color: '#9AA3B2' }}>Existing ground</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 14, height: 2, backgroundColor: '#E3A948' }} />
                <Typography sx={{ fontSize: '0.71875rem', color: '#9AA3B2' }}>Proposed profile</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#E4695E' }} />
                <Typography sx={{ fontSize: '0.71875rem', color: '#E4695E' }}>Flagged for review</Typography>
              </Box>
            </Box>

            {/* Profile Chart Canvas */}
            <Box
              sx={{
                width: '100%',
                height: { xs: 220, sm: 250 },
                backgroundColor: '#080A0E',
                borderRadius: '8px',
                border: '1px solid #1B2029',
                position: 'relative',
                overflow: 'hidden',
                mb: 2.5,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 700 250" preserveAspectRatio="none">
                {/* Horizontal Grid */}
                <line x1="40" y1="30" x2="680" y2="30" stroke="#1B2029" strokeDasharray="3,3" />
                <line x1="40" y1="80" x2="680" y2="80" stroke="#1B2029" strokeDasharray="3,3" />
                <line x1="40" y1="130" x2="680" y2="130" stroke="#1B2029" strokeDasharray="3,3" />
                <line x1="40" y1="180" x2="680" y2="180" stroke="#1B2029" strokeDasharray="3,3" />
                <line x1="40" y1="220" x2="680" y2="220" stroke="#1B2029" />

                <text x="15" y="34" fill="#6C7686" fontSize="11" fontFamily="monospace">275</text>
                <text x="15" y="84" fill="#6C7686" fontSize="11" fontFamily="monospace">266</text>
                <text x="15" y="134" fill="#6C7686" fontSize="11" fontFamily="monospace">257</text>
                <text x="15" y="184" fill="#6C7686" fontSize="11" fontFamily="monospace">248</text>

                {/* Existing Ground (Blue line) */}
                <polyline
                  points="40,190 120,165 200,140 280,110 360,75 420,130 500,170 580,145 680,120"
                  fill="none"
                  stroke="#5B8DEF"
                  strokeWidth="2.2"
                />

                {/* Proposed Design Grade Line (Orange line) */}
                <polyline
                  points="40,185 120,160 220,135 320,110 380,68 440,145 520,155 600,138 680,118"
                  fill="none"
                  stroke="#E3A948"
                  strokeWidth="2.2"
                />

                {/* Annotations */}
                <text x="310" y="150" fill="#6C7686" fontSize="11" fontFamily="sans-serif">CUT through the ridge</text>
                <text x="470" y="195" fill="#6C7686" fontSize="11" fontFamily="sans-serif">FILL across the valley</text>

                {/* Flagged Review Point at Ch 1+840 */}
                <circle cx="380" cy="68" r="5" fill="#E4695E" stroke="#FFFFFF" strokeWidth="1.5" />
                <line x1="380" y1="68" x2="415" y2="40" stroke="#E4695E" strokeWidth="1.2" />
                <rect x="420" y="28" width="112" height="21" rx="3" fill="#2A1B18" stroke="#E4695E" strokeWidth="1" />
                <text x="426" y="42" fill="#EE8B82" fontSize="11" fontWeight="700" fontFamily="sans-serif">Ch 1+840 · 9.2 %</text>

                {/* X Axis Chainage */}
                <text x="40" y="238" fill="#6C7686" fontSize="11" fontFamily="sans-serif">0+000</text>
                <text x="180" y="238" fill="#6C7686" fontSize="11" fontFamily="sans-serif">0+800</text>
                <text x="320" y="238" fill="#6C7686" fontSize="11" fontFamily="sans-serif">1+650</text>
                <text x="480" y="238" fill="#6C7686" fontSize="11" fontFamily="sans-serif">2+400</text>
                <text x="640" y="238" fill="#6C7686" fontSize="11" fontFamily="sans-serif">3+200</text>
              </svg>


            </Box>

            {/* Gradient Segments Table */}
            <TableContainer sx={{ border: 'none', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 420 }}>
                <TableHead sx={{ backgroundColor: '#080A0E' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>CHAINAGE</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>GRADIENT</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>RESULT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_GRADIENT_SEGMENTS.map((seg, idx) => {
                    const isReview = seg.result === 'Review required';
                    return (
                      <TableRow key={idx} sx={{ backgroundColor: isReview ? 'rgba(239, 68, 68, 0.05)' : 'transparent', '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: '#E7EAF0', fontWeight: 500, fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                          {seg.chainage}
                        </TableCell>
                        <TableCell sx={{ color: isReview ? '#E4695E' : '#C3C9D4', fontWeight: isReview ? 700 : 500, fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                          {seg.gradient}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isReview && isAccepted1840 ? 'Accepted (Note)' : seg.result}
                            size="small"
                            sx={{
                              backgroundColor: (isReview && !isAccepted1840) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: (isReview && !isAccepted1840) ? '#E4695E' : '#64C9A1',
                              fontWeight: 600,
                              fontSize: '0.75rem',
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
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Validation
              </Typography>
              <Typography variant="caption" sx={{ color: '#6C7686', fontWeight: 600, letterSpacing: '0.04em' }}>
                27 CHECKS
              </Typography>
            </Box>

            {/* 3 Metric Badges */}
            <Grid container spacing={1} sx={{ mb: 2.5 }}>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#64C9A1' }}>22</Typography>
                  <Typography variant="caption" sx={{ color: '#46B98A', fontWeight: 600, fontSize: '0.75rem' }}>PASS</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#EFC06A' }}>4</Typography>
                  <Typography variant="caption" sx={{ color: '#E3A948', fontWeight: 600, fontSize: '0.75rem' }}>WARNING</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: '8px', backgroundColor: isAccepted1840 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isAccepted1840 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: isAccepted1840 ? '#64C9A1' : '#E4695E' }}>{isAccepted1840 ? 0 : 1}</Typography>
                  <Typography variant="caption" sx={{ color: isAccepted1840 ? '#46B98A' : '#E4695E', fontWeight: 600, fontSize: '0.75rem' }}>REVIEW</Typography>
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
                      borderRadius: '8px',
                      border: '1px solid #1B2029',
                      backgroundColor: '#0C1017',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 600, color: '#E7EAF0', fontSize: '0.8125rem', flex: '1 1 auto' }}>
                        {issue.title}
                      </Typography>
                      <Chip
                        label={isItemAccepted ? 'Accepted' : issue.severity}
                        size="small"
                        sx={{
                          backgroundColor: isItemAccepted
                            ? 'rgba(70,185,138,0.12)'
                            : isReview
                              ? 'rgba(228,105,94,0.12)'
                              : 'rgba(227,169,72,0.12)',
                          color: isItemAccepted ? '#64C9A1' : isReview ? '#EE8B82' : '#EFC06A',
                          border: 'none',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#9AA3B2', fontSize: '0.75rem', display: 'block' }}>
                      {issue.description}
                    </Typography>
                    {issue.engineerNote && (
                      <Typography variant="caption" sx={{ color: '#5B8DEF', fontSize: '0.75rem', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
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
                  backgroundColor: '#3E68BE',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  py: 1,
                  '&:hover': { backgroundColor: '#7AA3F5' },
                }}
              >
                Accept Ch 1+840 with engineer note
              </Button>
            ) : (
              <Box sx={{ p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #46B98A', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64C9A1', fontWeight: 600, display: 'block' }}>
                  ✓ Review item cleared with registered engineer note
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Engineer Note Acceptance Modal */}
      <Dialog open={openNoteModal} onClose={() => setOpenNoteModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#111827', border: '1px solid #1B2029' } }}>
        <DialogTitle sx={{ color: '#E7EAF0', fontWeight: 600 }}>
          Accept Ch 1+840 Grade Exceedance
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2 }}>
            The calculated gradient is +9.20% over 100 metres (maximum standard is 8.00%). A registered engineer may accept this variant with an official design review note.
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={engineerNote}
            onChange={e => setEngineerNote(e.target.value)}
            sx={{ backgroundColor: '#0A0C11', borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #1B2029' }}>
          <Button onClick={() => setOpenNoteModal(false)} sx={{ color: '#9AA3B2' }}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAccept} sx={{}}>
            Confirm & Sign Off
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
