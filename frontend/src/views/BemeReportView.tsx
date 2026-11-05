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
    { title: 'Project information', status: 'Ready', color: '#46B98A' },
    { title: 'Survey analysis', status: 'Ready', color: '#46B98A' },
    { title: 'Engineering analysis', status: 'Ready', color: '#46B98A' },
    { title: 'AI recommendations', status: 'Ready', color: '#46B98A' },
    { title: 'Design drawings', status: 'Ready', color: '#46B98A' },
    { title: 'Quantities and BEME', status: 'Draft', color: '#E3A948' },
    { title: 'Technical notes', status: '3 Items', color: '#E3A948' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Traceability Banner */}
      <Card sx={{ p: 1.8, mb: 3, backgroundColor: '#0C1017', border: '1px solid #1B2029', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip label="Traceable" size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#5B8DEF', fontWeight: 600, fontSize: '0.75rem' }} />
          <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
            Every quantity comes from design Rev C, parameter set v2 and pilot_survey.csv.
          </Typography>
        </Box>
        <Chip label="Draft awaiting engineer approval" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#EFC06A', fontWeight: 600, fontSize: '0.75rem' }} />
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
                <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                  Quantity times rate equals amount. Edit a rate and the totals follow.
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#6C7686', display: 'block', fontWeight: 600, fontSize: '0.75rem' }}>
                  GRAND TOTAL
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#E7EAF0', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                  ₦{grandTotalBeme.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <TableContainer sx={{ border: 'none' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#080A0E' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>ITEM</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1 }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1, textAlign: 'center' }}>UNIT</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1, textAlign: 'right' }}>QUANTITY</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1, textAlign: 'right' }}>RATE (₦)</TableCell>
                    <TableCell sx={{ color: '#6C7686', fontWeight: 600, fontSize: '0.75rem', py: 1, textAlign: 'right' }}>AMOUNT (₦)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bemeCategories.map(cat => (
                    <React.Fragment key={cat.categoryCode}>
                      {/* Category Header Row */}
                      <TableRow sx={{ backgroundColor: '#0E1726' }}>
                        <TableCell sx={{ color: '#5B8DEF', fontWeight: 700, fontSize: '0.75rem' }}>{cat.categoryCode}</TableCell>
                        <TableCell colSpan={5} sx={{ color: '#E7EAF0', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                          {cat.categoryName}
                        </TableCell>
                      </TableRow>

                      {/* Items Rows */}
                      {cat.items.map(item => (
                        <TableRow key={item.code} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                          <TableCell sx={{ color: '#9AA3B2', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{item.code}</TableCell>
                          <TableCell sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>{item.description}</TableCell>
                          <TableCell sx={{ color: '#9AA3B2', fontSize: '0.8125rem', textAlign: 'center' }}>{item.unit}</TableCell>
                          <TableCell sx={{ color: '#E7EAF0', fontSize: '0.8125rem', textAlign: 'right', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
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
                                  fontSize: '0.8125rem',
                                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                  p: '4px 6px',
                                  color: '#5B8DEF',
                                  backgroundColor: '#080A0E',
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#E7EAF0', fontWeight: 600, fontSize: '0.8125rem', textAlign: 'right', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                            {item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Subtotal Row */}
                      <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <TableCell />
                        <TableCell colSpan={4} sx={{ color: '#9AA3B2', fontStyle: 'italic', fontSize: '0.75rem' }}>
                          Subtotal, {cat.categoryName.toLowerCase()}
                        </TableCell>
                        <TableCell sx={{ color: '#E7EAF0', fontWeight: 700, fontSize: '0.8125rem', textAlign: 'right', fontFamily: "'JetBrains Mono', ui-monospace, monospace", borderTop: '1px solid #1B2029' }}>
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
                    borderBottom: '1px solid #1B2029',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#C3C9D4', fontSize: '0.8125rem' }}>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
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

            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {[
                'Gradient at Ch 1+840 was accepted by the engineering lead with a note.',
                'Culvert invert levels at 2 locations use terrain low points as placeholders.',
                'Soil data is still missing for Ch 1+600 to 2+400, so cut stability is unconfirmed.',
              ].map(text => (
                <Box
                  component="li"
                  key={text}
                  sx={{ display: 'flex', gap: 1.25, mb: 1.25, '&:last-of-type': { mb: 0 } }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#5A6472', mt: '7px', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#9AA3B2', lineHeight: 1.5 }}>{text}</Typography>
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: '0.71875rem', color: '#6C7686', fontStyle: 'italic', lineHeight: 1.5, mt: 2 }}>
              Rates are entered by the team. Historical quantities are never copied into this bill.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
