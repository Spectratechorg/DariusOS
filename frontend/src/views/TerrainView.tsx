import React from 'react';
import { Box, Card, Typography, Grid, Button, LinearProgress } from '@mui/material';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import { useProject } from '../context/ProjectContext';

export const TerrainView: React.FC = () => {
  const { 
    terrainSummary, 
    activeTerrainTab, 
    setActiveTerrainTab 
  } = useProject();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Terrain Model Canvas Card */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Terrain model
              </Typography>
              <Box sx={{ display: 'flex', backgroundColor: '#0A0E17', borderRadius: 1.5, p: 0.3, border: '1px solid #1E293B' }}>
                {(['TIN', 'Contours', 'Alignment'] as const).map(tab => (
                  <Button
                    key={tab}
                    size="small"
                    onClick={() => setActiveTerrainTab(tab)}
                    sx={{
                      px: 1.5,
                      py: 0.3,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: activeTerrainTab === tab ? '#F8FAFC' : '#64748B',
                      backgroundColor: activeTerrainTab === tab ? '#1E293B' : 'transparent',
                      '&:hover': { backgroundColor: activeTerrainTab === tab ? '#1E293B' : 'rgba(255,255,255,0.02)' },
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* SVG Terrain Map Simulation */}
            <Box
              sx={{
                width: '100%',
                height: 320,
                backgroundColor: '#090D16',
                borderRadius: 1.5,
                border: '1px solid #1E293B',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* North Arrow */}
              <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748B' }}>
                <NavigationOutlinedIcon sx={{ fontSize: '1rem', color: '#94A3B8' }} />
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>N</Typography>
              </Box>

              <svg width="100%" height="100%" viewBox="0 0 700 320" preserveAspectRatio="none">
                {/* TIN Triangulation Mesh */}
                {(activeTerrainTab === 'TIN' || activeTerrainTab === 'Contours') && (
                  <g stroke="#162238" strokeWidth="0.8" fill="none">
                    <polygon points="50,260 120,200 180,240" />
                    <polygon points="120,200 180,240 240,160" />
                    <polygon points="180,240 240,160 310,210" />
                    <polygon points="240,160 310,210 380,140" />
                    <polygon points="310,210 380,140 450,180" />
                    <polygon points="380,140 450,180 520,110" />
                    <polygon points="450,180 520,110 590,130" />
                    <polygon points="520,110 590,130 650,80" />
                    {/* Ridge hill mass triangles */}
                    <polygon points="180,120 240,160 220,90" />
                    <polygon points="220,90 240,160 300,100" />
                    <polygon points="240,160 310,210 300,100" />
                    <polygon points="300,100 310,210 360,110" />
                    <polygon points="450,180 500,240 560,190" />
                    <polygon points="500,240 560,190 600,250" />
                  </g>
                )}

                {/* Contour Isohypses */}
                {(activeTerrainTab === 'Contours' || activeTerrainTab === 'TIN') && (
                  <g stroke="#263A5E" strokeWidth="1.2" fill="none">
                    {/* Hill 1 Contours */}
                    <ellipse cx="230" cy="140" rx="110" ry="60" />
                    <ellipse cx="230" cy="140" rx="80" ry="42" />
                    <ellipse cx="230" cy="140" rx="50" ry="26" />
                    <ellipse cx="230" cy="140" rx="24" ry="12" />
                    {/* Hill 2 Contours */}
                    <ellipse cx="530" cy="210" rx="120" ry="65" />
                    <ellipse cx="530" cy="210" rx="85" ry="45" />
                    <ellipse cx="530" cy="210" rx="55" ry="28" />
                  </g>
                )}

                {/* Contour Elevation Labels */}
                <text x="135" y="144" fill="#4B638A" fontSize="9" fontFamily="monospace">248</text>
                <text x="160" y="144" fill="#4B638A" fontSize="9" fontFamily="monospace">254</text>
                <text x="190" y="144" fill="#4B638A" fontSize="9" fontFamily="monospace">260</text>
                <text x="220" y="143" fill="#60A5FA" fontSize="9" fontFamily="monospace">268</text>

                <text x="450" y="214" fill="#4B638A" fontSize="9" fontFamily="monospace">246</text>
                <text x="480" y="214" fill="#4B638A" fontSize="9" fontFamily="monospace">250</text>
                <text x="510" y="214" fill="#4B638A" fontSize="9" fontFamily="monospace">254</text>

                {/* Road Alignment Centreline Preview */}
                <path
                  d="M 50,260 Q 200,210 320,170 T 480,120 T 650,80"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeDasharray="5,4"
                />

                {/* Start Point & Label */}
                <circle cx="50" cy="260" r="4.5" fill="#10B981" />
                <text x="35" y="282" fill="#94A3B8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Ch 0+000</text>

                {/* End Point & Label */}
                <circle cx="650" cy="80" r="4.5" fill="#EF4444" />
                <text x="605" y="65" fill="#94A3B8" fontSize="10" fontWeight="600" fontFamily="sans-serif">Ch 3+200</text>
              </svg>

              {/* Legend & Scale bottom */}
              <Box sx={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2, backgroundColor: '#263A5E' }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>Contours</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2, backgroundColor: '#162238' }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>TIN edges</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 14, height: 2, backgroundColor: '#F59E0B', borderBottom: '1px dashed #F59E0B' }} />
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontSize: '0.7rem' }}>Alignment (preview)</Typography>
                </Box>
              </Box>

              <Typography variant="caption" sx={{ position: 'absolute', bottom: 12, right: 16, color: '#475569', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                Sample plan · metres · Not to scale
              </Typography>
            </Box>
          </Card>

          {/* Existing Ground Profile Along Alignment Card */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Existing-ground profile along the alignment
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.68rem' }}>
                ELEVATION IN METRES
              </Typography>
            </Box>

            <Box sx={{ height: 160, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 700 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="profileFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0B0F19" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="680" y2="20" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="60" x2="680" y2="60" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="100" x2="680" y2="100" stroke="#162238" strokeDasharray="3,3" />
                <line x1="40" y1="140" x2="680" y2="140" stroke="#162238" />

                <text x="15" y="24" fill="#64748B" fontSize="9" fontFamily="monospace">270</text>
                <text x="15" y="64" fill="#64748B" fontSize="9" fontFamily="monospace">260</text>
                <text x="15" y="104" fill="#64748B" fontSize="9" fontFamily="monospace">250</text>
                <text x="15" y="144" fill="#64748B" fontSize="9" fontFamily="monospace">244</text>

                {/* Profile Filled Area */}
                <polygon
                  points="40,140 40,135 120,95 200,60 260,35 340,70 420,110 500,125 580,90 680,65 680,140"
                  fill="url(#profileFill)"
                />

                {/* Ground Profile Line */}
                <polyline
                  points="40,135 120,95 200,60 260,35 340,70 420,110 500,125 580,90 680,65"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />

                {/* Chainage X Axis Labels */}
                <text x="40" y="155" fill="#64748B" fontSize="9" fontFamily="sans-serif">0+000</text>
                <text x="240" y="155" fill="#64748B" fontSize="9" fontFamily="sans-serif">1+000</text>
                <text x="440" y="155" fill="#64748B" fontSize="9" fontFamily="sans-serif">2+000</text>
                <text x="640" y="155" fill="#64748B" fontSize="9" fontFamily="sans-serif">3+200</text>
              </svg>
            </Box>
          </Card>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Terrain Summary Card */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Terrain summary
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Survey points used</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>
                  {terrainSummary.surveyPointsUsed.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>TIN triangles</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>
                  {terrainSummary.tinTriangles.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Lowest ground</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>
                  {terrainSummary.lowestGroundM} m
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Highest ground</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>
                  {terrainSummary.highestGroundM} m
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Mean slope</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>
                  {terrainSummary.meanSlopePercent} %
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Terrain Classification Card */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
              Terrain classification
            </Typography>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              {(['Flat', 'Rolling', 'Hilly', 'Steep'] as const).map(cls => (
                <Grid item xs={6} key={cls}>
                  <Box
                    sx={{
                      p: 1.2,
                      borderRadius: 1.5,
                      border: cls === terrainSummary.classification ? '1px solid #38BDF8' : '1px solid #1E293B',
                      backgroundColor: cls === terrainSummary.classification ? '#0F1E38' : '#0F1626',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: cls === terrainSummary.classification ? '#38BDF8' : '#94A3B8',
                        fontSize: '0.8rem',
                      }}
                    >
                      {cls}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1.4 }}>
              Detected from slope and elevation variation. This feeds the project profile the AI reads next.
            </Typography>
          </Card>

          {/* Slope Distribution Card */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Slope distribution
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {terrainSummary.slopeDistribution.map(item => (
                <Box key={item.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#F8FAFC', fontWeight: 600, fontFamily: 'monospace' }}>
                      {item.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#1E293B',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2563EB',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
