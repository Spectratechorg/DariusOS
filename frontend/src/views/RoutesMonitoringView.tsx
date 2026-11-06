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
    { title: 'Flight data uploaded', status: 'Done', color: '#46B98A' },
    { title: 'Imagery and LiDAR ingested', status: 'Done', color: '#46B98A' },
    { title: 'Point cloud and elevation model', status: 'Done', color: '#46B98A' },
    { title: 'Ground classified and cleaned', status: 'Done', color: '#46B98A' },
    { title: 'Compared with design Rev C', status: 'Complete', color: '#5B8DEF' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Sub-tabs Navigation */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', borderBottom: '1px solid #1B2029', pb: 1, '& > *': { flexShrink: 0, whiteSpace: 'nowrap' } }}>
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
                color: isActive ? '#5B8DEF' : '#6C7686',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' },
              }}
            >
              {tab}
            </Button>
          );
        })}
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Route Analysis Card */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Route analysis
              </Typography>
              <Typography variant="caption" sx={{ color: '#5B8DEF', fontWeight: 600, fontSize: '0.75rem' }}>
                Selected route feeds the design engine
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2.5 }}>
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
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #5B8DEF' : '1px solid #1B2029',
                        backgroundColor: isSelected ? 'rgba(91,141,239,0.10)' : '#0C1017',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#E7EAF0' }}>
                            {opt.name}
                          </Typography>
                          <Chip
                            label={isSelected ? 'Selected' : 'Alternative'}
                            size="small"
                            sx={{
                              backgroundColor: isSelected ? '#46B98A' : '#1B2029',
                              color: isSelected ? '#0A0C11' : '#9AA3B2',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>

                        <Grid container spacing={1} sx={{ mb: 1.5 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#6C7686', display: 'block', fontSize: '0.75rem' }}>DISTANCE</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#E7EAF0', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                              {opt.distanceKm.toFixed(2)} km
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#6C7686', display: 'block', fontSize: '0.75rem' }}>EST. COST</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#E7EAF0', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                              ₦{opt.estCostM}M
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1} sx={{ mb: 2, borderTop: '1px solid #1B2029', pt: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#6C7686', display: 'block', fontSize: '0.75rem' }}>CUT</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#9AA3B2', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                              {opt.cutM3.toLocaleString()} m³
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#6C7686', display: 'block', fontSize: '0.75rem' }}>FILL</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#9AA3B2', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
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
                          backgroundColor: isSelected ? '#3E68BE' : 'transparent',
                          borderColor: '#252B36',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          '&:hover': { backgroundColor: isSelected ? '#4A7AD1' : '#1B2029' },
                        }}
                      >
                        {isSelected ? 'Selected' : `Use ${opt.name}`}
                      </Button>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>

          {/* As-Built Compared with Approved Design */}
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                As-built compared with approved design
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#6C7686', fontSize: '0.75rem' }}>TOLERANCE</Typography>
                {(['0.5 m', '1 m', '2 m'] as const).map(tol => (
                  <Chip
                    key={tol}
                    label={tol}
                    size="small"
                    onClick={() => setActiveTolerance(tol)}
                    sx={{
                      backgroundColor: activeTolerance === tol ? '#5B8DEF' : '#1B2029',
                      color: '#E7EAF0',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2 }}>
              Latest re-survey against design Rev C. Flag when the gap exceeds the tolerance.
            </Typography>

            {/* Profile Comparison Canvas */}
            <Box sx={{ height: 140, backgroundColor: '#080A0E', borderRadius: '8px', border: '1px solid #1B2029', p: 1, mb: 2.5, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 650 120" preserveAspectRatio="none">
                <line x1="30" y1="20" x2="630" y2="20" stroke="#1B2029" strokeDasharray="3,3" />
                <line x1="30" y1="60" x2="630" y2="60" stroke="#1B2029" strokeDasharray="3,3" />
                <line x1="30" y1="100" x2="630" y2="100" stroke="#1B2029" strokeDasharray="3,3" />

                {/* Approved Design Profile (Orange Line) */}
                <polyline
                  points="30,80 120,65 240,45 360,30 480,85 630,70"
                  fill="none"
                  stroke="#E3A948"
                  strokeWidth="2"
                />

                {/* As-Built Profile (Blue Dashed Line) */}
                <polyline
                  points="30,82 120,68 240,55 360,65 480,82 630,72"
                  fill="none"
                  stroke="#5B8DEF"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                {/* Flagged Point at Ch 1+840 (x=360) */}
                <circle cx="360" cy="65" r="4" fill="#E4695E" />
                <line x1="360" y1="30" x2="360" y2="65" stroke="#E4695E" strokeWidth="1.5" strokeDasharray="2,2" />
              </svg>

              <Box sx={{ position: 'absolute', bottom: 6, left: 12, display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 12, height: 2, backgroundColor: '#E3A948' }} />
                  <Typography variant="caption" sx={{ color: '#9AA3B2', fontSize: '0.75rem' }}>Approved design</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 12, height: 2, backgroundColor: '#5B8DEF', borderBottom: '1px dashed #5B8DEF' }} />
                  <Typography variant="caption" sx={{ color: '#9AA3B2', fontSize: '0.75rem' }}>As-built</Typography>
                </Box>
              </Box>
            </Box>

            {/* Deviation Table */}
            <TableContainer sx={{ border: 'none', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead sx={{ backgroundColor: '#080A0E' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>CHAINAGE</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>APPROVED (M)</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>AS-BUILT (M)</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>DEVIATION (M)</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>RESULT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asBuiltRows.map(row => {
                    const isFlagged = row.status === 'Flagged';
                    const isWatch = row.status === 'Watch';
                    return (
                      <TableRow key={row.chainage} sx={{ backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.06)' : 'transparent', '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ color: '#E7EAF0', fontWeight: 500, fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                          {row.chainage}
                        </TableCell>
                        <TableCell sx={{ color: '#C3C9D4', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                          {row.approvedM.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: '#C3C9D4', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                          {row.asBuiltM.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: isFlagged ? '#E4695E' : isWatch ? '#E3A948' : '#64C9A1', fontWeight: 700, fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                          {row.deviationM > 0 ? `+${row.deviationM.toFixed(1)}` : row.deviationM.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.15)' : isWatch ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isFlagged ? '#E4695E' : isWatch ? '#EFC06A' : '#64C9A1',
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
          {/* Drone Data Pipeline */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
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
                    borderBottom: '1px solid #1B2029',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
                    {step.title}
                  </Typography>
                  <Chip
                    label={step.status}
                    size="small"
                    sx={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Data Sources */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Data sources
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
                  Drone imagery and LiDAR
                </Typography>
                <Chip label="Primary" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#64C9A1', fontWeight: 600, fontSize: '0.75rem' }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
                  Satellite imagery
                </Typography>
                <Chip label="Backup" size="small" sx={{ backgroundColor: '#1B2029', color: '#9AA3B2', fontWeight: 600, fontSize: '0.75rem' }} />
              </Box>
            </Box>
          </Card>

          {/* Next Re-Survey */}
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Next re-survey
            </Typography>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2, lineHeight: 1.45 }}>
              Flight timing is set by Mastodon. Permits, airspace approvals, weather and drone availability decide whether a flight goes ahead.
            </Typography>
            <Chip
              label="Permit status needed"
              size="small"
              sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#EFC06A', fontWeight: 600, fontSize: '0.75rem' }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
