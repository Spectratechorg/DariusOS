import React from 'react';
import { Box, Card, Typography, Grid, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { MOCK_ROUTE_OPTIONS } from '../data/mockData';

export const RoutesMonitoringView: React.FC = () => {
  const { 
    selectedRouteId, 
    setSelectedRouteId, 
    activeTolerance, 
    setActiveTolerance, 
    asBuiltRows, 
    setSnackbarMessage 
  } = useProject();

  const subTabs = ['Drone capture', 'Data pipeline', '3D terrain', 'Route analysis', 'Drainage mapping', 'Monitoring', 'Dashboards'];

  const dronePipeline = [
    { title: 'Flight data uploaded', status: 'Done', color: '#10B981' },
    { title: 'Imagery and LiDAR ingested', status: 'Done', color: '#10B981' },
    { title: 'Point cloud and elevation model', status: 'Done', color: '#10B981' },
    { title: 'Ground classified and cleaned', status: 'Done', color: '#10B981' },
    { title: 'Compared with design Rev C', status: 'Complete', color: '#38BDF8' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Sub-tabs Navigation */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', borderBottom: '1px solid #1E293B', pb: 1 }}>
        {subTabs.map(tab => {
          const isActive = tab === 'Route analysis';
          return (
            <Button
              key={tab}
              size="small"
              sx={{
                px: 1.5,
                py: 0.4,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 1,
                color: isActive ? '#38BDF8' : '#64748B',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' },
              }}
            >
              {tab}
            </Button>
          );
        })}
      </Box>

      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Route Analysis Card */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Route analysis
              </Typography>
              <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 600, fontSize: '0.72rem' }}>
                Selected route feeds the design engine
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              Each option is scored on distance, cut and fill volume and estimated cost. Choose one and the design regenerates.
            </Typography>

            <Grid container spacing={2}>
              {MOCK_ROUTE_OPTIONS.map(opt => {
                const isSelected = opt.id === selectedRouteId;
                return (
                  <Grid item xs={12} md={4} key={opt.id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: isSelected ? '1.5px solid #38BDF8' : '1px solid #1E293B',
                        backgroundColor: isSelected ? '#0F1E38' : '#0F1626',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                            {opt.name}
                          </Typography>
                          <Chip
                            label={isSelected ? 'Selected' : 'Alternative'}
                            size="small"
                            sx={{
                              backgroundColor: isSelected ? '#10B981' : '#1E293B',
                              color: isSelected ? '#0B0F19' : '#94A3B8',
                              fontWeight: 700,
                              fontSize: '0.65rem',
                            }}
                          />
                        </Box>

                        <Grid container spacing={1} sx={{ mb: 1.5 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.65rem' }}>DISTANCE</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC', fontFamily: 'monospace' }}>
                              {opt.distanceKm.toFixed(2)} km
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.65rem' }}>EST. COST</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC', fontFamily: 'monospace' }}>
                              ₦{opt.estCostM}M
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1} sx={{ mb: 2, borderTop: '1px solid #1E293B', pt: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.65rem' }}>CUT</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>
                              {opt.cutM3.toLocaleString()} m³
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.65rem' }}>FILL</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>
                              {opt.fillM3.toLocaleString()} m³
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Button
                        fullWidth
                        size="small"
                        variant={isSelected ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelectedRouteId(opt.id);
                          setSnackbarMessage(`Switched active route to "${opt.name}". Design engine updated.`);
                        }}
                        sx={{
                          backgroundColor: isSelected ? '#2563EB' : 'transparent',
                          borderColor: '#334155',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          '&:hover': { backgroundColor: isSelected ? '#1D4ED8' : '#1E293B' },
                        }}
                      >
                        {isSelected ? 'Selected' : `Use ${opt.name.toLowerCase()}`}
                      </Button>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>

          {/* As-Built Compared with Approved Design */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                As-built compared with approved design
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>TOLERANCE</Typography>
                {(['0.5 m', '1 m', '2 m'] as const).map(tol => (
                  <Chip
                    key={tol}
                    label={tol}
                    size="small"
                    onClick={() => setActiveTolerance(tol)}
                    sx={{
                      backgroundColor: activeTolerance === tol ? '#2563EB' : '#1E293B',
                      color: '#F8FAFC',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Latest re-survey against design Rev C. Flag when the gap exceeds the tolerance.
            </Typography>

            {/* Profile Comparison Canvas */}
            <Box sx={{ height: 140, backgroundColor: '#090D16', borderRadius: 1.5, border: '1px solid #1E293B', p: 1, mb: 2.5, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 650 120" preserveAspectRatio="none">
                <line x1="30" y1="20" x2="630" y2="20" stroke="#162238" strokeDasharray="3,3" />
                <line x1="30" y1="60" x2="630" y2="60" stroke="#162238" strokeDasharray="3,3" />
                <line x1="30" y1="100" x2="630" y2="100" stroke="#162238" strokeDasharray="3,3" />

                {/* Approved Design Profile (Orange Line) */}
                <polyline
                  points="30,80 120,65 240,45 360,30 480,85 630,70"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />

                {/* As-Built Profile (Blue Dashed Line) */}
                <polyline
                  points="30,82 120,68 240,55 360,65 480,82 630,72"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                {/* Flagged Point at Ch 1+840 (x=360) */}
                <circle cx="360" cy="65" r="4" fill="#EF4444" />
                <line x1="360" y1="30" x2="360" y2="65" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2,2" />
              </svg>

              <Box sx={{ position: 'absolute', bottom: 6, left: 12, display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 12, height: 2, backgroundColor: '#F59E0B' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem' }}>Approved design</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 12, height: 2, backgroundColor: '#38BDF8', borderBottom: '1px dashed #38BDF8' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem' }}>As-built</Typography>
                </Box>
              </Box>
            </Box>

            {/* Deviation Table */}
            <TableContainer sx={{ borderRadius: 1, border: '1px solid #1E293B' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#0A0E17' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>CHAINAGE</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>APPROVED (M)</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>AS-BUILT (M)</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>DEVIATION (M)</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>RESULT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asBuiltRows.map(row => {
                    const isFlagged = row.status === 'Flagged';
                    const isWatch = row.status === 'Watch';
                    return (
                      <TableRow key={row.chainage} sx={{ backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.06)' : 'transparent', '&:hover': { backgroundColor: '#131D2E' } }}>
                        <TableCell sx={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.78rem', fontFamily: 'monospace' }}>
                          {row.chainage}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                          {row.approvedM.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                          {row.asBuiltM.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: isFlagged ? '#EF4444' : isWatch ? '#F59E0B' : '#34D399', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'monospace' }}>
                          {row.deviationM > 0 ? `+${row.deviationM.toFixed(1)}` : row.deviationM.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.15)' : isWatch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isFlagged ? '#EF4444' : isWatch ? '#FBBF24' : '#34D399',
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
          {/* Drone Data Pipeline */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Drone data pipeline
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {dronePipeline.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.6,
                    borderBottom: '1px solid #1A2436',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
                    {step.title}
                  </Typography>
                  <Chip
                    label={step.status}
                    size="small"
                    sx={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                      fontWeight: 600,
                      fontSize: '0.68rem',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Data Sources */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Data sources
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.825rem' }}>
                  Drone imagery and LiDAR
                </Typography>
                <Chip label="Primary" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.68rem' }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.825rem' }}>
                  Satellite imagery
                </Typography>
                <Chip label="Backup" size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontWeight: 600, fontSize: '0.68rem' }} />
              </Box>
            </Box>
          </Card>

          {/* Next Re-Survey */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Next re-survey
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2, lineHeight: 1.45 }}>
              Flight timing is set by Mastodon. Permits, airspace approvals, weather and drone availability decide whether a flight goes ahead.
            </Typography>
            <Chip
              label="Permit status needed"
              size="small"
              sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontWeight: 600, fontSize: '0.72rem' }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
