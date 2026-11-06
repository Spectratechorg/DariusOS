import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  Button, 
  LinearProgress,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined';
import { useProject } from '../context/ProjectContext';
import { VIZ_TOKENS } from '../tokens';

export const TerrainView: React.FC = () => {
  const { 
    terrainSummary, 
    activeTerrainTab, 
    setActiveTerrainTab,
    setActiveStage,
    hasSurveyUploaded,
  } = useProject();

  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [showContours, setShowContours] = useState<boolean>(true);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3): Terrain Surface Model & Profiles */}
        <Grid item xs={12} lg={8}>
          {/* Terrain Model Canvas Card */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Digital Terrain Model (DTM)
                  </Typography>
                  <Chip
                    label="HYPSOMETRIC + HILLSHADE"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      fontFamily: VIZ_TOKENS.typography.monoFont,
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      color: '#38BDF8',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Triangulated Irregular Network (TIN) surface with continuous contour generation.
                </Typography>
              </Box>

              {/* View Switcher Tabs & Toggles */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', backgroundColor: '#0A0E17', borderRadius: 1.5, p: 0.3, border: '1px solid #1E293B' }}>
                  {(['TIN', 'Contours', 'Alignment'] as const).map((tab) => (
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
                        borderRadius: 1,
                        '&:hover': { backgroundColor: activeTerrainTab === tab ? '#1E293B' : 'rgba(255,255,255,0.02)' },
                      }}
                    >
                      {tab}
                    </Button>
                  ))}
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={showWireframe}
                      onChange={(e) => setShowWireframe(e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { backgroundColor: showWireframe ? '#38BDF8' : '#64748B' } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>Wireframe</Typography>}
                  sx={{ ml: 0.5 }}
                />
              </Box>
            </Box>

            {/* SVG Terrain Map with Hypsometric Elevation Ramp & Hillshade */}
            <Box
              sx={{
                width: '100%',
                height: 340,
                backgroundColor: '#070B14',
                borderRadius: 1.5,
                border: '1px solid #1E293B',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* North Arrow in Top Left */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 14,
                  left: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#94A3B8',
                }}
              >
                <NavigationOutlinedIcon sx={{ fontSize: '1.1rem', color: '#38BDF8' }} />
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  N
                </Typography>
              </Box>

              <svg width="100%" height="100%" viewBox="0 0 700 340" style={{ display: 'block' }}>
                <defs>
                  {/* Hypsometric Elevation Ramp Gradients */}
                  <linearGradient id="hypsoValley" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#1E382B" />
                    <stop offset="100%" stopColor="#284A37" />
                  </linearGradient>
                  <linearGradient id="hypsoMid" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#3F4E34" />
                    <stop offset="100%" stopColor="#5A6642" />
                  </linearGradient>
                  <linearGradient id="hypsoRidge" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#6E5D3B" />
                    <stop offset="100%" stopColor="#8B6F47" />
                  </linearGradient>
                  <linearGradient id="hypsoHigh" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#8B6F47" />
                    <stop offset="100%" stopColor="#A88B5D" />
                  </linearGradient>
                </defs>

                {/* 1. Hypsometric Shaded TIN Triangles */}
                <g>
                  {/* Lowlands (300.0m - 301.0m) */}
                  <polygon points="40,280 120,220 180,260" fill="url(#hypsoValley)" opacity="0.85" />
                  <polygon points="120,220 180,260 250,180" fill="url(#hypsoValley)" opacity="0.9" />
                  <polygon points="450,200 520,260 590,210" fill="url(#hypsoValley)" opacity="0.85" />
                  <polygon points="520,260 590,210 660,270" fill="url(#hypsoValley)" opacity="0.8" />

                  {/* Mid-slopes (301.0m - 302.5m) */}
                  <polygon points="180,260 250,180 320,230" fill="url(#hypsoMid)" opacity="0.9" />
                  <polygon points="250,180 320,230 390,160" fill="url(#hypsoMid)" opacity="0.92" />
                  <polygon points="320,230 390,160 460,200" fill="url(#hypsoMid)" opacity="0.9" />
                  <polygon points="390,160 460,200 530,130" fill="url(#hypsoMid)" opacity="0.92" />
                  <polygon points="460,200 530,130 600,150" fill="url(#hypsoMid)" opacity="0.9" />
                  <polygon points="530,130 600,150 670,100" fill="url(#hypsoMid)" opacity="0.88" />

                  {/* Highland Ridges (302.5m - 304.0m) */}
                  <polygon points="190,130 250,180 230,100" fill="url(#hypsoRidge)" opacity="0.95" />
                  <polygon points="230,100 250,180 310,110" fill="url(#hypsoHigh)" opacity="0.98" />
                  <polygon points="250,180 320,230 310,110" fill="url(#hypsoRidge)" opacity="0.95" />
                  <polygon points="310,110 320,230 370,120" fill="url(#hypsoHigh)" opacity="0.98" />
                  <polygon points="370,120 390,160 440,100" fill="url(#hypsoRidge)" opacity="0.95" />
                  <polygon points="440,100 530,130 500,80" fill="url(#hypsoHigh)" opacity="0.98" />
                </g>

                {/* 2. Optional TIN Triangulation Wireframe Overlay */}
                {showWireframe && (
                  <g stroke="rgba(148, 163, 184, 0.25)" strokeWidth="0.75" fill="none">
                    <polygon points="40,280 120,220 180,260" />
                    <polygon points="120,220 180,260 250,180" />
                    <polygon points="180,260 250,180 320,230" />
                    <polygon points="250,180 320,230 390,160" />
                    <polygon points="320,230 390,160 460,200" />
                    <polygon points="390,160 460,200 530,130" />
                    <polygon points="460,200 530,130 600,150" />
                    <polygon points="530,130 600,150 670,100" />
                    <polygon points="190,130 250,180 230,100" />
                    <polygon points="230,100 250,180 310,110" />
                    <polygon points="250,180 320,230 310,110" />
                    <polygon points="310,110 320,230 370,120" />
                    <polygon points="370,120 390,160 440,100" />
                    <polygon points="440,100 530,130 500,80" />
                    <polygon points="450,200 520,260 590,210" />
                    <polygon points="520,260 590,210 660,270" />
                  </g>
                )}

                {/* 3. Contours Layer: Minor (0.75px) and Index (1.25px every 5th) */}
                {showContours && (
                  <g fill="none">
                    {/* Minor Contours (0.75px) */}
                    <g stroke={VIZ_TOKENS.colors.contourMinor} strokeWidth="0.75" opacity="0.6">
                      <ellipse cx="270" cy="140" rx="120" ry="65" />
                      <ellipse cx="270" cy="140" rx="90" ry="48" />
                      <ellipse cx="270" cy="140" rx="40" ry="20" />
                      <ellipse cx="540" cy="210" rx="100" ry="55" />
                      <ellipse cx="540" cy="210" rx="70" ry="38" />
                    </g>

                    {/* Index Contours (1.25px, every 5th) */}
                    <g stroke={VIZ_TOKENS.colors.contourIndex} strokeWidth="1.25" opacity="0.9">
                      <ellipse cx="270" cy="140" rx="65" ry="34" />
                      <text x="340" y="144" fill="#94A3B8" fontSize="8" fontFamily="monospace">303.00</text>
                      <ellipse cx="540" cy="210" rx="45" ry="24" />
                      <text x="590" y="214" fill="#94A3B8" fontSize="8" fontFamily="monospace">301.00</text>
                    </g>
                  </g>
                )}

                {/* 4. Draped Alignment Centerline (2.5px Bold #F8FAFC) */}
                {(activeTerrainTab === 'Alignment' || activeTerrainTab === 'TIN') && (
                  <g>
                    {/* ROW Limits dashed */}
                    <path
                      d="M 50,265 Q 210,215 330,175 T 490,125 T 660,85"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="1.25"
                      strokeDasharray="5,4"
                      opacity="0.7"
                    />
                    <path
                      d="M 50,295 Q 210,245 330,205 T 490,155 T 660,115"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="1.25"
                      strokeDasharray="5,4"
                      opacity="0.7"
                    />

                    {/* Draped Road Centerline */}
                    <path
                      d="M 50,280 Q 210,230 330,190 T 490,140 T 660,100"
                      fill="none"
                      stroke="#F8FAFC"
                      strokeWidth="2.5"
                    />

                    {/* Start Station */}
                    <circle cx="50" cy="280" r="4.5" fill="#16A34A" />
                    <text x="35" y="304" fill="#F8FAFC" fontSize="9" fontWeight="700" fontFamily="monospace">0+000</text>

                    {/* End Station */}
                    <circle cx="660" cy="100" r="4.5" fill="#DC2626" />
                    <text x="625" y="86" fill="#F8FAFC" fontSize="9" fontWeight="700" fontFamily="monospace">0+200</text>
                  </g>
                )}
              </svg>

              {/* Hypsometric Elevation Legend (Bottom Left) */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: '4px 10px',
                  borderRadius: 1,
                  backgroundColor: 'rgba(11, 16, 26, 0.85)',
                  border: '1px solid #1E293B',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 600 }}>
                  ELEVATION:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 8, backgroundColor: '#284A37', borderRadius: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', fontFamily: 'monospace' }}>300m</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 8, backgroundColor: '#5A6642', borderRadius: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', fontFamily: 'monospace' }}>302m</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 8, backgroundColor: '#8B6F47', borderRadius: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', fontFamily: 'monospace' }}>304m</Typography>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 16,
                  color: '#64748B',
                  fontSize: '0.68rem',
                  fontFamily: 'monospace',
                }}
              >
                UTM Zone 32N · Min: 300.00m · Max: 304.00m
              </Typography>
            </Box>
          </Card>

          {/* Existing Ground Longitudinal Profile Card */}
          <Card sx={{ p: 2.5, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  Existing-Ground Profile Along Corridor Centerline
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Extracted from TIN surface at 20-meter chainage intervals.
                </Typography>
              </Box>
              <Chip
                label="GROUND LINE"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(139, 111, 71, 0.15)',
                  color: '#A88B5D',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                }}
              />
            </Box>

            <Box sx={{ height: 160, position: 'relative', backgroundColor: '#070B14', borderRadius: 1, p: 1, border: '1px solid #1E293B' }}>
              <svg width="100%" height="100%" viewBox="0 0 700 140" style={{ display: 'block' }}>
                <defs>
                  {/* Natural Earth Tone Profile Fill Gradient */}
                  <linearGradient id="groundProfileRamp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B6F47" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#070B14" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Datum Lines */}
                <line x1="40" y1="20" x2="680" y2="20" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="40" y1="55" x2="680" y2="55" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="40" y1="90" x2="680" y2="90" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="40" y1="120" x2="680" y2="120" stroke="#1E293B" strokeWidth="1" />

                <text x="15" y="24" fill="#64748B" fontSize="8.5" fontFamily="monospace">304.0</text>
                <text x="15" y="59" fill="#64748B" fontSize="8.5" fontFamily="monospace">302.5</text>
                <text x="15" y="94" fill="#64748B" fontSize="8.5" fontFamily="monospace">301.0</text>
                <text x="15" y="124" fill="#64748B" fontSize="8.5" fontFamily="monospace">300.0</text>

                {/* Profile Filled Area (Natural Earth Shade) */}
                <polygon
                  points="40,120 40,115 120,95 200,68 280,42 360,65 440,95 520,105 600,82 680,60 680,120"
                  fill="url(#groundProfileRamp)"
                />

                {/* Ground Profile Line (1.5px Earth Brown #8B6F47) */}
                <polyline
                  points="40,115 120,95 200,68 280,42 360,65 440,95 520,105 600,82 680,60"
                  fill="none"
                  stroke={VIZ_TOKENS.colors.groundExisting}
                  strokeWidth="1.5"
                />

                {/* Chainage X Axis Labels */}
                <text x="40" y="134" fill="#94A3B8" fontSize="8" fontFamily="monospace">0+000</text>
                <text x="200" y="134" fill="#94A3B8" fontSize="8" fontFamily="monospace">0+050</text>
                <text x="360" y="134" fill="#94A3B8" fontSize="8" fontFamily="monospace">0+100</text>
                <text x="520" y="134" fill="#94A3B8" fontSize="8" fontFamily="monospace">0+150</text>
                <text x="660" y="134" fill="#94A3B8" fontSize="8" fontFamily="monospace">0+200</text>
              </svg>
            </Box>
          </Card>
        </Grid>

        {/* Right Column (1/3): Metrics & Slope Analysis */}
        <Grid item xs={12} lg={4}>
          {/* Terrain Summary Card */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 2 }}>
              Terrain Model Metrics
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Survey points used</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {terrainSummary.surveyPointsUsed.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>TIN mesh triangles</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {terrainSummary.tinTriangles.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Lowest ground level</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {terrainSummary.lowestGroundM.toFixed(2)} m
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Highest ground level</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {terrainSummary.highestGroundM.toFixed(2)} m
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>Mean corridor slope</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#38BDF8', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {terrainSummary.meanSlopePercent.toFixed(1)} %
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Terrain Classification & Slope Distribution */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Slope Classification
              </Typography>
              <Chip
                label={terrainSummary.classification}
                size="small"
                sx={{
                  backgroundColor: 'rgba(22, 163, 74, 0.15)',
                  color: '#4ADE80',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Corridor classified as <strong>{terrainSummary.classification}</strong> per AASHTO / FMW&H standards.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              {terrainSummary.slopeDistribution.map((item) => (
                <Box key={item.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#F8FAFC', fontWeight: 600, fontFamily: VIZ_TOKENS.typography.monoFont }}>
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
                        backgroundColor: item.label === '>10%' ? '#F59E0B' : '#38BDF8',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Next Stage Navigation Button */}
          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setActiveStage('design')}
            sx={{
              backgroundColor: '#2563EB',
              '&:hover': { backgroundColor: '#1D4ED8' },
              fontWeight: 600,
              py: 1,
            }}
          >
            Proceed to Design Engine (Stage 4)
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
