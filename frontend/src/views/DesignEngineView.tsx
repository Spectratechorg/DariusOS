import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  Chip, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useProject } from '../context/ProjectContext';
import { MOCK_GRADIENT_SEGMENTS } from '../data/mockData';
import { VIZ_TOKENS } from '../tokens';

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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Top Engine Workflow Status */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#0A0E17', border: '1px solid #1E293B' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <CheckCircleOutlinedIcon sx={{ color: '#16A34A', fontSize: '1.2rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
                  Design criteria
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  FMW&H / AASHTO applied
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <CheckCircleOutlinedIcon sx={{ color: '#16A34A', fontSize: '1.2rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
                  Engine calculates
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  Revision C geometry generated
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              {isAccepted1840 ? (
                <CheckCircleOutlinedIcon sx={{ color: '#16A34A', fontSize: '1.2rem' }} />
              ) : (
                <ErrorOutlineOutlinedIcon sx={{ color: '#DC2626', fontSize: '1.2rem' }} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isAccepted1840 ? '#16A34A' : '#DC2626', fontSize: '0.8rem' }}>
                  Validation checks
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  {isAccepted1840 ? 'All 27 checks accepted' : '22 pass · 4 warnings · 1 review'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <WarningAmberOutlinedIcon sx={{ color: isAccepted1840 ? '#16A34A' : '#F59E0B', fontSize: '1.2rem' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isAccepted1840 ? '#F8FAFC' : '#94A3B8', fontSize: '0.8rem' }}>
                  Engineer approval
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  {isAccepted1840 ? 'Ready for CAD sheet issuance' : 'Blocked until review is signed off'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            {/* View Switcher Tabs */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '1px solid #1E293B', pb: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['Longitudinal profile', 'Horizontal alignment', 'Cross-section'] as const).map((tab) => (
                  <Button
                    key={tab}
                    size="small"
                    onClick={() => setActiveDesignTab(tab)}
                    sx={{
                      px: 1.8,
                      py: 0.5,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 1.5,
                      color: activeDesignTab === tab ? '#F8FAFC' : '#64748B',
                      backgroundColor: activeDesignTab === tab ? '#1E293B' : 'transparent',
                      border: activeDesignTab === tab ? '1px solid #38BDF8' : '1px solid transparent',
                      '&:hover': { backgroundColor: activeDesignTab === tab ? '#1E293B' : 'rgba(255,255,255,0.03)' },
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              <Chip
                label="REV C · LIVE GEOMETRY"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38BDF8',
                }}
              />
            </Box>

            {/* Profile Chart Canvas */}
            <Box
              sx={{
                width: '100%',
                height: 290,
                backgroundColor: '#070B14',
                borderRadius: 1.5,
                border: '1px solid #1E293B',
                position: 'relative',
                overflow: 'hidden',
                mb: 2.5,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 700 290" style={{ display: 'block' }}>
                <defs>
                  <pattern id="engCutHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#D9534F" strokeWidth="1.2" />
                  </pattern>
                  <pattern id="engFillDots" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="1.2" fill="#2F80ED" />
                  </pattern>
                </defs>

                {/* ============================================== */}
                {/* TAB 1: LONGITUDINAL PROFILE                    */}
                {/* ============================================== */}
                {activeDesignTab === 'Longitudinal profile' && (
                  <g>
                    {/* Vertical Exaggeration Label */}
                    <text x="40" y="22" fill="#38BDF8" fontSize="8" fontWeight="700" fontFamily="monospace">
                      LONGITUDINAL PROFILE (V 10x : H 1x)
                    </text>

                    {/* Horizontal Grid */}
                    <line x1="40" y1="35" x2="680" y2="35" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                    <line x1="40" y1="75" x2="680" y2="75" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                    <line x1="40" y1="115" x2="680" y2="115" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                    <line x1="40" y1="155" x2="680" y2="155" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                    <line x1="40" y1="195" x2="680" y2="195" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

                    {/* Datum labels */}
                    <text x="15" y="39" fill="#64748B" fontSize="8.5" fontFamily="monospace">304.0</text>
                    <text x="15" y="79" fill="#64748B" fontSize="8.5" fontFamily="monospace">303.0</text>
                    <text x="15" y="119" fill="#64748B" fontSize="8.5" fontFamily="monospace">302.0</text>
                    <text x="15" y="159" fill="#64748B" fontSize="8.5" fontFamily="monospace">301.0</text>
                    <text x="15" y="199" fill="#64748B" fontSize="8.5" fontFamily="monospace">300.0</text>

                    {/* Cut / Fill regions with Hatching */}
                    {/* Cut polygon */}
                    <polygon
                      points="40,195 120,165 200,135 280,105 380,68 440,115 440,135 380,88 280,120 200,150 120,175 40,190"
                      fill="url(#engCutHatch)"
                    />
                    <polygon
                      points="40,195 120,165 200,135 280,105 380,68 440,115 440,135 380,88 280,120 200,150 120,175 40,190"
                      fill={VIZ_TOKENS.colors.cutFill30}
                    />

                    {/* Fill polygon */}
                    <polygon
                      points="440,135 520,155 600,140 680,120 680,115 600,130 520,145 440,115"
                      fill="url(#engFillDots)"
                    />
                    <polygon
                      points="440,135 520,155 600,140 680,120 680,115 600,130 520,145 440,115"
                      fill={VIZ_TOKENS.colors.fillFill30}
                    />

                    {/* Existing Ground (1.5px Earth Brown #8B6F47) */}
                    <polyline
                      points="40,195 120,165 200,135 280,105 380,68 440,135 520,155 600,140 680,120"
                      fill="none"
                      stroke={VIZ_TOKENS.colors.groundExisting}
                      strokeWidth="1.5"
                    />

                    {/* Proposed Finished Grade Line (2.5px Bold Centerline #F8FAFC) */}
                    <polyline
                      points="40,190 120,175 200,150 280,120 380,88 440,115 520,145 600,130 680,115"
                      fill="none"
                      stroke={VIZ_TOKENS.colors.gradeFinishedDark}
                      strokeWidth="2.5"
                    />

                    {/* Flagged Point at Ch 1+840 */}
                    <circle cx="380" cy="88" r="5" fill="#F59E0B" stroke="#F8FAFC" strokeWidth="1.5" />
                    <line x1="380" y1="88" x2="415" y2="45" stroke="#F59E0B" strokeWidth="1.2" />
                    <rect x="420" y="32" width="135" height="22" rx="3" fill="#1E1515" stroke="#F59E0B" strokeWidth="1.2" />
                    <text x="428" y="47" fill="#FBBF24" fontSize="8.5" fontWeight="700" fontFamily="monospace">
                      {'Ch 1+840 · 9.2% > 8.0% limit'}
                    </text>

                    {/* Bottom Station Chainage Band */}
                    <line x1="40" y1="230" x2="680" y2="230" stroke="#1E293B" strokeWidth="1" />
                    {[
                      { ch: '0+000', x: 40 },
                      { ch: '0+800', x: 180 },
                      { ch: '1+650', x: 340 },
                      { ch: '2+400', x: 500 },
                      { ch: '3+200', x: 660 },
                    ].map(st => (
                      <g key={st.ch}>
                        <line x1={st.x} y1="225" x2={st.x} y2="235" stroke="#64748B" strokeWidth="1" />
                        <text x={st.x - 14} y="248" fill="#94A3B8" fontSize="8" fontFamily="monospace">{st.ch}</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* ============================================== */}
                {/* TAB 2: HORIZONTAL ALIGNMENT                    */}
                {/* ============================================== */}
                {activeDesignTab === 'Horizontal alignment' && (
                  <g>
                    <text x="40" y="25" fill="#38BDF8" fontSize="8" fontWeight="700" fontFamily="monospace">
                      HORIZONTAL ALIGNMENT & CURVE GEOMETRY
                    </text>
                    {/* ROW Limits */}
                    <path d="M 60,180 Q 240,110 380,80 T 540,50 T 660,40" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="5,4" />
                    <path d="M 60,220 Q 240,150 380,120 T 540,90 T 660,80" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="5,4" />
                    {/* Road Centerline */}
                    <path d="M 60,200 Q 240,130 380,100 T 540,70 T 660,60" fill="none" stroke="#F8FAFC" strokeWidth="2.5" />
                    {/* Curve center markers */}
                    <circle cx="60" cy="200" r="4" fill="#16A34A" />
                    <text x="50" y="225" fill="#F8FAFC" fontSize="8" fontFamily="monospace">TS 0+000</text>
                    <circle cx="380" cy="100" r="4" fill="#38BDF8" />
                    <text x="360" y="85" fill="#38BDF8" fontSize="8" fontFamily="monospace">Curve C1 · R 260m</text>
                    <circle cx="660" cy="60" r="4" fill="#DC2626" />
                    <text x="630" y="50" fill="#F8FAFC" fontSize="8" fontFamily="monospace">ST 0+200</text>
                  </g>
                )}

                {/* ============================================== */}
                {/* TAB 3: CROSS-SECTION                           */}
                {/* ============================================== */}
                {activeDesignTab === 'Cross-section' && (
                  <g transform="translate(100, 30)">
                    <text x="0" y="10" fill="#38BDF8" fontSize="8" fontWeight="700" fontFamily="monospace">
                      TYPICAL PAVEMENT SECTION (7.0m CW + 2x 1.5m SH)
                    </text>
                    {/* Natural Ground */}
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#8B6F47" strokeWidth="1.5" strokeDasharray="4,2" />
                    <text x="410" y="84" fill="#8B6F47" fontSize="7.5" fontFamily="monospace">EXISTING GROUND</text>
                    {/* Side Ditches */}
                    <polygon points="40,80 50,110 70,110 80,80" fill="#1E293B" stroke="#0284C7" strokeWidth="1" />
                    <polygon points="420,80 430,110 450,110 460,80" fill="#1E293B" stroke="#0284C7" strokeWidth="1" />
                    {/* Pavement stack */}
                    <g transform="translate(100, 70)">
                      <polygon points="0,8 150,0 300,8 300,14 150,6 0,14" fill={VIZ_TOKENS.colors.pavementWearing} stroke="#334155" strokeWidth="0.5" />
                      <polygon points="0,14 150,6 300,14 300,28 150,20 0,28" fill={VIZ_TOKENS.colors.pavementBase} stroke="#334155" strokeWidth="0.5" />
                      <polygon points="0,28 150,20 300,28 300,44 150,36 0,44" fill={VIZ_TOKENS.colors.pavementSubbase} stroke="#334155" strokeWidth="0.5" />
                      <line x1="150" y1="-8" x2="150" y2="48" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4,2" />
                      <text x="150" y="-12" fill="#F8FAFC" fontSize="8" fontWeight="700" fontFamily="monospace" textAnchor="middle">CL</text>
                    </g>
                  </g>
                )}
              </svg>

              {/* Legend Bottom */}
              <Box sx={{ position: 'absolute', bottom: 10, left: 16, display: 'flex', gap: 2.5, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2, backgroundColor: '#8B6F47' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Existing ground</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2.5, backgroundColor: '#F8FAFC' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Finished grade</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontSize: '0.7rem' }}>Review required</Typography>
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
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>ENGINEERING STATUS</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1, textAlign: 'right' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_GRADIENT_SEGMENTS.map((seg, idx) => {
                    const isReview = seg.result === 'Review required';
                    return (
                      <TableRow
                        key={idx}
                        sx={{
                          backgroundColor: isReview ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                          '&:hover': { backgroundColor: '#131D2E' },
                        }}
                      >
                        <TableCell sx={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {seg.chainage}
                        </TableCell>
                        <TableCell sx={{ color: isReview ? '#F59E0B' : '#CBD5E1', fontWeight: isReview ? 700 : 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {seg.gradient}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isReview && isAccepted1840 ? 'Accepted (Note)' : seg.result}
                            size="small"
                            sx={{
                              backgroundColor: (isReview && !isAccepted1840) ? 'rgba(245, 158, 11, 0.15)' : 'rgba(22, 163, 74, 0.15)',
                              color: (isReview && !isAccepted1840) ? '#FBBF24' : '#4ADE80',
                              fontWeight: 600,
                              fontSize: '0.68rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {isReview && !isAccepted1840 && (
                            <Button
                              size="small"
                              startIcon={<EditNoteOutlinedIcon />}
                              onClick={() => setOpenNoteModal(true)}
                              sx={{
                                color: '#38BDF8',
                                fontSize: '0.72rem',
                                textTransform: 'none',
                                py: 0.2,
                              }}
                            >
                              Add Sign-Off Note
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Right Column (1/3): Validation Checks & Criteria */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Engineering Validation
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontFamily: VIZ_TOKENS.typography.monoFont }}>
                27 CHECKS
              </Typography>
            </Box>

            {/* 3 Metric Badges */}
            <Grid container spacing={1} sx={{ mb: 2.5 }}>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.25)', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#4ADE80', fontFamily: 'monospace' }}>22</Typography>
                  <Typography variant="caption" sx={{ color: '#4ADE80', fontSize: '0.68rem' }}>Pass</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#FBBF24', fontFamily: 'monospace' }}>4</Typography>
                  <Typography variant="caption" sx={{ color: '#FBBF24', fontSize: '0.68rem' }}>Warning</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: isAccepted1840 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)', border: `1px solid ${isAccepted1840 ? 'rgba(22, 163, 74, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: isAccepted1840 ? '#4ADE80' : '#F87171', fontFamily: 'monospace' }}>
                    {isAccepted1840 ? '0' : '1'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isAccepted1840 ? '#4ADE80' : '#F87171', fontSize: '0.68rem' }}>
                    {isAccepted1840 ? 'Signed' : 'Review'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Engineer Sign-Off Box */}
            <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0A0E1A', border: '1px solid #1E293B', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5, fontWeight: 700 }}>
                CRITICAL REVIEW ITEM (CH 1+840)
              </Typography>
              <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.825rem', mb: 0.5 }}>
                Vertical grade 9.2% exceeds AASHTO 8.0% design limit
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1.5, lineHeight: 1.35 }}>
                Topography requires either 420m curve easing or registered engineer sign-off acknowledging wearing course skid resistance.
              </Typography>

              {isAccepted1840 ? (
                <Box sx={{ p: 1, borderRadius: 1, backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: '#4ADE80', fontWeight: 600, display: 'block' }}>
                    ✓ SIGNED OFF BY REGISTERED ENGINEER
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#CBD5E1', fontStyle: 'italic', display: 'block', fontSize: '0.72rem' }}>
                    "{engineerNote}"
                  </Typography>
                </Box>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setOpenNoteModal(true)}
                  sx={{
                    backgroundColor: '#F59E0B',
                    color: '#0A0E17',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#D97706' },
                    fontSize: '0.78rem',
                  }}
                >
                  Sign Off With Engineer Note
                </Button>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Engineer Sign-off Dialog */}
      <Dialog
        open={openNoteModal}
        onClose={() => setOpenNoteModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#0F1626', border: '1px solid #334155' } }}
      >
        <DialogTitle sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem', borderBottom: '1px solid #1E293B' }}>
          Registered Engineer Sign-off: Station Ch 1+840
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2, fontSize: '0.825rem' }}>
            Enter rationale for accepting 9.2% longitudinal slope over 100m tangent crest. This justification will be stamped into Revision C CAD sheet metadata and audit logs.
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={engineerNote}
            onChange={(e) => setEngineerNote(e.target.value)}
            sx={{
              backgroundColor: '#090D16',
              '& .MuiInputBase-root': { color: '#F8FAFC', fontSize: '0.85rem' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
          <Button onClick={() => setOpenNoteModal(false)} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAccept}
            sx={{
              backgroundColor: '#16A34A',
              color: '#F8FAFC',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#15803D' },
            }}
          >
            Confirm & Sign Off
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
