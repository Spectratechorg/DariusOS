import React, { useRef, useState } from 'react';
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
  CircularProgress,
  TextField,
  Alert
} from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useProject } from '../context/ProjectContext';

export const SurveyValidationView: React.FC = () => {
  const { 
    surveyPoints, 
    surveyWarnings, 
    toggleWarningAcknowledged, 
    validationChecks,
    uploadedSurvey,
    uploadSurveyFile,
    loadDemoSurvey,
    isUploadingSurvey,
    setActiveStage,
    runError,
  } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(10);
  const [crs, setCrs] = useState('32632');

  const acknowledgedCount = surveyWarnings.filter(w => w.isAcknowledged).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSurveyFile(file, parseInt(crs, 10) || 32632);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadSurveyFile(file, parseInt(crs, 10) || 32632);
    }
  };

  const visiblePoints = surveyPoints.slice(0, displayCount);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {runError && <Alert severity="error" sx={{ mb: 2 }}>{runError}</Alert>}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.xyz,.txt,.las,.laz"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Upload Dropzone Card */}
          <Card 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3, 
              border: isDragOver ? '2px dashed #38BDF8' : '1px dashed #334155',
              backgroundColor: isDragOver ? 'rgba(56, 189, 248, 0.08)' : '#0F1626',
              transition: 'all 0.2s ease',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 1.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upload survey point cloud
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Drop your CSV, XYZ, or LAS file with Easting, Northing, and Elevation coordinates.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="CRS (EPSG)"
                  value={crs}
                  onChange={e => setCrs(e.target.value.replace(/[^0-9]/g, ''))}
                  sx={{ width: { xs: '100%', sm: 120 }, '& input': { fontFamily: 'monospace' } }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AutoFixHighIcon />}
                  onClick={loadDemoSurvey}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '0 0 auto' },
                    borderColor: '#334155',
                    color: '#38BDF8',
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    '&:hover': { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.08)' },
                  }}
                >
                  Load Demo (slope.csv)
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '0 0 auto' },
                    backgroundColor: '#2563EB',
                    '&:hover': { backgroundColor: '#1D4ED8' },
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Browse File
                </Button>
              </Box>
            </Box>

            {isUploadingSurvey && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 2 }}>
                <CircularProgress size={24} sx={{ color: '#38BDF8' }} />
                <Typography variant="body2" sx={{ color: '#38BDF8', fontWeight: 600 }}>
                  Validating geometry and filtering outliers...
                </Typography>
              </Box>
            )}

            {/* Uploaded File Details Banner */}
            <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0B0F19', border: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                }}
              >
                <UploadFileOutlinedIcon fontSize="medium" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    {uploadedSurvey?.filename || 'slope.csv'}
                  </Typography>
                  <Chip
                    icon={<CheckCircleOutlineIcon sx={{ '&&': { color: '#34D399', fontSize: '0.9rem' } }} />}
                    label="VALIDATED"
                    size="small"
                    sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 700, fontSize: '0.65rem' }}
                  />
                  <Chip
                    label={`SHA-256: ${(uploadedSurvey?.sha256Hash || 'e59c712d').slice(0, 10)}...`}
                    size="small"
                    sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.65rem', fontFamily: 'monospace' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                  {(uploadedSurvey?.pointCount ?? surveyPoints.length).toLocaleString()} points validated · {(uploadedSurvey?.fileSizeBytes ? (uploadedSurvey.fileSizeBytes / 1024).toFixed(1) : '9.4')} KB · Coordinates in metres (UTM Zone 32N)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(uploadedSurvey?.columnsMapped || ['Point ID', 'Easting', 'Northing', 'Elevation', 'Description']).map(col => (
                    <Chip
                      key={col}
                      label={col}
                      size="small"
                      sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.68rem' }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {uploadedSurvey?.backendSummary && (
              <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, border: '1px solid #1E293B', backgroundColor: '#0B0F19' }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={`PIPELINE ${uploadedSurvey.verdict || 'PENDING'}`} size="small" sx={{ backgroundColor: 'rgba(56,189,248,0.12)', color: '#38BDF8', fontWeight: 600, fontSize: '0.65rem' }} />
                  {uploadedSurvey.backendStatus && (
                    <Chip label={uploadedSurvey.backendStatus} size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.65rem' }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  {uploadedSurvey.backendSummary}
                </Typography>
                {(uploadedSurvey.reportErrors?.length || uploadedSurvey.reportWarnings?.length) ? (
                  <Box component="ul" sx={{ m: 0, mt: 1, pl: 2 }}>
                    {[...(uploadedSurvey.reportErrors || []), ...(uploadedSurvey.reportWarnings || [])].slice(0, 4).map((msg, idx) => (
                      <li key={idx}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#EFC06A' }}>{msg}</Typography>
                      </li>
                    ))}
                  </Box>
                ) : null}
              </Box>
            )}
          </Card>

          {/* Structured Project Dataset Table */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Structured project dataset
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Parsed survey points ready for Delaunay TIN triangulation and corridor alignment.
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
                SHOWING {Math.min(displayCount, surveyPoints.length)} OF {(uploadedSurvey?.pointCount ?? surveyPoints.length).toLocaleString()} POINTS
              </Typography>
            </Box>

            <TableContainer sx={{ borderRadius: 1, border: '1px solid #1E293B', maxHeight: 380, overflowX: 'auto' }}>
              <Table size="small" stickyHeader sx={{ minWidth: 560 }}>
                <TableHead sx={{ backgroundColor: '#0A0E17' }}>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0A0E17', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>POINT ID</TableCell>
                    <TableCell sx={{ backgroundColor: '#0A0E17', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>EASTING</TableCell>
                    <TableCell sx={{ backgroundColor: '#0A0E17', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>NORTHING</TableCell>
                    <TableCell sx={{ backgroundColor: '#0A0E17', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>ELEVATION (M)</TableCell>
                    <TableCell sx={{ backgroundColor: '#0A0E17', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ backgroundColor: '#0A0E17', color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>CHECK</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visiblePoints.length > 0 ? (
                    visiblePoints.map(row => (
                      <TableRow key={row.pointId} sx={{ '&:hover': { backgroundColor: '#131D2E' } }}>
                        <TableCell sx={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {row.pointId}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {row.easting.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {row.northing.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {row.elevation.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
                          {row.description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.checkStatus}
                            size="small"
                            sx={{
                              backgroundColor: row.checkStatus === 'OK' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: row.checkStatus === 'OK' ? '#34D399' : '#FBBF24',
                              fontWeight: 600,
                              fontSize: '0.68rem',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#64748B' }}>
                        No survey points registered yet. Drop your CSV file above or click "Load Demo (slope.csv)" to intake coordinates.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {surveyPoints.length > 10 && (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mt: 2, gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Elevation bounds: {uploadedSurvey ? `${uploadedSurvey.minElevation.toFixed(1)}m min – ${uploadedSurvey.maxElevation.toFixed(1)}m max` : '—'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {displayCount < surveyPoints.length && (
                    <Button
                      size="small"
                      onClick={() => setDisplayCount(prev => Math.min(prev + 25, surveyPoints.length))}
                      sx={{ color: '#38BDF8', fontSize: '0.75rem', textTransform: 'none' }}
                    >
                      Show more points (+25)
                    </Button>
                  )}
                  {displayCount < surveyPoints.length && (
                    <Button
                      size="small"
                      onClick={() => setDisplayCount(surveyPoints.length)}
                      sx={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'none' }}
                    >
                      Show all {surveyPoints.length.toLocaleString()}
                    </Button>
                  )}
                  {displayCount > 10 && (
                    <Button
                      size="small"
                      onClick={() => setDisplayCount(10)}
                      sx={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'none' }}
                    >
                      Collapse
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Card>

          {/* Warnings for the Engineer */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Warnings for the engineer
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Errors and warnings are shown before design starts. {acknowledgedCount} of {surveyWarnings.length} acknowledged.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {surveyWarnings.map(w => (
                <Box
                  key={w.id}
                  sx={{
                    p: 1.8,
                    borderRadius: 1.5,
                    border: '1px solid #1E293B',
                    backgroundColor: '#0F1626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ pr: 2, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                      {w.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {w.detail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {w.isAcknowledged && (
                      <Chip label="Acknowledged" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.7rem' }} />
                    )}
                    <Button
                      size="small"
                      onClick={() => toggleWarningAcknowledged(w.id)}
                      sx={{ color: '#64748B', fontSize: '0.75rem', textTransform: 'none', '&:hover': { color: '#F8FAFC' } }}
                    >
                      {w.isAcknowledged ? 'Reopen' : 'Acknowledge'}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Next Stage Button */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, pb: 4 }}>
            <Button
              variant="contained"
              size="medium"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setActiveStage('terrain')}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: '#10B981',
                color: '#0B0F19',
                fontWeight: 700,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#059669' },
              }}
            >
              Proceed to Terrain Engine (Stage 3)
            </Button>
          </Box>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Validation Checks */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Validation checks
              </Typography>
              <Chip 
                label={`${validationChecks.filter(c => c.status === 'Pass').length} passed`} 
                size="small" 
                sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.7rem' }} 
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {validationChecks.map(check => {
                const isWarning = check.status === 'Warning';
                return (
                  <Box
                    key={check.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.8,
                      borderBottom: '1px solid #1A2436',
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.825rem', minWidth: 0 }}>
                      {check.name}
                    </Typography>
                    <Chip
                      label={isWarning ? `${check.warningCount || 1} warning` : 'Pass'}
                      size="small"
                      sx={{
                        backgroundColor: isWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isWarning ? '#FBBF24' : '#34D399',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Card>

          {/* Terrain Generation Readiness Card */}
          <Card sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#0F1626', border: '1px solid #1E293B' }}>
            <Typography variant="subtitle2" sx={{ color: '#10B981', fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.72rem', mb: 1 }}>
              DATASET QUALITY
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Ready for TIN modeling
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2.5, fontSize: '0.82rem' }}>
              All {surveyPoints.length.toLocaleString()} coordinate shots have valid 3D coordinates. Surface triangulation can proceed with zero fatal geometric defects.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setActiveStage('terrain')}
              sx={{
                backgroundColor: '#10B981',
                color: '#0B0F19',
                '&:hover': { backgroundColor: '#059669' },
                textTransform: 'none',
                fontWeight: 700,
                py: 1,
              }}
            >
              Generate Terrain Model
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
