import React from 'react';
import { Box, Card, Typography, Grid, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useProject } from '../context/ProjectContext';

export const SurveyValidationView: React.FC = () => {
  const { 
    surveyPoints, 
    surveyWarnings, 
    toggleWarningAcknowledged, 
    validationChecks 
  } = useProject();

  const acknowledgedCount = surveyWarnings.filter(w => w.isAcknowledged).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Uploaded File Banner */}
          <Card sx={{ p: 2.5, mb: 3, display: 'flex', alignItems: 'center', gap: 2.5, backgroundColor: '#0C1017' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5B8DEF',
              }}
            >
              <UploadFileOutlinedIcon fontSize="medium" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#E7EAF0' }}>
                pilot_survey.csv
              </Typography>
              <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 1 }}>
                1,842 rows · 5 columns mapped · units in metres · CSV, Excel and TXT accepted
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Point ID', 'Easting', 'Northing', 'Elevation', 'Description'].map(col => (
                  <Chip
                    key={col}
                    label={col}
                    size="small"
                    sx={{ backgroundColor: '#1B2029', color: '#9AA3B2', fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          </Card>

          {/* Structured Project Dataset Table */}
          <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Structured project dataset
              </Typography>
              <Typography variant="caption" sx={{ color: '#6C7686', fontWeight: 600, letterSpacing: '0.04em' }}>
                SHOWING 6 OF 1,842
              </Typography>
            </Box>

            <TableContainer sx={{ border: 'none', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead sx={{ backgroundColor: '#080A0E' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>POINT ID</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>EASTING</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>NORTHING</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>ELEVATION</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>CHECK</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveyPoints.map(row => (
                    <TableRow key={row.pointId} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell sx={{ color: '#E7EAF0', fontWeight: 500, fontSize: '0.75rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                        {row.pointId}
                      </TableCell>
                      <TableCell sx={{ color: '#C3C9D4', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                        {row.easting.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: '#C3C9D4', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                        {row.northing.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: '#C3C9D4', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                        {row.elevation.toFixed(1)}
                      </TableCell>
                      <TableCell sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
                        {row.description}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.checkStatus}
                          size="small"
                          sx={{
                            backgroundColor:
                              row.checkStatus === 'OK' ? 'rgba(70,185,138,0.12)' : 'rgba(227,169,72,0.12)',
                            color: row.checkStatus === 'OK' ? '#64C9A1' : '#EFC06A',
                            border: 'none',
                            whiteSpace: 'nowrap',
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
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Warnings for the engineer
            </Typography>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2 }}>
              Errors and warnings are shown before design starts. {acknowledgedCount} of {surveyWarnings.length} acknowledged.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {surveyWarnings.map(w => (
                <Box
                  key={w.id}
                  sx={{
                    p: 1.8,
                    borderRadius: '8px',
                    border: '1px solid #1B2029',
                    backgroundColor: '#0C1017',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ pr: 2, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#E7EAF0' }}>
                      {w.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                      {w.detail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {w.isAcknowledged && (
                      <Chip label="Acknowledged" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#64C9A1', fontWeight: 600, fontSize: '0.75rem' }} />
                    )}
                    <Button
                      size="small"
                      onClick={() => toggleWarningAcknowledged(w.id)}
                      sx={{ color: '#6C7686', fontSize: '0.75rem', textTransform: 'none', '&:hover': { color: '#E7EAF0' } }}
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
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Validation checks
              </Typography>
              <Chip label="3 warnings" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#EFC06A', fontWeight: 600, fontSize: '0.75rem' }} />
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
                      borderBottom: '1px solid #1B2029',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
                      {check.name}
                    </Typography>
                    <Chip
                      label={isWarning ? `${check.warningCount} warning` : 'Pass'}
                      size="small"
                      sx={{
                        backgroundColor: isWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isWarning ? '#EFC06A' : '#64C9A1',
                        fontWeight: 600,
                        fontSize: '0.75rem',
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
