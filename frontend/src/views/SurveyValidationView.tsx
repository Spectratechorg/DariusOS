import React, { useRef, useState } from 'react';
import { Box, Card, Typography, Grid, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useProject } from '../context/ProjectContext';

export const SurveyValidationView: React.FC = () => {
  const { 
    surveyPoints, 
    surveyWarnings, 
    toggleWarningAcknowledged, 
    validationChecks,
    backendProject,
    uploadSurveyFile,
    setSnackbarMessage,
  } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const acknowledgedCount = surveyWarnings.filter(w => w.isAcknowledged).length;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Uploaded File Banner */}
          <Card sx={{ p: 2.5, mb: 3, display: 'flex', alignItems: 'center', gap: 2.5, backgroundColor: '#0F1626' }}>
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
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                pilot_survey.csv
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                1,842 rows · 5 columns mapped · units in metres · CSV, Excel and TXT accepted
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['Point ID', 'Easting', 'Northing', 'Elevation', 'Description'].map(col => (
                  <Chip
                    key={col}
                    label={col}
                    size="small"
                    sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                hidden
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    await uploadSurveyFile(file);
                  } catch (error) {
                    setSnackbarMessage(error instanceof Error ? error.message : 'Survey upload failed.');
                  } finally {
                    setIsUploading(false);
                    event.target.value = '';
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                disabled={!backendProject || isUploading}
                onClick={() => fileInputRef.current?.click()}
                sx={{ whiteSpace: 'nowrap', textTransform: 'none', borderColor: '#334155', color: '#CBD5E1' }}
              >
                {isUploading ? 'Uploading…' : backendProject ? 'Replace survey' : 'Save project first'}
              </Button>
            </Box>
          </Card>

          {/* Structured Project Dataset Table */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Structured project dataset
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
                SHOWING 6 OF 1,842
              </Typography>
            </Box>

            <TableContainer sx={{ borderRadius: 1, border: '1px solid #1E293B' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#0A0E17' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>POINT ID</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>EASTING</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>NORTHING</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>ELEVATION (M)</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.72rem', py: 1 }}>CHECK</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveyPoints.map(row => (
                    <TableRow key={row.pointId} sx={{ '&:hover': { backgroundColor: '#131D2E' } }}>
                      <TableCell sx={{ color: '#F8FAFC', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {row.pointId}
                      </TableCell>
                      <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {row.easting.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: '#CBD5E1', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {row.northing.toLocaleString()}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Warnings for the Engineer */}
          <Card sx={{ p: 3 }}>
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
                  }}
                >
                  <Box sx={{ pr: 2 }}>
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
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Validation Checks */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Validation checks
              </Typography>
              <Chip label="3 warnings" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontWeight: 600, fontSize: '0.7rem' }} />
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
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.825rem' }}>
                      {check.name}
                    </Typography>
                    <Chip
                      label={isWarning ? `${check.warningCount} warning` : 'Pass'}
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
        </Grid>
      </Grid>
    </Box>
  );
};
