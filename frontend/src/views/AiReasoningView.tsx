import React from 'react';
import { Box, Card, Typography, Grid, Chip, Button } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useProject } from '../context/ProjectContext';

export const AiReasoningView: React.FC = () => {
  const { 
    curveOptions, 
    selectedCurveId, 
    selectCurveOption 
  } = useProject();

  const suggestedParams = [
    { label: 'Maximum design gradient', value: '8 %', note: 'Checked later against the standard chosen in project setup.', status: 'Accepted', color: '#46B98A' },
    { label: 'Cut side slope', value: '1 : 1.5', note: 'Steeper ground near Ch 2+100 may need a flatter slope.', status: 'Modified', color: '#5B8DEF' },
    { label: 'Fill side slope', value: '1 : 2', note: 'Based on typical embankment behaviour in similar terrain.', status: 'Accepted', color: '#46B98A' },
    { label: 'Culvert spacing in valleys', value: '6 locations', note: 'Placed where the terrain model shows low points crossing the road.', status: 'Awaiting', color: '#E3A948' },
  ];

  const pastProjects = [
    { name: 'Reference project A', tags: ['Rolling terrain', 'Same pavement', 'Lined drains'], similarity: '86%' },
    { name: 'Reference project B', tags: ['Rolling terrain', 'Similar width'], similarity: '74%' },
    { name: 'Reference project C', tags: ['Similar drainage', 'Shorter length'], similarity: '61%' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Horizontal Curve at Ch 0+950 */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Horizontal curve at Ch 0+950
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#5B8DEF' }}>
                <AutoAwesomeOutlinedIcon sx={{ fontSize: '1rem' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  Assistive suggestion
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2.5 }}>
              The AI proposes. The engineering engine will calculate whichever option you select.
            </Typography>

            <Grid container spacing={2}>
              {curveOptions.map(opt => {
                const isSelected = opt.id === selectedCurveId;
                return (
                  <Grid item xs={12} md={4} key={opt.id}>
                    <Box
                      sx={{
                        p: 2.2,
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #5B8DEF' : '1px solid #1B2029',
                        backgroundColor: isSelected ? 'rgba(91,141,239,0.10)' : '#0C1017',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              letterSpacing: '0.07em',
                              textTransform: 'uppercase',
                              color: '#6C7686',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Option {opt.id}
                          </Typography>
                          <Chip
                            label={isSelected ? 'Selected' : 'Alternative'}
                            size="small"
                            sx={{
                              backgroundColor: isSelected ? '#46B98A' : '#1B2029',
                              color: isSelected ? '#0A0C11' : '#9AA3B2',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, color: '#E7EAF0', mb: 1, minHeight: '2.7em', lineHeight: 1.35 }}
                        >
                          {opt.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', minHeight: 40, mb: 2 }}>
                          {opt.description}
                        </Typography>

                        <Box sx={{ borderTop: '1px solid #1B2029', pt: 1.5, mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#6C7686' }}>Cut</Typography>
                            <Typography variant="caption" sx={{ color: '#E7EAF0', fontWeight: 600, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                              {opt.cutM3.toLocaleString()} m³
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6C7686' }}>Fill</Typography>
                            <Typography variant="caption" sx={{ color: '#E7EAF0', fontWeight: 600, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                              {opt.fillM3.toLocaleString()} m³
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        size="small"
                        variant={isSelected ? 'contained' : 'outlined'}
                        onClick={() => selectCurveOption(opt.id)}
                        sx={{
                          backgroundColor: isSelected ? '#3E68BE' : 'transparent',
                          borderColor: '#252B36',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          '&:hover': {
                            backgroundColor: isSelected ? '#4A7AD1' : '#1B2029',
                          },
                        }}
                      >
                        {isSelected ? 'Selected' : `Select Option ${opt.id}`}
                      </Button>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>

          {/* Suggested Design Parameters */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Suggested design parameters
              </Typography>
              <Typography variant="caption" sx={{ color: '#6C7686', fontWeight: 600, letterSpacing: '0.04em' }}>
                ENGINEER DECIDES
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {suggestedParams.map((param, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: '1px solid #1B2029',
                  }}
                >
                  <Box sx={{ maxWidth: '60%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#E7EAF0' }}>
                      {param.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                      {param.note}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#E7EAF0', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                      {param.value}
                    </Typography>
                    <Chip
                      label={param.status}
                      size="small"
                      sx={{
                        backgroundColor: `${param.color}15`,
                        color: param.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        border: `1px solid ${param.color}40`,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Similar Past Projects */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Similar past projects
            </Typography>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', mb: 2 }}>
              Matched on engineering characteristics. Length is one factor among many. Past quantities give context only and are never copied.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {pastProjects.map((proj, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '8px',
                    border: '1px solid #1B2029',
                    backgroundColor: '#0C1017',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#E7EAF0', mb: 0.5 }}>
                      {proj.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.8 }}>
                      {proj.tags.map(t => (
                        <Chip
                          key={t}
                          label={t}
                          size="small"
                          sx={{ backgroundColor: '#1B2029', color: '#9AA3B2', fontSize: '0.75rem', height: 20 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#6C7686', display: 'block', fontSize: '0.75rem' }}>
                      Similarity
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#5B8DEF', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                      {proj.similarity}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Project Profile */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Project profile
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#6C7686', mb: 0.3 }}>GEOMETRY</Typography>
                <Typography variant="caption" sx={{ color: '#C3C9D4', display: 'block', lineHeight: 1.4 }}>
                  3.20 km long, 7.0 m carriageway, rolling elevation change along the route.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#6C7686', mb: 0.3 }}>TERRAIN</Typography>
                <Typography variant="caption" sx={{ color: '#C3C9D4', display: 'block', lineHeight: 1.4 }}>
                  Rolling, 6.1 % mean slope, two hill masses either side of a valley.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#6C7686', mb: 0.3 }}>ENGINEERING</Typography>
                <Typography variant="caption" sx={{ color: '#C3C9D4', display: 'block', lineHeight: 1.4 }}>
                  Secondary road, lined drains both sides, three-layer pavement.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#6C7686', mb: 0.3 }}>GROUND CONDITIONS</Typography>
                <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', fontStyle: 'italic' }}>
                  Soil and water information not yet supplied.
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Risks and Missing Information */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Risks and missing information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ p: 1.5, borderRadius: '8px', border: '1px solid #1B2029', backgroundColor: '#0C1017' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 600, color: '#E7EAF0', fontSize: '0.8125rem', flex: '1 1 auto' }}>
                    Soil data missing for Ch 1+600 to 2+400
                  </Typography>
                  <Chip
                    label="Needs input"
                    size="small"
                    sx={{ backgroundColor: 'rgba(227,169,72,0.12)', color: '#EFC06A', border: 'none' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                  Needed before the AI can comment on cut stability.
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '8px', border: '1px solid #1B2029', backgroundColor: '#0C1017' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 600, color: '#E7EAF0', fontSize: '0.8125rem', flex: '1 1 auto' }}>
                    Steep section near the ridge
                  </Typography>
                  <Chip
                    label="Risk"
                    size="small"
                    sx={{ backgroundColor: 'rgba(228,105,94,0.12)', color: '#EE8B82', border: 'none' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                  Gradient may approach the limit between Ch 1+800 and 1+900.
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '8px', border: '1px solid #1B2029', backgroundColor: '#0C1017' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 600, color: '#E7EAF0', fontSize: '0.8125rem', flex: '1 1 auto' }}>
                    Possible conflict with existing drainage
                  </Typography>
                  <Chip
                    label="Check"
                    size="small"
                    sx={{ backgroundColor: 'rgba(91,141,239,0.12)', color: '#7AA3F5', border: 'none' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#9AA3B2' }}>
                  A surveyed culvert lies close to the proposed centreline.
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* How to Read this Page */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              How to read this page
            </Typography>
            <Typography variant="caption" sx={{ color: '#9AA3B2', display: 'block', lineHeight: 1.5 }}>
              Every suggestion shows its reasoning and its sources. Nothing here becomes a design until the engineer accepts it and the engineering engine has calculated and validated it.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
