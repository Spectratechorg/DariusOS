import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  Chip, 
  Switch, 
  Button,
  Tooltip
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { useProject } from '../context/ProjectContext';
import { VIZ_TOKENS } from '../tokens';

export const DrawingsView: React.FC = () => {
  const { 
    activeCadSheet, 
    setActiveCadSheet, 
    cadLayers, 
    toggleCadLayer,
    projectData,
    uploadedSurvey,
    hasSurveyUploaded,
  } = useProject();

  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  const sheets: { id: 'PL-01' | 'LP-01' | 'XS-01'; name: string; sheetNum: string; scale: string }[] = [
    { id: 'PL-01', name: 'Plan, horizontal alignment & drainage', sheetNum: 'Sheet 1 of 3', scale: '1:1000' },
    { id: 'LP-01', name: 'Longitudinal profile & vertical design', sheetNum: 'Sheet 2 of 3', scale: 'H 1:1000 / V 1:100' },
    { id: 'XS-01', name: 'Typical corridor cross-sections', sheetNum: 'Sheet 3 of 3', scale: '1:50' },
  ];

  // Hover calculation helper for shared cursor
  const getStationData = (chainageM: number) => {
    const existing = 300.0 + (chainageM * 0.015) + Math.sin(chainageM * 0.05) * 0.4;
    const finished = 300.2 + (chainageM * 0.018);
    const cutFill = finished - existing;
    return {
      chainage: `0+${chainageM.toString().padStart(3, '0')}`,
      existing: existing.toFixed(2),
      finished: finished.toFixed(2),
      cutFill: Math.abs(cutFill).toFixed(2),
      isCut: cutFill >= 0,
      grade: chainageM > 160 ? '+9.2%' : '+2.1%',
    };
  };

  const hoveredData = hoveredStation !== null ? getStationData(hoveredStation) : null;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Top CAD Sheet Control Bar */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: '#0F1626',
          border: '1px solid #1E293B',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#38BDF8',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                  fontSize: '0.68rem',
                }}
              >
                CAD PLOT WORKSPACE · {activeCadSheet}
              </Typography>
              <Chip
                label="ENGINEERING PLOT"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38BDF8',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', fontSize: '1rem', mt: 0.2 }}>
              {sheets.find((s) => s.id === activeCadSheet)?.name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PrintOutlinedIcon />}
            onClick={() => setIsPrintMode(!isPrintMode)}
            sx={{
              borderColor: isPrintMode ? '#16A34A' : '#334155',
              color: isPrintMode ? '#4ADE80' : '#94A3B8',
              backgroundColor: isPrintMode ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
              fontSize: '0.75rem',
            }}
          >
            {isPrintMode ? 'Grayscale Print: ON' : 'Grayscale Print: OFF'}
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<DownloadOutlinedIcon />}
            sx={{
              backgroundColor: '#2563EB',
              '&:hover': { backgroundColor: '#1D4ED8' },
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
            onClick={() => {
              alert(`Exporting ${activeCadSheet} to DXF vector bundle (Layers: Alignment, Contours, Drainage, ROW).`);
            }}
          >
            Export DXF
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            sx={{
              borderColor: '#334155',
              color: '#F8FAFC',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
            onClick={() => {
              window.print();
            }}
          >
            Export PDF (A3)
          </Button>
        </Box>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column: Sheets Selector */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Card sx={{ p: 2, mb: 3, backgroundColor: '#0F1626', border: '1px solid #1E293B' }}>
            <Typography
              variant="subtitle2"
              sx={{ color: '#64748B', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}
            >
              <LayersOutlinedIcon sx={{ fontSize: '0.9rem' }} />
              DRAWING SHEETS
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {sheets.map((s) => {
                const isSelected = activeCadSheet === s.id;
                return (
                  <Box
                    key={s.id}
                    onClick={() => setActiveCadSheet(s.id)}
                    sx={{
                      p: 1.8,
                      borderRadius: 1.5,
                      border: isSelected ? '1.5px solid #38BDF8' : '1px solid #1E293B',
                      backgroundColor: isSelected ? '#0D1A30' : '#0A0E1A',
                      cursor: 'pointer',
                      transition: VIZ_TOKENS.transitions.cardHover,
                      '&:hover': { borderColor: '#38BDF8', backgroundColor: '#0F1E38' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isSelected ? '#38BDF8' : '#64748B',
                          fontWeight: 700,
                          fontFamily: VIZ_TOKENS.typography.monoFont,
                          fontSize: '0.75rem',
                        }}
                      >
                        {s.id}
                      </Typography>
                      <Chip
                        label={s.scale}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.6rem',
                          fontFamily: VIZ_TOKENS.typography.monoFont,
                          backgroundColor: '#1E293B',
                          color: '#94A3B8',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem', mb: 0.3 }}>
                      {s.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem' }}>
                      {s.sheetNum}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #1E293B' }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.7rem', lineHeight: 1.4 }}>
                Drawing sheets comply with FMW&H Highway Design Manual and AASHTO Geometric Standards.
              </Typography>
            </Box>
          </Card>

          {/* Layer Visibility Controls */}
          <Card sx={{ p: 2, backgroundColor: '#0F1626', border: '1px solid #1E293B' }}>
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>
              CAD LAYERS
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1.5 }}>
              Toggle drafting layers (180ms opacity).
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(cadLayers).map(([layer, enabled]) => (
                <Box
                  key={layer}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.6,
                    borderBottom: '1px solid #151D2E',
                  }}
                >
                  <Typography variant="body2" sx={{ color: enabled ? '#F8FAFC' : '#64748B', fontSize: '0.78rem' }}>
                    {layer}
                  </Typography>
                  <Switch
                    size="small"
                    checked={enabled}
                    onChange={() => toggleCadLayer(layer)}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        backgroundColor: enabled ? '#38BDF8' : '#64748B',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: enabled ? 'rgba(56, 189, 248, 0.4)' : '#1E293B',
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Center/Main Column: High-Precision CAD Sheet Canvas */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Card
            sx={{
              p: 2,
              backgroundColor: isPrintMode ? '#F8FAFC' : '#070B14',
              color: isPrintMode ? '#0F172A' : '#F8FAFC',
              border: '2px solid #334155',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Sheet Canvas Header Banner */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
                borderBottom: `1px solid ${isPrintMode ? '#CBD5E1' : '#1E293B'}`,
                pb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: VIZ_TOKENS.typography.monoFont,
                    fontWeight: 700,
                    color: isPrintMode ? '#0F172A' : '#38BDF8',
                    fontSize: '0.75rem',
                  }}
                >
                  {activeCadSheet} · {sheets.find((s) => s.id === activeCadSheet)?.name.toUpperCase()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  A3 Standard Sheet Border
                </Typography>
              </Box>

              {hoveredData && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 0.3,
                    borderRadius: 1,
                    backgroundColor: isPrintMode ? '#E2E8F0' : '#0F1E38',
                    border: '1px solid #38BDF8',
                    fontFamily: VIZ_TOKENS.typography.monoFont,
                    fontSize: '0.72rem',
                  }}
                >
                  <span>Ch <strong>{hoveredData.chainage}</strong></span>
                  <span>FG: <strong>{hoveredData.finished}m</strong></span>
                  <span>EG: <strong>{hoveredData.existing}m</strong></span>
                  <span style={{ color: hoveredData.isCut ? '#D9534F' : '#2F80ED' }}>
                    {hoveredData.isCut ? `Cut ${hoveredData.cutFill}m` : `Fill ${hoveredData.cutFill}m`}
                  </span>
                  <span>Grade: <strong>{hoveredData.grade}</strong></span>
                </Box>
              )}
            </Box>

            {/* SVG Drawing Canvas with Standard Hatch Definitions */}
            <Box
              sx={{
                width: '100%',
                height: 520,
                backgroundColor: isPrintMode ? '#FFFFFF' : '#060A12',
                border: `1.5px solid ${isPrintMode ? '#94A3B8' : '#1E293B'}`,
                position: 'relative',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 850 520"
                style={{ display: 'block' }}
                onMouseLeave={() => setHoveredStation(null)}
              >
                <defs>
                  {/* Diagonal Hatch for Cut (Civil Standard) */}
                  <pattern
                    id="cutHatch"
                    width="8"
                    height="8"
                    patternTransform="rotate(45 0 0)"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="8"
                      stroke={isPrintMode ? '#475569' : '#D9534F'}
                      strokeWidth="1.2"
                    />
                  </pattern>

                  {/* Stippled Dots for Fill (Civil Standard) */}
                  <pattern
                    id="fillDots"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="4"
                      cy="4"
                      r="1.2"
                      fill={isPrintMode ? '#475569' : '#2F80ED'}
                    />
                  </pattern>
                </defs>

                {/* Outer Sheet Border & Margins */}
                <rect
                  x="15"
                  y="15"
                  width="820"
                  height="490"
                  fill="none"
                  stroke={isPrintMode ? '#0F172A' : '#334155'}
                  strokeWidth="1.5"
                />
                <rect
                  x="20"
                  y="20"
                  width="810"
                  height="480"
                  fill="none"
                  stroke={isPrintMode ? '#64748B' : '#1E293B'}
                  strokeWidth="0.75"
                />

                {/* North Arrow & Scale Bar (Top-Left of Sheet) */}
                <g transform="translate(35, 35)">
                  {/* North Arrow */}
                  <polygon points="12,0 16,18 12,14 8,18" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} />
                  <polygon points="12,0 12,14 8,18" fill={isPrintMode ? '#64748B' : '#38BDF8'} />
                  <text
                    x="12"
                    y="28"
                    fill={isPrintMode ? '#0F172A' : '#94A3B8'}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    N
                  </text>

                  {/* Graphic Scale Bar */}
                  <g transform="translate(45, 8)">
                    <rect x="0" y="0" width="30" height="4" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} />
                    <rect x="30" y="0" width="30" height="4" fill={isPrintMode ? '#E2E8F0' : '#1E293B'} stroke={isPrintMode ? '#0F172A' : '#F8FAFC'} strokeWidth="0.5" />
                    <rect x="60" y="0" width="40" height="4" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} />
                    <text x="0" y="12" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontFamily="monospace">0m</text>
                    <text x="30" y="12" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontFamily="monospace">30</text>
                    <text x="60" y="12" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontFamily="monospace">60</text>
                    <text x="100" y="12" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontFamily="monospace">100m</text>
                    <text x="50" y="-3" fill={isPrintMode ? '#0F172A' : '#64748B'} fontSize="7" fontFamily="sans-serif" textAnchor="middle">SCALE 1:1000</text>
                  </g>
                </g>

                {/* ============================================================== */}
                {/* SHEET 1: PL-01 PLAN & ALIGNMENT                                */}
                {/* ============================================================== */}
                {activeCadSheet === 'PL-01' && (
                  <g className="cad-layer">
                    {/* Contours Layer */}
                    {cadLayers['Contours'] && (
                      <g fill="none">
                        {/* Minor Contours (0.75px) */}
                        <g stroke={isPrintMode ? '#CBD5E1' : '#94A3B8'} strokeWidth="0.75" opacity="0.35">
                          <path d="M 60,320 Q 220,280 360,220 T 540,160 T 780,110" />
                          <path d="M 60,350 Q 240,310 380,250 T 560,190 T 780,140" />
                          <path d="M 60,230 Q 200,190 340,130 T 520,80 T 780,40" />
                          <circle cx="340" cy="180" r="140" />
                          <circle cx="340" cy="180" r="110" />
                          <circle cx="340" cy="180" r="50" />
                        </g>

                        {/* Index Contours (1.25px every 5th) */}
                        <g stroke={isPrintMode ? '#64748B' : '#475569'} strokeWidth="1.25" opacity="0.65">
                          <circle cx="340" cy="180" r="80" />
                          <text x="425" y="183" fill={isPrintMode ? '#475569' : '#94A3B8'} fontSize="8" fontFamily="monospace">304.00</text>
                          <path d="M 60,290 Q 210,250 350,190 T 530,130 T 780,80" />
                          <text x="690" y="105" fill={isPrintMode ? '#475569' : '#94A3B8'} fontSize="8" fontFamily="monospace">300.00</text>
                        </g>
                      </g>
                    )}

                    {/* Right-of-Way (ROW) Dashed Boundary */}
                    <g stroke="#64748B" strokeWidth="1.25" strokeDasharray="6,4" fill="none">
                      {/* Left ROW (15m offset) */}
                      <path d="M 70,305 Q 240,245 370,195 T 520,125 T 760,75" />
                      {/* Right ROW (15m offset) */}
                      <path d="M 70,345 Q 240,285 370,235 T 520,165 T 760,115" />
                      <text x="90" y="295" fill="#64748B" fontSize="8" fontFamily="monospace">ROW LIMIT (15m)</text>
                    </g>

                    {/* Drainage Ditches Layer */}
                    {cadLayers['Drainage'] && (
                      <g stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3,3" fill="none">
                        <path d="M 70,317 Q 240,257 370,207 T 520,137 T 760,87" />
                        <path d="M 70,333 Q 240,273 370,223 T 520,153 T 760,103" />
                        <text x="640" y="80" fill="#0284C7" fontSize="8" fontFamily="sans-serif">LINED DITCH</text>
                      </g>
                    )}

                    {/* Alignment Centerline Layer (2.5px solid) */}
                    {cadLayers['Alignment'] && (
                      <g>
                        <path
                          d="M 70,325 Q 240,265 370,215 T 520,145 T 760,95"
                          fill="none"
                          stroke={isPrintMode ? '#0F172A' : '#F8FAFC'}
                          strokeWidth="2.5"
                        />
                        {/* Start Tangent Point (TS) */}
                        <circle cx="70" cy="325" r="4" fill="#16A34A" />
                        <text x="65" y="345" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="9" fontWeight="700" fontFamily="monospace">TS 0+000</text>

                        {/* End Tangent Point (ST) */}
                        <circle cx="760" cy="95" r="4" fill="#DC2626" />
                        <text x="730" y="80" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="9" fontWeight="700" fontFamily="monospace">ST 0+200</text>
                      </g>
                    )}

                    {/* Chainage Ticks & Labels Layer */}
                    {cadLayers['Chainage labels'] && (
                      <g fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="9" fontFamily="monospace">
                        {[
                          { station: 0, x: 70, y: 325, label: '0+000' },
                          { station: 50, x: 235, y: 268, label: '0+050' },
                          { station: 100, x: 410, y: 198, label: '0+100' },
                          { station: 150, x: 585, y: 135, label: '0+150' },
                          { station: 200, x: 760, y: 95, label: '0+200' },
                        ].map((pt) => (
                          <g
                            key={pt.label}
                            onMouseEnter={() => setHoveredStation(pt.station)}
                            style={{ cursor: 'pointer' }}
                          >
                            <line
                              x1={pt.x}
                              y1={pt.y - 6}
                              x2={pt.x}
                              y2={pt.y + 6}
                              stroke={isPrintMode ? '#0F172A' : '#38BDF8'}
                              strokeWidth="1.5"
                            />
                            <text x={pt.x - 12} y={pt.y + 20}>{pt.label}</text>
                          </g>
                        ))}
                      </g>
                    )}

                    {/* Curve Geometry Table in Top-Right Box */}
                    <g transform="translate(560, 35)">
                      <rect
                        x="0"
                        y="0"
                        width="240"
                        height="90"
                        fill={isPrintMode ? '#F1F5F9' : '#0A0F1D'}
                        stroke={isPrintMode ? '#94A3B8' : '#1E293B'}
                        strokeWidth="1"
                      />
                      <rect x="0" y="0" width="240" height="18" fill={isPrintMode ? '#E2E8F0' : '#141E34'} />
                      <text x="8" y="13" fill={isPrintMode ? '#0F172A' : '#38BDF8'} fontSize="8" fontWeight="700" fontFamily="monospace">
                        HORIZONTAL CURVE SCHEDULE
                      </text>
                      <text x="8" y="32" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8" fontFamily="monospace">Curve C1: R = 260.00 m</text>
                      <text x="8" y="44" fill={isPrintMode ? '#475569' : '#94A3B8'} fontSize="7.5" fontFamily="monospace">Δ = 24° 18' 30" · Tangent T = 55.8 m</text>
                      <text x="8" y="56" fill={isPrintMode ? '#475569' : '#94A3B8'} fontSize="7.5" fontFamily="monospace">Length L = 110.2 m · Superelevation e = 4.0%</text>
                      <text x="8" y="72" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8" fontFamily="monospace">Design Speed: 80 km/h · AASHTO 2018</text>
                    </g>
                  </g>
                )}

                {/* ============================================================== */}
                {/* SHEET 2: LP-01 LONGITUDINAL PROFILE                            */}
                {/* ============================================================== */}
                {activeCadSheet === 'LP-01' && (
                  <g className="cad-layer">
                    {/* Vertical Exaggeration Notice in Top Left */}
                    <g transform="translate(190, 42)">
                      <rect
                        x="0"
                        y="0"
                        width="150"
                        height="22"
                        fill={isPrintMode ? '#E2E8F0' : '#0F1E38'}
                        stroke={isPrintMode ? '#94A3B8' : '#38BDF8'}
                        strokeWidth="1"
                        rx="3"
                      />
                      <text
                        x="75"
                        y="15"
                        fill={isPrintMode ? '#0F172A' : '#38BDF8'}
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        V 10x : H 1x (EXAGGERATED)
                      </text>
                    </g>

                    {/* Profile Elevation Gridlines (Subtle 0.75px) */}
                    <g stroke={isPrintMode ? '#E2E8F0' : 'rgba(148, 163, 184, 0.12)'} strokeWidth="0.75">
                      <line x1="70" y1="80" x2="780" y2="80" strokeDasharray="3,3" />
                      <line x1="70" y1="130" x2="780" y2="130" strokeDasharray="3,3" />
                      <line x1="70" y1="180" x2="780" y2="180" strokeDasharray="3,3" />
                      <line x1="70" y1="230" x2="780" y2="230" strokeDasharray="3,3" />
                      <line x1="70" y1="280" x2="780" y2="280" />
                    </g>

                    {/* Elevation Datum Axis Labels on Left */}
                    <g fill={isPrintMode ? '#0F172A' : '#64748B'} fontSize="9" fontFamily="monospace">
                      <text x="35" y="84">304.00</text>
                      <text x="35" y="134">303.00</text>
                      <text x="35" y="184">302.00</text>
                      <text x="35" y="234">301.00</text>
                      <text x="35" y="284">300.00</text>
                      <text x="35" y="70" fill={isPrintMode ? '#0F172A' : '#38BDF8'} fontWeight="700">DATUM (m)</text>
                    </g>

                    {/* Cut / Fill Polygons with Pattern Hatching */}
                    {/* Segment 1: Cut Polygon from 70 to 450 */}
                    <polygon
                      points="70,280 180,245 280,210 380,180 450,155 450,140 380,160 280,190 180,225 70,260"
                      fill="url(#cutHatch)"
                    />
                    <polygon
                      points="70,280 180,245 280,210 380,180 450,155 450,140 380,160 280,190 180,225 70,260"
                      fill={VIZ_TOKENS.colors.cutFill30}
                    />

                    {/* Segment 2: Fill Polygon from 450 to 760 */}
                    <polygon
                      points="450,155 560,145 660,135 760,120 760,110 660,115 560,130 450,140"
                      fill="url(#fillDots)"
                    />
                    <polygon
                      points="450,155 560,145 660,135 760,120 760,110 660,115 560,130 450,140"
                      fill={VIZ_TOKENS.colors.fillFill30}
                    />

                    {/* Existing Ground Line (1.5px, Muted Earth #8B6F47) */}
                    <polyline
                      points="70,280 180,245 280,210 380,180 450,155 560,145 660,135 760,120"
                      fill="none"
                      stroke={VIZ_TOKENS.colors.groundExisting}
                      strokeWidth="1.5"
                    />

                    {/* Finished Grade Line (2.5px Bold Centreline) */}
                    <polyline
                      points="70,260 180,225 280,190 380,160 450,140 560,130 660,115 760,110"
                      fill="none"
                      stroke={isPrintMode ? '#0F172A' : '#F8FAFC'}
                      strokeWidth="2.5"
                    />

                    {/* Legend in Drawing Area */}
                    <g transform="translate(560, 42)">
                      <rect x="0" y="0" width="220" height="42" fill={isPrintMode ? '#F1F5F9' : '#0B101E'} stroke={isPrintMode ? '#94A3B8' : '#1E293B'} strokeWidth="1" />
                      {/* EG */}
                      <line x1="12" y1="14" x2="35" y2="14" stroke="#8B6F47" strokeWidth="1.5" />
                      <text x="42" y="17" fill={isPrintMode ? '#0F172A' : '#CBD5E1'} fontSize="8" fontFamily="monospace">Existing Ground (EG)</text>
                      {/* FG */}
                      <line x1="12" y1="28" x2="35" y2="28" stroke={isPrintMode ? '#0F172A' : '#F8FAFC'} strokeWidth="2.5" />
                      <text x="42" y="31" fill={isPrintMode ? '#0F172A' : '#CBD5E1'} fontSize="8" fontFamily="monospace">Finished Road Grade (FG)</text>
                    </g>

                    {/* Out of limit grade flag callout at Station 0+184 */}
                    <g transform="translate(620, 115)">
                      <line x1="0" y1="0" x2="25" y2="-45" stroke="#F59E0B" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="4" fill="#F59E0B" />
                      <g transform="translate(25, -60)">
                        <rect
                          x="0"
                          y="0"
                          width="145"
                          height="24"
                          rx="3"
                          fill="rgba(245, 158, 11, 0.18)"
                          stroke="#F59E0B"
                          strokeWidth="1.2"
                        />
                        <text x="8" y="15" fill="#FBBF24" fontSize="8" fontWeight="700" fontFamily="monospace">
                          {'9.2% > 8.0% limit · Review'}
                        </text>
                      </g>
                    </g>

                    {/* ============================================================== */}
                    {/* CIVIL ENGINEERING BOTTOM DATA BAND (CHAINAGE, FG, EG, CUT/FILL) */}
                    {/* ============================================================== */}
                    <g transform="translate(70, 305)">
                      {/* Data band outer frame & rows */}
                      <rect x="0" y="0" width="710" height="90" fill={isPrintMode ? '#F8FAFC' : '#090E1A'} stroke={isPrintMode ? '#94A3B8' : '#1E293B'} strokeWidth="1" />
                      <line x1="0" y1="22" x2="710" y2="22" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="0.75" />
                      <line x1="0" y1="45" x2="710" y2="45" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="0.75" />
                      <line x1="0" y1="68" x2="710" y2="68" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="0.75" />

                      {/* Header Column on Left */}
                      <rect x="0" y="0" width="120" height="90" fill={isPrintMode ? '#E2E8F0' : '#101728'} />
                      <line x1="120" y1="0" x2="120" y2="90" stroke={isPrintMode ? '#94A3B8' : '#1E293B'} strokeWidth="1" />
                      <text x="10" y="15" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontWeight="700" fontFamily="monospace">GRADE (%)</text>
                      <text x="10" y="38" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontWeight="700" fontFamily="monospace">DESIGN LEVEL (m)</text>
                      <text x="10" y="60" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontWeight="700" fontFamily="monospace">GROUND LEVEL (m)</text>
                      <text x="10" y="82" fill={isPrintMode ? '#0F172A' : '#94A3B8'} fontSize="8" fontWeight="700" fontFamily="monospace">STATION / CHAINAGE</text>

                      {/* Station Data Columns */}
                      {[
                        { x: 170, grade: '+1.80%', fg: '300.20', eg: '300.00', ch: '0+000', station: 0 },
                        { x: 290, grade: '+2.10%', fg: '301.10', eg: '300.70', ch: '0+050', station: 50 },
                        { x: 430, grade: '+2.10%', fg: '302.40', eg: '301.20', ch: '0+100', station: 100 },
                        { x: 570, grade: '+9.20% *', fg: '303.40', eg: '302.10', ch: '0+150', station: 150, isFlag: true },
                        { x: 670, grade: '-0.90%', fg: '303.80', eg: '303.20', ch: '0+200', station: 200 },
                      ].map((col) => (
                        <g
                          key={col.ch}
                          onMouseEnter={() => setHoveredStation(col.station)}
                          style={{ cursor: 'pointer' }}
                        >
                          <line x1={col.x} y1="0" x2={col.x} y2="90" stroke={isPrintMode ? '#E2E8F0' : '#151E30'} strokeWidth="0.75" />
                          <text
                            x={col.x - 20}
                            y="15"
                            fill={col.isFlag ? '#F59E0B' : (isPrintMode ? '#0F172A' : '#F8FAFC')}
                            fontSize="8"
                            fontWeight={col.isFlag ? '700' : '500'}
                            fontFamily="monospace"
                          >
                            {col.grade}
                          </text>
                          <text x={col.x - 20} y="38" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8" fontFamily="monospace">{col.fg}</text>
                          <text x={col.x - 20} y="60" fill={VIZ_TOKENS.colors.groundExisting} fontSize="8" fontFamily="monospace">{col.eg}</text>
                          <text x={col.x - 20} y="82" fill={isPrintMode ? '#0F172A' : '#38BDF8'} fontSize="8" fontWeight="600" fontFamily="monospace">{col.ch}</text>
                        </g>
                      ))}
                    </g>
                  </g>
                )}

                {/* ============================================================== */}
                {/* SHEET 3: XS-01 CROSS-SECTIONS                                  */}
                {/* ============================================================== */}
                {activeCadSheet === 'XS-01' && (
                  <g className="cad-layer">
                    {/* Section 1: Station 0+050 (Cut Section) */}
                    <g transform="translate(60, 60)">
                      <text x="0" y="0" fill={isPrintMode ? '#0F172A' : '#38BDF8'} fontSize="10" fontWeight="700" fontFamily="monospace">
                        SECTION AT CHAINAGE 0+050 (CUT SECTION · 138 m³)
                      </text>
                      <text x="0" y="14" fill={isPrintMode ? '#475569' : '#94A3B8'} fontSize="8" fontFamily="monospace">
                        CL: 301.10m · Cut Depth: 0.40m · Carriageway: 7.00m · Shoulders: 2x 1.50m
                      </text>

                      {/* Dimension String Above Section */}
                      <g transform="translate(120, 25)">
                        <line x1="0" y1="0" x2="280" y2="0" stroke="#64748B" strokeWidth="0.8" />
                        <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="0.8" />
                        <line x1="50" y1="-4" x2="50" y2="4" stroke="#64748B" strokeWidth="0.8" />
                        <line x1="140" y1="-4" x2="140" y2="4" stroke="#64748B" strokeWidth="0.8" />
                        <line x1="230" y1="-4" x2="230" y2="4" stroke="#64748B" strokeWidth="0.8" />
                        <line x1="280" y1="-4" x2="280" y2="4" stroke="#64748B" strokeWidth="0.8" />
                        <text x="25" y="-5" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">1.50m SH</text>
                        <text x="95" y="-5" fill="#F8FAFC" fontSize="7.5" fontFamily="monospace" textAnchor="middle">3.50m LANE</text>
                        <text x="185" y="-5" fill="#F8FAFC" fontSize="7.5" fontFamily="monospace" textAnchor="middle">3.50m LANE</text>
                        <text x="255" y="-5" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">1.50m SH</text>
                      </g>

                      {/* Natural Ground Line (Dotted / Muted Earth) */}
                      <line x1="30" y1="42" x2="490" y2="42" stroke="#8B6F47" strokeWidth="1.5" strokeDasharray="4,2" />
                      <text x="495" y="45" fill="#8B6F47" fontSize="7.5" fontFamily="monospace">EXISTING GROUND (300.70m)</text>

                      {/* Cut Daylighting Slopes (1:1.5 slope into ground) */}
                      <polygon points="50,42 90,80 120,80" fill="url(#cutHatch)" />
                      <polygon points="400,80 430,80 470,42" fill="url(#cutHatch)" />

                      {/* Trapezoidal Concrete Drains on Left and Right (600x600) */}
                      <polygon points="80,50 90,80 110,80 120,50" fill={isPrintMode ? '#CBD5E1' : '#1E293B'} stroke="#0284C7" strokeWidth="1" />
                      <polygon points="400,50 410,80 430,80 440,50" fill={isPrintMode ? '#CBD5E1' : '#1E293B'} stroke="#0284C7" strokeWidth="1" />
                      <text x="95" y="92" fill="#0284C7" fontSize="7" fontFamily="monospace" textAnchor="middle">DRAIN</text>
                      <text x="425" y="92" fill="#0284C7" fontSize="7" fontFamily="monospace" textAnchor="middle">DRAIN</text>

                      {/* Road Pavement Layer Stack (True Relative Thickness) */}
                      <g transform="translate(120, 50)">
                        {/* Layer 1: Asphalt Wearing Course (50mm) */}
                        <polygon
                          points="0,8 140,0 280,8 280,14 140,6 0,14"
                          fill={VIZ_TOKENS.colors.pavementWearing}
                          stroke="#334155"
                          strokeWidth="0.5"
                        />
                        {/* Layer 2: Crushed Stone Base Course (150mm) */}
                        <polygon
                          points="0,14 140,6 280,14 280,28 140,20 0,28"
                          fill={VIZ_TOKENS.colors.pavementBase}
                          stroke="#334155"
                          strokeWidth="0.5"
                        />
                        {/* Layer 3: Granular Subbase Course (200mm) */}
                        <polygon
                          points="0,28 140,20 280,28 280,44 140,36 0,44"
                          fill={VIZ_TOKENS.colors.pavementSubbase}
                          stroke="#334155"
                          strokeWidth="0.5"
                        />
                        {/* Compacted Subgrade Foundation */}
                        <line x1="-10" y1="46" x2="290" y2="46" stroke="#8B6F47" strokeWidth="2" />

                        {/* Crossfall Arrows (-2.5%) */}
                        <text x="65" y="2" fill="#38BDF8" fontSize="7.5" fontFamily="monospace">← -2.5%</text>
                        <text x="200" y="2" fill="#38BDF8" fontSize="7.5" fontFamily="monospace">-2.5% →</text>
                        <line x1="140" y1="-8" x2="140" y2="48" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4,2" />
                        <text x="140" y="-12" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8" fontWeight="700" fontFamily="monospace" textAnchor="middle">CL</text>
                      </g>

                      {/* Layer Callout Annotations on Right */}
                      <g transform="translate(420, 110)">
                        <circle cx="0" cy="0" r="3" fill={VIZ_TOKENS.colors.pavementWearing} />
                        <text x="8" y="3" fill={isPrintMode ? '#0F172A' : '#CBD5E1'} fontSize="7.5" fontFamily="monospace">50mm Asphalt Wearing Course</text>
                        <circle cx="0" cy="14" r="3" fill={VIZ_TOKENS.colors.pavementBase} />
                        <text x="8" y="17" fill={isPrintMode ? '#0F172A' : '#CBD5E1'} fontSize="7.5" fontFamily="monospace">150mm Crushed Stone Base</text>
                        <circle cx="0" cy="28" r="3" fill={VIZ_TOKENS.colors.pavementSubbase} />
                        <text x="8" y="31" fill={isPrintMode ? '#0F172A' : '#CBD5E1'} fontSize="7.5" fontFamily="monospace">200mm Granular Subbase</text>
                      </g>
                    </g>

                    {/* Section 2: Station 0+150 (Typical Section with Embankment) */}
                    <g transform="translate(60, 240)">
                      <text x="0" y="0" fill={isPrintMode ? '#0F172A' : '#38BDF8'} fontSize="10" fontWeight="700" fontFamily="monospace">
                        SECTION AT CHAINAGE 0+150 (CREST SECTION)
                      </text>
                      <text x="0" y="14" fill={isPrintMode ? '#475569' : '#94A3B8'} fontSize="8" fontFamily="monospace">
                        CL: 303.40m · Grade: +9.2% (Flagged) · Daylight Catch: 12.80m
                      </text>

                      {/* Natural Ground Line */}
                      <line x1="30" y1="46" x2="490" y2="46" stroke="#8B6F47" strokeWidth="1.5" strokeDasharray="4,2" />

                      {/* Road Pavement Layer Stack */}
                      <g transform="translate(120, 30)">
                        <polygon
                          points="0,8 140,0 280,8 280,14 140,6 0,14"
                          fill={VIZ_TOKENS.colors.pavementWearing}
                          stroke="#334155"
                          strokeWidth="0.5"
                        />
                        <polygon
                          points="0,14 140,6 280,14 280,28 140,20 0,28"
                          fill={VIZ_TOKENS.colors.pavementBase}
                          stroke="#334155"
                          strokeWidth="0.5"
                        />
                        <polygon
                          points="0,28 140,20 280,28 280,44 140,36 0,44"
                          fill={VIZ_TOKENS.colors.pavementSubbase}
                          stroke="#334155"
                          strokeWidth="0.5"
                        />
                        <line x1="140" y1="-6" x2="140" y2="48" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4,2" />
                      </g>

                      {/* Side Slope Fill Shading */}
                      <polygon points="60,46 120,38 120,74" fill="url(#fillDots)" />
                      <polygon points="400,38 460,46 400,74" fill="url(#fillDots)" />
                    </g>
                  </g>
                )}

                {/* ============================================================== */}
                {/* STANDARD CAD SHEET TITLE BLOCK (BOTTOM RIGHT)                  */}
                {/* ============================================================== */}
                <g transform="translate(370, 400)">
                  {/* Outer Title Block Border */}
                  <rect
                    x="0"
                    y="0"
                    width="450"
                    height="90"
                    fill={isPrintMode ? '#F1F5F9' : '#0B1220'}
                    stroke={isPrintMode ? '#0F172A' : '#334155'}
                    strokeWidth="1.5"
                  />
                  {/* Divider Grid */}
                  <line x1="65" y1="0" x2="65" y2="90" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="1" />
                  <line x1="65" y1="45" x2="450" y2="45" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="1" />
                  <line x1="255" y1="0" x2="255" y2="45" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="1" />
                  <line x1="170" y1="45" x2="170" y2="90" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="1" />
                  <line x1="255" y1="45" x2="255" y2="90" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="1" />
                  <line x1="345" y1="45" x2="345" y2="90" stroke={isPrintMode ? '#CBD5E1' : '#1E293B'} strokeWidth="1" />

                  {/* Brand Block: DariusOS Engineering Stamp */}
                  <g transform="translate(0, 0)">
                    <g transform="translate(17, 7) scale(0.31)">
                      <rect x="18" y="16" width="14" height="68" rx="4" fill={isPrintMode ? '#000000' : '#FFFFFF'} />
                      <line x1="18" y1="33" x2="25" y2="33" stroke={isPrintMode ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="18" y1="50" x2="27" y2="50" stroke={isPrintMode ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="18" y1="67" x2="25" y2="67" stroke={isPrintMode ? '#FFFFFF' : '#0F172A'} strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" stroke={isPrintMode ? '#000000' : '#38BDF8'} strokeWidth="12" strokeLinecap="round" />
                      <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 4" opacity={isPrintMode ? 0.9 : 0.95} />
                    </g>
                    <text x="32" y="52" textAnchor="middle" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="6.5" fontWeight="800" fontFamily="sans-serif">DARIUS OS</text>
                    <text x="32" y="64" textAnchor="middle" fill="#64748B" fontSize="4.5" fontWeight="600" fontFamily="monospace">HIGHWAY CAD</text>
                    <text x="32" y="76" textAnchor="middle" fill={isPrintMode ? '#2563EB' : '#38BDF8'} fontSize="4.5" fontWeight="700" fontFamily="monospace">VERIFIED</text>
                  </g>

                  {/* Top Half: Project & Client */}
                  <g transform="translate(75, 8)">
                    <text x="0" y="8" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="monospace">PROJECT</text>
                    <text x="0" y="24" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="9" fontWeight="700" fontFamily="sans-serif">
                      {projectData.projectName}
                    </text>
                  </g>
                  <g transform="translate(265, 8)">
                    <text x="0" y="8" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="monospace">CLIENT / AUTHORITY</text>
                    <text x="0" y="24" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8.5" fontWeight="600" fontFamily="sans-serif">
                      {projectData.client}
                    </text>
                  </g>

                  {/* Bottom Half: Sheet Title, Sheet ID, Revision, Scale & Status */}
                  <g transform="translate(75, 52)">
                    <text x="0" y="8" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="monospace">DRAWING TITLE</text>
                    <text x="0" y="24" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8" fontWeight="600" fontFamily="sans-serif">
                      {sheets.find((s) => s.id === activeCadSheet)?.name.split('&')[0]}
                    </text>
                  </g>
                  <g transform="translate(180, 52)">
                    <text x="0" y="8" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="monospace">SHEET NO.</text>
                    <text x="0" y="24" fill={isPrintMode ? '#0F172A' : '#38BDF8'} fontSize="9.5" fontWeight="700" fontFamily="monospace">
                      {activeCadSheet}
                    </text>
                  </g>
                  <g transform="translate(265, 52)">
                    <text x="0" y="8" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="monospace">SCALE</text>
                    <text x="0" y="24" fill={isPrintMode ? '#0F172A' : '#F8FAFC'} fontSize="8.5" fontFamily="monospace">
                      {sheets.find((s) => s.id === activeCadSheet)?.scale}
                    </text>
                  </g>
                  <g transform="translate(355, 52)">
                    <text x="0" y="8" fill="#64748B" fontSize="7" fontWeight="700" fontFamily="monospace">REV / STATUS</text>
                    <text x="0" y="24" fill="#16A34A" fontSize="8" fontWeight="700" fontFamily="monospace">
                      REV C · APPROVED
                    </text>
                  </g>
                </g>
              </svg>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
