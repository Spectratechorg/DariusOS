import React from 'react';
import { Box, Card, Typography, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const BemeReportView: React.FC = () => {
  const { 
    bemeCategories, 
    updateBemeRate, 
    grandTotalBeme 
  } = useProject();

  const reportReadiness = [
    { title: 'Project information', status: 'Ready', color: '#10B981' },
    { title: 'Survey analysis', status: 'Ready', color: '#10B981' },
    { title: 'Engineering analysis', status: 'Ready', color: '#10B981' },
    { title: 'AI recommendations', status: 'Ready', color: '#10B981' },
    { title: 'Design drawings', status: 'Ready', color: '#10B981' },
    { title: 'Quantities and BEME', status: 'Draft', color: '#F59E0B' },
    { title: 'Technical notes', status: '3 Items', color: '#F59E0B' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Traceability Banner */}
      <Card sx={{ p: 1.8, mb: 3, backgroundColor: '#0F1626', border: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip label="Traceable" size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 600, fontSize: '0.7rem' }} />
          <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
            Every quantity comes from design Rev C, parameter set v2 and pilot_survey.csv.
          </Typography>
        </Box>
        <Chip label="Draft awaiting engineer approval" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontWeight: 600, fontSize: '0.7rem' }} />
      </Card>

      <Grid container spacing={3}>
        {/* Left Column (2/3): BEME Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Bill of Engineering Measurement and Evaluation
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Quantity times rate equals amount. Edit a rate and the totals follow.
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontWeight: 600, fontSize: '0.68rem' }}>
                  GRAND TOTAL
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#F8FAFC', fontFamily: 'monospace' }}>
                  ₦{grandTotalBeme.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <TableContainer sx={{ borderRadius: 1, border: '1px solid #1E293B' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#0A0E17' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>ITEM</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1 }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1, textAlign: 'center' }}>UNIT</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1, textAlign: 'right' }}>QUANTITY</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1, textAlign: 'right' }}>RATE (₦)</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', py: 1, textAlign: 'right' }}>AMOUNT (₦)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bemeCategories.map(cat => (
                    <React.Fragment key={cat.categoryCode}>
                      {/* Category Header Row */}
                      <TableRow sx={{ backgroundColor: '#0E1726' }}>
                        <TableCell sx={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.75rem' }}>{cat.categoryCode}</TableCell>
                        <TableCell colSpan={5} sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                          {cat.categoryName}
                        </TableCell>
                      </TableRow>

                      {/* Items Rows */}
                      {cat.items.map(item => (
                        <TableRow key={item.code} sx={{ '&:hover': { backgroundColor: '#131D2E' } }}>
                          <TableCell sx={{ color: '#94A3B8', fontSize: '0.78rem', fontFamily: 'monospace' }}>{item.code}</TableCell>
                          <TableCell sx={{ color: '#CBD5E1', fontSize: '0.78rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ color: '#94A3B8', fontSize: '0.78rem', textAlign: 'center' }}>{item.unit}</TableCell>
                          <TableCell sx={{ color: '#F8FAFC', fontSize: '0.78rem', textAlign: 'right', fontFamily: 'monospace' }}>
                            {item.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right', width: 110 }}>
                            <TextField
                              size="small"
                              type="number"
                              value={item.unitRate}
                              onChange={e => updateBemeRate(cat.categoryCode, item.code, parseFloat(e.target.value) || 0)}
                              sx={{
                                width: 95,
                                '& input': {
                                  textAlign: 'right',
                                  fontSize: '0.78rem',
                                  fontFamily: 'monospace',
                                  p: '4px 6px',
                                  color: '#38BDF8',
                                  backgroundColor: '#090D16',
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.78rem', textAlign: 'right', fontFamily: 'monospace' }}>
                            {item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Subtotal Row */}
                      <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <TableCell />
                        <TableCell colSpan={4} sx={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '0.75rem' }}>
                          Subtotal, {cat.categoryName.toLowerCase()}
                        </TableCell>
                        <TableCell sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.8rem', textAlign: 'right', fontFamily: 'monospace', borderTop: '1px solid #1E293B' }}>
                          {cat.subtotal.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Right Column (1/3): Report Readiness & Notes */}
        <Grid item xs={12} lg={4}>
          {/* Engineering Report Readiness */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Engineering report
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {reportReadiness.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.6,
                    borderBottom: '1px solid #1A2436',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      fontWeight: 600,
                      fontSize: '0.68rem',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* For Engineer Verification */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
              For engineer verification
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', lineHeight: 1.45 }}>
                • Gradient at Ch 1+840 was accepted by the engineering lead with a note.
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', lineHeight: 1.45 }}>
                • Culvert invert levels at 2 locations use terrain low points as placeholders.
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', lineHeight: 1.45 }}>
                • Soil data is still missing for Ch 1+600 to 2+400, so cut stability is unconfirmed.
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1, fontStyle: 'italic', lineHeight: 1.45 }}>
                Rates are entered by the team. Historical quantities are never copied into this bill.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
