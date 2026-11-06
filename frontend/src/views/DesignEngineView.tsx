import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useProject } from '../context/ProjectContext';
import type {
  AlignmentPackage,
  CrossSectionPackage,
  CrossSectionSlice,
  ProfilePackage,
  ProfilePoint,
  QuantitiesPackage,
} from '../api';

const GROUND = '#38BDF8';
const DESIGN = '#F59E0B';
const PLOT_W = 640;
const PLOT_H = 170;
const X0 = 46;
const Y0 = 26;

const fmt = (n: number, digits = 1) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : '—';

function niceTicks(min: number, max: number, count = 4): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
  return Array.from({ length: count + 1 }, (_, i) => min + ((max - min) * i) / count);
}

const LegendRow: React.FC<{ items: { color: string; label: string; dot?: boolean }[] }> = ({ items }) => (
  <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 }, alignItems: 'center', flexWrap: 'wrap', mb: 1.5 }}>
    {items.map(item => (
      <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          sx={{
            width: item.dot ? 6 : 14,
            height: item.dot ? 6 : 2,
            borderRadius: item.dot ? '50%' : 0,
            backgroundColor: item.color,
          }}
        />
        <Typography sx={{ fontSize: '0.71875rem', color: '#9AA3B2' }}>{item.label}</Typography>
      </Box>
    ))}
  </Box>
);

const EmptyState: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <Box sx={{ py: 6, textAlign: 'center', color: '#94A3B8' }}>
    <Typography sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>{title}</Typography>
    <Typography sx={{ fontSize: '0.8125rem', color: '#64748B' }}>{body}</Typography>
  </Box>
);

/* ------------------------------- profile chart ------------------------------ */
const ProfileChart: React.FC<{ profile: ProfilePackage }> = ({ profile }) => {
  const points = profile.profile_points;
  if (points.length < 2) return <EmptyState title="No profile points" body="Run the pipeline to generate a longitudinal profile." />;

  const elevs = points.flatMap(p => [p.ground_elevation_m, p.design_elevation_m]);
  const min = Math.min(...elevs);
  const max = Math.max(...elevs);
  const total = Math.max(points[points.length - 1].station_m, 1);
  const toX = (s: number) => X0 + (s / total) * PLOT_W;
  const toY = (e: number) => Y0 + (1 - (e - min) / Math.max(max - min, 0.01)) * PLOT_H;

  const ground = points.map(p => `${toX(p.station_m).toFixed(1)},${toY(p.ground_elevation_m).toFixed(1)}`).join(' ');
  const design = points.map(p => `${toX(p.station_m).toFixed(1)},${toY(p.design_elevation_m).toFixed(1)}`).join(' ');
  const maxGradePoint = points.reduce((best, p) => (Math.abs(p.grade_percent) > Math.abs(best.grade_percent) ? p : best), points[0]);

  return (
    <>
      <LegendRow items={[{ color: GROUND, label: 'Existing ground' }, { color: DESIGN, label: 'Design profile' }, { color: '#EF4444', label: 'Max grade', dot: true }]} />
      <Box sx={{ width: '100%', height: { xs: 220, sm: 250 }, backgroundColor: '#090D16', borderRadius: 1.5, border: '1px solid #1E293B', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 700 250" preserveAspectRatio="none">
          {niceTicks(min, max).map(t => (
            <g key={t}>
              <line x1={X0} y1={toY(t)} x2={X0 + PLOT_W} y2={toY(t)} stroke="#162238" strokeDasharray="3,3" />
              <text x="12" y={toY(t) + 4} fill="#6C7686" fontSize="11" fontFamily="monospace">{Math.round(t)}</text>
            </g>
          ))}
          <polyline points={ground} fill="none" stroke={GROUND} strokeWidth="2.2" />
          <polyline points={design} fill="none" stroke={DESIGN} strokeWidth="2.2" />
          <circle cx={toX(maxGradePoint.station_m)} cy={toY(maxGradePoint.design_elevation_m)} r="4.5" fill="#EF4444" stroke="#fff" strokeWidth="1.2" />
          {niceTicks(0, total, 4).map(t => (
            <text key={t} x={toX(t)} y={Y0 + PLOT_H + 24} fill="#6C7686" fontSize="11" textAnchor="middle">
              {`${Math.floor(t / 1000)}+${String(Math.round(t % 1000)).padStart(3, '0')}`}
            </text>
          ))}
        </svg>
      </Box>
    </>
  );
};

/* -------------------------------- plan chart -------------------------------- */
const PlanChart: React.FC<{ alignment: AlignmentPackage }> = ({ alignment }) => {
  const stations = alignment.stations;
  if (stations.length < 2) return <EmptyState title="No alignment" body="Run the pipeline to generate a horizontal alignment." />;

  const xs = stations.map(s => s.x);
  const ys = stations.map(s => s.y);
  const minX = Math.min(...xs); const maxX = Math.max(...xs);
  const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const pad = 30;
  const sx = (x: number) => pad + ((x - minX) / Math.max(maxX - minX, 0.01)) * (700 - pad * 2);
  const sy = (y: number) => pad + (1 - (y - minY) / Math.max(maxY - minY, 0.01)) * (320 - pad * 2);
  const line = stations.map(s => `${sx(s.x).toFixed(1)},${sy(s.y).toFixed(1)}`).join(' ');

  return (
    <>
      <LegendRow items={[{ color: '#F8FAFC', label: 'Centreline' }, { color: '#10B981', label: 'Start', dot: true }, { color: '#EF4444', label: 'End', dot: true }]} />
      <Box sx={{ width: '100%', height: { xs: 260, sm: 320 }, backgroundColor: '#090D16', borderRadius: 1.5, border: '1px solid #1E293B', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 700 320" preserveAspectRatio="none">
          {[0, 1, 2, 3, 4].map(i => (
            <React.Fragment key={i}>
              <line x1={pad} y1={pad + (i * (320 - pad * 2)) / 4} x2={700 - pad} y2={pad + (i * (320 - pad * 2)) / 4} stroke="#162238" strokeDasharray="3,3" />
              <line x1={pad + (i * (700 - pad * 2)) / 4} y1={pad} x2={pad + (i * (700 - pad * 2)) / 4} y2={320 - pad} stroke="#162238" strokeDasharray="3,3" />
            </React.Fragment>
          ))}
          <polyline points={line} fill="none" stroke="#F8FAFC" strokeWidth="2.4" />
          <circle cx={sx(stations[0].x)} cy={sy(stations[0].y)} r="5" fill="#10B981" />
          <circle cx={sx(stations[stations.length - 1].x)} cy={sy(stations[stations.length - 1].y)} r="5" fill="#EF4444" />
        </svg>
      </Box>
    </>
  );
};

/* ------------------------------ section chart ------------------------------- */
const SectionChart: React.FC<{ section: CrossSectionSlice }> = ({ section }) => {
  const ground = section.ground_profile;
  const design = section.design_template;
  if (!ground.length || !design.length) return <EmptyState title="No section geometry" body="Select a station from a completed run." />;

  const offsets = [...ground.map(p => p.offset_m), ...design.map(p => p.offset_m)];
  const elevs = [...ground.map(p => p.elevation_m), ...design.map(p => p.elevation_m)];
  const minO = Math.min(...offsets); const maxO = Math.max(...offsets);
  const minE = Math.min(...elevs) - 0.4; const maxE = Math.max(...elevs) + 0.4;
  const pad = 28;
  const sx = (o: number) => pad + ((o - minO) / Math.max(maxO - minO, 0.01)) * (700 - pad * 2);
  const sy = (e: number) => pad + (1 - (e - minE) / Math.max(maxE - minE, 0.01)) * (320 - pad * 2);
  const groundLine = ground.map(p => `${sx(p.offset_m).toFixed(1)},${sy(p.elevation_m).toFixed(1)}`).join(' ');
  const designLine = design.map(p => `${sx(p.offset_m).toFixed(1)},${sy(p.elevation_m).toFixed(1)}`).join(' ');

  return (
    <>
      <LegendRow items={[{ color: GROUND, label: 'Existing ground' }, { color: DESIGN, label: 'Road formation' }]} />
      <Box sx={{ width: '100%', height: { xs: 240, sm: 320 }, backgroundColor: '#090D16', borderRadius: 1.5, border: '1px solid #1E293B', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 700 320" preserveAspectRatio="none">
          <line x1={sx(0)} y1={pad} x2={sx(0)} y2={320 - pad} stroke="#2E3644" strokeDasharray="4,4" />
          <polyline points={groundLine} fill="none" stroke={GROUND} strokeWidth="2.2" />
          <polyline points={designLine} fill="none" stroke={DESIGN} strokeWidth="2.6" />
        </svg>
      </Box>
    </>
  );
};

/* ------------------------------ gradient table ------------------------------ */
type Segment = { from: number; to: number; grade: number; result: 'Cut' | 'Fill' | 'Mixed' };
function buildSegments(profile: ProfilePackage): Segment[] {
  const points = profile.profile_points;
  const segments: Segment[] = [];
  let current: ProfilePoint[] = [];
  let mode: 'CUT' | 'FILL' | 'AT_GRADE' | null = null;
  for (const p of points) {
    if (mode === null) { mode = p.cut_or_fill; current = [p]; continue; }
    if (p.cut_or_fill === mode) { current.push(p); continue; }
    if (current.length >= 2) {
      const a = current[0]; const b = current[current.length - 1];
      const length = b.station_m - a.station_m;
      segments.push({
        from: a.station_m,
        to: b.station_m,
        grade: length > 0 ? ((b.design_elevation_m - a.design_elevation_m) / length) * 100 : 0,
        result: mode === 'CUT' ? 'Cut' : mode === 'FILL' ? 'Fill' : 'Mixed',
      });
    }
    mode = p.cut_or_fill; current = [p];
  }
  if (current.length >= 2) {
    const a = current[0]; const b = current[current.length - 1];
    const length = b.station_m - a.station_m;
    segments.push({
      from: a.station_m,
      to: b.station_m,
      grade: length > 0 ? ((b.design_elevation_m - a.design_elevation_m) / length) * 100 : 0,
      result: mode === 'CUT' ? 'Cut' : mode === 'FILL' ? 'Fill' : 'Mixed',
    });
  }
  return segments;
}

const chainage = (m: number) => `${Math.floor(m / 1000)}+${String(Math.round(m % 1000)).padStart(3, '0')}`;

/* ---------------------------------- view ----------------------------------- */
export const DesignEngineView: React.FC = () => {
  const {
    activeDesignTab,
    setActiveDesignTab,
    activeBackendProject,
    activeSurveyId,
    liveAlignment,
    liveProfile,
    liveSections,
    liveQuantities,
    isRunBusy,
    runError,
    triggerRun,
    projectData,
  } = useProject();

  const [startX, setStartX] = useState('100000');
  const [startY, setStartY] = useState('200000');
  const [endX, setEndX] = useState('100200');
  const [endY, setEndY] = useState('200000');
  const [interval, setInterval] = useState('20');
  const [offset, setOffset] = useState('0');
  const [sectionIndex, setSectionIndex] = useState(0);

  // Seed route inputs from the active run so regeneration starts from the real route.
  useEffect(() => {
    if (liveAlignment) {
      setStartX(String(liveAlignment.start_point[0]));
      setStartY(String(liveAlignment.start_point[1]));
      setEndX(String(liveAlignment.end_point[0]));
      setEndY(String(liveAlignment.end_point[1]));
      setInterval(String(liveAlignment.station_interval_m));
    }
  }, [liveAlignment?.start_point[0], liveAlignment?.start_point[1], liveAlignment?.end_point[0], liveAlignment?.end_point[1], liveAlignment?.station_interval_m]);

  useEffect(() => {
    setSectionIndex(0);
  }, [liveSections?.total_sections]);

  const sections = liveSections?.sections ?? [];
  const activeSection = sections[Math.min(sectionIndex, Math.max(sections.length - 1, 0))];
  const segments = useMemo(() => (liveProfile ? buildSegments(liveProfile) : []), [liveProfile]);
  const runs = activeBackendProject?.runs ?? [];
  const activeSurvey =
    activeBackendProject?.surveys?.find(item => item.id === activeSurveyId) ??
    activeBackendProject?.surveys?.[0];

  const handleRun = () => {
    const sx = parseFloat(startX); const sy = parseFloat(startY);
    const ex = parseFloat(endX); const ey = parseFloat(endY);
    const stationInterval = parseFloat(interval);
    const elevationOffset = parseFloat(offset);
    if (![sx, sy, ex, ey, stationInterval].every(Number.isFinite)) return;
    triggerRun({
      survey_file_id: activeSurveyId ?? '',
      start_point: [sx, sy],
      end_point: [ex, ey],
      station_interval_m: stationInterval,
      target_elevation_offset_m: Number.isFinite(elevationOffset) ? elevationOffset : 0,
      force_recompute: true,
    });
  };

  const gradeCompliant = Boolean(liveProfile?.is_grade_compliant ?? liveAlignment?.is_grade_compliant);
  const lengthM = liveAlignment?.total_length_m ?? activeBackendProject?.runs?.[0]?.total_road_length_m ?? 0;
  const cutM3 = liveQuantities?.total_cut_volume_m3 ?? 0;
  const fillM3 = liveQuantities?.total_fill_volume_m3 ?? 0;
  const netM3 = liveQuantities?.net_volume_m3 ?? 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Route inputs + run */}
      <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Route and design run</Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              The engine generates alignment, profile, sections and quantities from the selected route.
            </Typography>
          </Box>
          {activeSurvey && (
            <Chip size="small" label={activeSurvey.original_filename} sx={{ backgroundColor: '#1E293B', color: '#94A3B8' }} />
          )}
        </Box>

        <Grid container spacing={1.5}>
          <Grid item xs={6} sm={3} md={2}>
            <TextField size="small" fullWidth label="Start X" value={startX} onChange={e => setStartX(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField size="small" fullWidth label="Start Y" value={startY} onChange={e => setStartY(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField size="small" fullWidth label="End X" value={endX} onChange={e => setEndX(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField size="small" fullWidth label="End Y" value={endY} onChange={e => setEndY(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField size="small" fullWidth label="Station (m)" value={interval} onChange={e => setInterval(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField size="small" fullWidth label="Offset (m)" value={offset} onChange={e => setOffset(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handleRun}
                disabled={!activeSurveyId || isRunBusy}
                startIcon={isRunBusy ? <CircularProgress size={16} color="inherit" /> : undefined}
                sx={{ backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1D4ED8' } }}
              >
                {isRunBusy ? 'Running pipeline…' : 'Run design pipeline'}
              </Button>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {activeSurveyId ? 'Survey ready' : 'Upload a survey first'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {runs.length ? `${runs.length} run(s) · latest ${runs[0].status}` : 'No runs yet'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {runError && <Alert severity="error" sx={{ mt: 2 }}>{runError}</Alert>}

        {runs.length > 0 && (
          <Box sx={{ mt: 2, borderTop: '1px solid #1E293B', pt: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.04em', display: 'block', mb: 1 }}>
              RUN HISTORY
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {runs.slice(0, 4).map(run => (
                <Box key={run.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', fontSize: '0.75rem' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#C3C9D4' }}>
                    {run.id.slice(0, 8)} · {new Date(run.created_at).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, color: '#94A3B8', fontSize: '0.75rem' }}>
                    <span>{run.status}</span>
                    <span>{fmt(run.total_road_length_m ?? 0, 0)} m</span>
                    <span>cut {fmt(run.total_cut_volume_m3 ?? 0, 0)} m³</span>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Card>

      {/* Engine summary */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#0A0E17', border: '1px solid #1E293B' }}>
        <Grid container spacing={2} alignItems="center">
          {[
            { title: 'Design criteria', detail: projectData.applicableStandard || 'FMW&H / AASHTO', ok: true },
            { title: 'Engine calculates', detail: liveAlignment ? `${fmt(lengthM, 0)} m · ${liveSections?.total_sections ?? 0} sections` : 'Awaiting run', ok: Boolean(liveAlignment) },
            { title: 'Grade validation', detail: liveProfile ? `${fmt(liveProfile.max_detected_design_grade_percent, 2)}% max (limit ${fmt(liveProfile.max_allowable_grade_percent, 1)}%)` : 'Awaiting run', ok: gradeCompliant },
            { title: 'Earthworks', detail: liveQuantities ? `${fmt(cutM3, 0)} m³ cut · ${fmt(fillM3, 0)} m³ fill` : 'Awaiting run', ok: Boolean(liveQuantities) },
          ].map(item => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.ok ? (
                  <CheckCircleOutlinedIcon sx={{ color: '#10B981', fontSize: '1.1rem' }} />
                ) : (
                  <WarningAmberOutlinedIcon sx={{ color: '#F59E0B', fontSize: '1.1rem' }} />
                )}
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>{item.title}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>{item.detail}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2.5, borderBottom: '1px solid #1E293B', pb: 1.5, overflowX: 'auto', '& > *': { flexShrink: 0, whiteSpace: 'nowrap' } }}>
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

            {activeDesignTab === 'Longitudinal profile' && (
              liveProfile ? <ProfileChart profile={liveProfile} /> : <EmptyState title="No profile yet" body="Enter a route and run the pipeline to generate the profile." />
            )}
            {activeDesignTab === 'Horizontal alignment' && (
              liveAlignment ? <PlanChart alignment={liveAlignment} /> : <EmptyState title="No alignment yet" body="Run the pipeline to generate the horizontal alignment." />
            )}
            {activeDesignTab === 'Cross-section' && (
              liveSections && activeSection ? (
                <>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: 1.5 }}>
                    <TextField
                      select
                      size="small"
                      label="Station"
                      value={String(sectionIndex)}
                      onChange={e => setSectionIndex(Number(e.target.value))}
                      sx={{ minWidth: 160 }}
                    >
                      {sections.map((sec, idx) => (
                        <MenuItem key={`${sec.station_m}-${idx}`} value={String(idx)}>
                          {chainage(sec.station_m)} · {sec.section_class}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Chip size="small" label={`Cut ${fmt(activeSection.cut_area_m2, 2)} m²`} sx={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                    <Chip size="small" label={`Fill ${fmt(activeSection.fill_area_m2, 2)} m²`} sx={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#34D399' }} />
                  </Box>
                  <SectionChart section={activeSection} />
                </>
              ) : <EmptyState title="No cross-sections yet" body="Run the pipeline to generate sections at each station." />
            )}

            <TableContainer sx={{ borderRadius: 1, border: '1px solid #1E293B', overflowX: 'auto', mt: 2.5 }}>
              <Table size="small" sx={{ minWidth: 420 }}>
                <TableHead sx={{ backgroundColor: '#0A0E17' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>CHAINAGE</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>GRADE</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>SECTION</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1, textAlign: 'right' }}>CUT m³</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1, textAlign: 'right' }}>FILL m³</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(liveQuantities?.intervals?.length ? liveQuantities.intervals : []).slice(0, 12).map(iv => (
                    <TableRow key={iv.interval_id} sx={{ '&:hover': { backgroundColor: '#131D2E' } }}>
                      <TableCell sx={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {chainage(iv.from_station_m)} – {chainage(iv.to_station_m)}
                      </TableCell>
                      <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
                        {segments.find(s => iv.from_station_m >= s.from && iv.from_station_m < s.to)?.grade.toFixed(2) ?? '—'}%
                      </TableCell>
                      <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>{iv.incremental_cut_m3 > 0 ? 'Cut' : iv.incremental_fill_m3 > 0 ? 'Fill' : 'At grade'}</TableCell>
                      <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(iv.incremental_cut_m3, 1)}</TableCell>
                      <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(iv.incremental_fill_m3, 1)}</TableCell>
                    </TableRow>
                  ))}
                  {!liveQuantities?.intervals?.length && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ color: '#64748B', fontSize: '0.8rem', textAlign: 'center', py: 2 }}>
                        No interval quantities yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Validation</Typography>
            <Grid container spacing={1} sx={{ mb: 2.5 }}>
              {[
                { label: 'LENGTH', value: `${fmt(lengthM, 0)} m`, color: '#38BDF8' },
                { label: 'CUT', value: `${fmt(cutM3, 0)} m³`, color: '#F87171' },
                { label: 'FILL', value: `${fmt(fillM3, 0)} m³`, color: '#34D399' },
              ].map(m => (
                <Grid item xs={4} key={m.label}>
                  <Box sx={{ p: 1.2, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid #1E293B', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: m.color, fontSize: '1.05rem' }}>{m.value}</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>{m.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { name: 'Alignment grade', ok: Boolean(liveAlignment?.is_grade_compliant), detail: liveAlignment ? `${fmt(liveAlignment.max_detected_ground_grade_percent, 2)}% ground` : 'No run' },
                { name: 'Design grade', ok: Boolean(liveProfile?.is_grade_compliant), detail: liveProfile ? `${fmt(liveProfile.max_detected_design_grade_percent, 2)}% design` : 'No run' },
                { name: 'Cross-sections', ok: sections.length > 0, detail: `${sections.length} generated` },
                { name: 'Earthwork balance', ok: Boolean(liveQuantities), detail: liveQuantities ? `${fmt(netM3, 0)} m³ net · ${liveQuantities.balance_status}` : 'No run' },
              ].map(check => (
                <Box key={check.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px solid #1A2436', gap: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#CBD5E1' }}>{check.name}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{check.detail}</Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={check.ok ? 'Pass' : 'Pending'}
                    sx={{
                      backgroundColor: check.ok ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: check.ok ? '#34D399' : '#FBBF24',
                      fontWeight: 600,
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
