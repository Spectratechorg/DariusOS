import React from 'react';
import { Box, Card, Typography, Grid, Chip, Switch } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const DrawingsView: React.FC = () => {
  const { 
    activeCadSheet, 
    setActiveCadSheet, 
    cadLayers, 
    toggleCadLayer 
  } = useProject();

  const sheets: { id: 'PL-01' | 'LP-01' | 'XS-01'; name: string; sheetNum: string }[] = [
    { id: 'PL-01', name: 'Plan, alignment and drainage', sheetNum: 'Sheet 1 of 3' },
    { id: 'LP-01', name: 'Longitudinal profile', sheetNum: 'Sheet 2 of 3' },
    { id: 'XS-01', name: 'Cross-sections', sheetNum: 'Sheet 3 of 3' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column: Sheets Selector */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Card sx={{ p: 2.5, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1.5 }}>
              Sheets
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {sheets.map(s => {
                const isSelected = activeCadSheet === s.id;
                return (
                  <Box
                    key={s.id}
                    onClick={() => setActiveCadSheet(s.id)}
                    sx={{
                      p: 1.8,
                      borderRadius: 1.5,
                      border: isSelected ? '1.5px solid #38BDF8' : '1px solid #1E293B',
                      backgroundColor: isSelected ? '#0F1E38' : '#0F1626',
                      cursor: 'pointer',
                      '&:hover': { borderColor: '#334155' },
                    }}
                  >
                    <Typography variant="caption" sx={{ color: isSelected ? '#38BDF8' : '#64748B', fontWeight: 700, display: 'block' }}>
                      {s.id}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.825rem', mb: 0.3 }}>
                      {s.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                      {s.sheetNum}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 3, fontSize: '0.72rem', lineHeight: 1.4 }}>
              Terrain, drainage detail and typical section sheets are added by the full CAD engine.
            </Typography>
          </Card>
        </Grid>

        {/* Center: CAD Drawing Canvas */}
        <Grid item xs={12} md={6} lg={6.5}>
          <Card sx={{ p: 2, backgroundColor: '#090D16', border: '1px solid #1E293B', borderRadius: 1.5 }}>
            <Box
              sx={{
                width: '100%',
                height: 520,
                backgroundColor: '#070B12',
                border: '2px solid #334155',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              {/* North Arrow and Scale */}
              <Box sx={{ position: 'absolute', top: 16, left: 16, color: '#64748B' }}>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  ↑ N
                </Typography>
              </Box>

              {/* Vector CAD Drawing Simulation */}
              <Box sx={{ width: '100%', height: 380, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 650 380">
                  {/* Drawing Grid Frame */}
                  <rect x="0" y="0" width="650" height="380" fill="none" stroke="#162238" strokeWidth="0.5" />

                  {/* Contours Layer */}
                  {cadLayers['Contours'] && (
                    <g stroke="#1E2E4A" strokeWidth="0.8" fill="none">
                      <circle cx="280" cy="180" r="140" />
                      <circle cx="280" cy="180" r="105" />
                      <circle cx="280" cy="180" r="70" />
                      <circle cx="280" cy="180" r="35" />
                      <circle cx="480" cy="240" r="90" />
                      <circle cx="480" cy="240" r="55" />
                    </g>
                  )}

                  {/* Drainage Ditches Layer */}
                  {cadLayers['Drainage'] && (
                    <g stroke="#0284C7" strokeWidth="1" strokeDasharray="3,3" fill="none">
                      <path d="M 40,296 Q 200,246 320,196 T 460,116 T 600,66" />
                      <path d="M 40,304 Q 200,254 320,204 T 460,124 T 600,74" />
                    </g>
                  )}

                  {/* Alignment Centreline Layer */}
                  {cadLayers['Alignment'] && (
                    <g>
                      <path
                        d="M 40,300 Q 200,250 320,200 T 460,120 T 600,70"
                        fill="none"
                        stroke="#F8FAFC"
                        strokeWidth="2.5"
                      />
                      {/* Tangents / Tangent Points */}
                      <circle cx="40" cy="300" r="3" fill="#10B981" />
                      <circle cx="600" cy="70" r="3" fill="#EF4444" />
                    </g>
                  )}

                  {/* Chainage Labels Layer */}
                  {cadLayers['Chainage labels'] && (
                    <g fill="#94A3B8" fontSize="8" fontFamily="monospace">
                      <text x="35" y="318">0+000</text>
                      <text x="175" y="268">0+950</text>
                      <text x="325" y="218">1+840</text>
                      <text x="450" y="140">2+500</text>
                      <text x="560" y="88">3+200</text>

                      {/* Curve annotations */}
                      <text x="260" y="160" fill="#38BDF8">C1 · R 240 m</text>
                      <text x="440" y="90" fill="#38BDF8">C2 · R 300 m</text>
                    </g>
                  )}
                </svg>
              </Box>

              {/* Title Block Bottom Right */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                <Box
                  sx={{
                    border: '1.5px solid #334155',
                    backgroundColor: '#0F1626',
                    width: 440,
                    fontSize: '0.72rem',
                  }}
                >
                  <Grid container sx={{ borderBottom: '1px solid #1E293B' }}>
                    <Grid item xs={6} sx={{ p: 1, borderRight: '1px solid #1E293B' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.62rem' }}>PROJECT</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.75rem' }}>Pilot road project</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ p: 1 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.62rem' }}>CLIENT</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.75rem' }}>Mastodon Engineering Services Ltd</Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #1E293B' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.62rem' }}>DRAWING</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.75rem' }}>Plan, alignment & drainage</Typography>
                    </Grid>
                    <Grid item xs={2.5} sx={{ p: 1, borderRight: '1px solid #1E293B' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.62rem' }}>SHEET</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.75rem' }}>{activeCadSheet}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ p: 1, borderRight: '1px solid #1E293B' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.62rem' }}>REVISION</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.75rem' }}>C</Typography>
                    </Grid>
                    <Grid item xs={3.5} sx={{ p: 1 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.62rem' }}>STATUS</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981', fontSize: '0.75rem' }}>For engineer approval</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Layers & How These Were Made */}
        <Grid item xs={12} md={3} lg={3}>
          {/* Layers Card */}
          <Card sx={{ p: 2.5, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
              Layers
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Apply to the plan sheet.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Object.entries(cadLayers).map(([layer, enabled]) => (
                <Box
                  key={layer}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.5,
                    borderBottom: '1px solid #1A2436',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
                    {layer}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={enabled ? 'On' : 'Off'}
                      size="small"
                      onClick={() => toggleCadLayer(layer)}
                      sx={{
                        backgroundColor: enabled ? 'rgba(16, 185, 129, 0.15)' : '#1E293B',
                        color: enabled ? '#34D399' : '#64748B',
                        fontWeight: 600,
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                      }}
                    />
                    <Switch
                      size="small"
                      checked={enabled}
                      onChange={() => toggleCadLayer(layer)}
                      sx={{ '& .MuiSwitch-thumb': { backgroundColor: enabled ? '#10B981' : '#64748B' } }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* How These Were Made Card */}
          <Card sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1 }}>
              How these were made
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', lineHeight: 1.45, mb: 2 }}>
              Each sheet is built from exact design geometry: points, lines, curves, chainage and labels. They are CAD output, not AI-generated pictures.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="DXF" size="small" sx={{ backgroundColor: '#1E293B', color: '#F8FAFC', fontWeight: 600 }} />
              <Chip label="PDF" size="small" sx={{ backgroundColor: '#1E293B', color: '#F8FAFC', fontWeight: 600 }} />
              <Chip label="Civil 3D later" size="small" sx={{ backgroundColor: '#1E293B', color: '#64748B' }} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
