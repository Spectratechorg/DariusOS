import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, Chip, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useProject } from '../context/ProjectContext';
import {
  uploadSurvey, fetchSurveys, fetchSurveyReport,
  SurveyUploadResponse, SurveySummary, QualityReport,
} from '../api';

const FALLBACK_PROJECT_ID = '03f1bafd-6d19-4d49-8314-01465ce39d1b';

type CheckStatus = 'Pass' | 'Warning' | 'Fail';
const chipSx = (s: CheckStatus) => ({
  fontWeight: 500,
  fontSize: '0.71875rem',
  border: 'none',
  backgroundColor:
    s === 'Pass' ? 'rgba(70,185,138,0.12)' : s === 'Warning' ? 'rgba(227,169,72,0.12)' : 'rgba(228,105,94,0.12)',
  color: s === 'Pass' ? '#64C9A1' : s === 'Warning' ? '#EFC06A' : '#EE8B82',
});

const buildChecks = (r: QualityReport) => {
  const has = (list: string[], word: string) => list.some(t => t.toLowerCase().includes(word));
  const outliers = r.spikes_count + r.holes_count;
  const rows: { name: string; status: CheckStatus; detail: string }[] = [
    {
      name: 'Coordinate system',
      status: has(r.errors, 'geographic') ? 'Fail' : has(r.warnings, 'geographic') ? 'Warning' : 'Pass',
      detail: `EPSG ${r.crs_epsg ?? 'n/a'}`,
    },
    { name: 'Duplicate points', status: r.duplicate_count ? 'Warning' : 'Pass', detail: `${r.duplicate_count} found` },
    { name: 'Blank / invalid values', status: r.blank_or_nan_count ? 'Warning' : 'Pass', detail: `${r.blank_or_nan_count} found` },
    { name: 'Elevation outliers', status: outliers ? 'Warning' : 'Pass', detail: `${outliers} flagged` },
    { name: 'Point spacing', status: has(r.warnings, 'sparse') ? 'Warning' : 'Pass', detail: `${r.density_pts_m2.toFixed(3)} pts/m²` },
    {
      name: 'Valid points',
      status: r.verdict === 'REJECTED' ? 'Fail' : 'Pass',
      detail: `${r.valid_points.toLocaleString()} of ${r.total_raw_points.toLocaleString()}`,
    },
  ];
  return rows;
};

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Box sx={{ minWidth: { xs: 'calc(50% - 12px)', sm: 130 } }}>
    <Typography variant="caption" sx={{ color: '#6C7686', display: 'block' }}>{label}</Typography>
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: '0.84375rem',
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </Typography>
  </Box>
);

export const SurveyValidationView: React.FC = () => {
  const { backendProjects } = useProject();
  const projectId = backendProjects[0]?.id ?? FALLBACK_PROJECT_ID;

  const [file, setFile] = useState<File | null>(null);
  const [crs, setCrs] = useState('32632');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SurveyUploadResponse | null>(null);
  const [surveys, setSurveys] = useState<SurveySummary[]>([]);
  const [acked, setAcked] = useState<Set<string>>(new Set());

  const loadSurveys = () => fetchSurveys(projectId).then(setSurveys).catch(() => {});
  useEffect(() => { loadSurveys(); }, [projectId]);

  const show = (r: SurveyUploadResponse) => { setResult(r); setAcked(new Set()); };

  const submit = async () => {
    if (!file) return;
    setBusy(true); setError(null); setResult(null);
    try { show(await uploadSurvey(projectId, file, parseInt(crs, 10))); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); loadSurveys(); }
  };

  const openSurvey = async (s: SurveySummary) => {
    setError(null);
    try {
      const rep = await fetchSurveyReport(s.id);
      show({
        file_id: s.id, project_id: projectId, original_filename: s.original_filename,
        file_format: s.file_format, sha256_hash: s.sha256_hash, file_size_bytes: s.file_size_bytes,
        status: s.status, quality_report: rep.quality_report,
        plain_language_summary: rep.quality_report?.summary_text ?? '',
      });
    } catch (e) { setError((e as Error).message); }
  };

  const toggleAck = (id: string) =>
    setAcked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const r = result?.quality_report;
  const b = r?.bounds;
  const checks = r ? buildChecks(r) : [];
  const issues = r
    ? [...r.errors.map((t, i) => ({ id: `e${i}`, text: t, sev: 'Error' as const })),
       ...r.warnings.map((t, i) => ({ id: `w${i}`, text: t, sev: 'Warning' as const }))]
    : [];
  const flagged = checks.filter(c => c.status !== 'Pass').length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Left column */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Upload survey</Typography>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2 }}>
              LAS, LAZ, XYZ or CSV. Project: {projectId.slice(0, 8)}...
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button component="label" variant="outlined" startIcon={<UploadFileOutlinedIcon />}
                sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                {file ? file.name : 'Choose file'}
                <input hidden type="file" accept=".csv,.txt,.xyz,.las,.laz"
                  onChange={e => setFile(e.target.files?.[0] ?? null)} />
              </Button>
              <TextField label="CRS (EPSG)" size="small" value={crs}
                onChange={e => setCrs(e.target.value.replace(/\D/g, ''))} sx={{ width: { xs: '100%', sm: 140 } }} />
              <Button variant="contained" disabled={!file || !crs || busy} onClick={submit}
                sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                {busy ? <CircularProgress size={20} /> : 'Upload and validate'}
              </Button>
            </Box>
          </Card>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {result && r && b && (
            <>
              <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{result.original_filename}</Typography>
                  <Chip label={r.verdict} size="small" sx={chipSx(r.verdict === 'PASSED' ? 'Pass' : r.verdict === 'REJECTED' ? 'Fail' : 'Warning')} />
                  <Chip label={result.status} size="small" variant="outlined" />
                  <Chip label={result.file_format} size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                  <Stat label="Raw points" value={r.total_raw_points.toLocaleString()} />
                  <Stat label="Valid points" value={r.valid_points.toLocaleString()} />
                  <Stat label="Density (pts/m²)" value={r.density_pts_m2.toFixed(3)} />
                  <Stat label="CRS (EPSG)" value={r.crs_epsg ?? 'n/a'} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Stat label="Easting (m)" value={`${b.min_x.toFixed(1)} to ${b.max_x.toFixed(1)}`} />
                  <Stat label="Northing (m)" value={`${b.min_y.toFixed(1)} to ${b.max_y.toFixed(1)}`} />
                  <Stat label="Elevation (m)" value={`${b.min_z.toFixed(2)} to ${b.max_z.toFixed(2)}`} />
                </Box>
                <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mt: 2 }}>
                  SHA-256 {result.sha256_hash.slice(0, 16)}... · {(result.file_size_bytes / 1024).toFixed(1)} KB
                </Typography>
              </Card>

              <Card sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Warnings for the engineer</Typography>
                <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2 }}>
                  {acked.size} of {issues.length} acknowledged.
                </Typography>
                {issues.length === 0 && <Typography variant="body2" sx={{ color: '#64C9A1' }}>No warnings.</Typography>}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {issues.map(w => (
                    <Box key={w.id} sx={{ p: 1.5, borderRadius: '8px', border: '1px solid #1B2029', backgroundColor: '#0C1017',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ minWidth: 0, flex: '1 1 200px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: w.sev === 'Error' ? '#EE8B82' : '#E7EAF0' }}>
                          {w.sev}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9AA3B2' }}>{w.text}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        {acked.has(w.id) && <Chip label="Acknowledged" size="small" sx={chipSx('Pass')} />}
                        <Button size="small" onClick={() => toggleAck(w.id)}
                          sx={{ color: '#6C7686', textTransform: 'none' }}>
                          {acked.has(w.id) ? 'Reopen' : 'Acknowledge'}
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </>
          )}
        </Grid>

        {/* Right column */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Validation checks</Typography>
              {r && <Chip label={flagged ? `${flagged} flagged` : 'All pass'} size="small" sx={chipSx(flagged ? 'Warning' : 'Pass')} />}
            </Box>
            {!r && <Typography variant="caption" sx={{ color: '#9AA3B2' }}>Upload or open a survey to see checks.</Typography>}
            {checks.map(c => (
              <Box key={c.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                py: 0.8, borderBottom: '1px solid #1B2029', gap: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.825rem' }}>{c.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#6C7686' }}>{c.detail}</Typography>
                </Box>
                <Chip label={c.status} size="small" sx={chipSx(c.status)} />
              </Box>
            ))}
          </Card>

          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Uploaded surveys ({surveys.length})</Typography>
            {surveys.length === 0 && <Typography variant="caption" sx={{ color: '#9AA3B2' }}>None yet.</Typography>}
            {surveys.map(s => (
              <Box key={s.id} onClick={() => openSurvey(s)}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, gap: 1.5,
                  borderBottom: '1px solid #1B2029', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{s.original_filename}</Typography>
                  <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                    {s.file_format} · {s.point_count?.toLocaleString() ?? '?'} pts
                  </Typography>
                </Box>
                <Chip label={s.status} size="small" variant="outlined" sx={{ flexShrink: 0 }} />
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};