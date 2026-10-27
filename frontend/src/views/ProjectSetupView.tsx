import React from 'react';
import { Box, Card, Typography, Grid, TextField, MenuItem, Chip } from '@mui/material';
import { useProject } from '../context/ProjectContext';

export const ProjectSetupView: React.FC = () => {
  const { projectData, updateProjectData } = useProject();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Project Details */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Project details
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              This context is carried through every later stage.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Project name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={projectData.projectName}
                  onChange={e => updateProjectData({ projectName: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Client
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={projectData.client}
                  onChange={e => updateProjectData({ client: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Project location
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="[Location of the road]"
                  value={projectData.projectLocation}
                  onChange={e => updateProjectData({ projectLocation: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Project type
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={projectData.projectType}
                  onChange={e => updateProjectData({ projectType: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                >
                  <MenuItem value="New road, survey to design">New road, survey to design</MenuItem>
                  <MenuItem value="Rehabilitation / As-built widening">Rehabilitation / As-built widening</MenuItem>
                  <MenuItem value="Feeder road development">Feeder road development</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Card>

          {/* Road and Design Requirements */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Road and design requirements
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              The engineer sets these. The AI may suggest values later but never overwrites them.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Road classification
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={projectData.roadClassification}
                  onChange={e => updateProjectData({ roadClassification: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                >
                  <MenuItem value="Secondary road">Secondary road</MenuItem>
                  <MenuItem value="Primary arterial">Primary arterial</MenuItem>
                  <MenuItem value="Access feeder road">Access feeder road</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Applicable engineering standard
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={projectData.applicableStandard}
                  onChange={e => updateProjectData({ applicableStandard: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                >
                  <MenuItem value="Highway Manual Part 1 (Geometric Design)">Highway Manual Part 1 (Geometric Design)</MenuItem>
                  <MenuItem value="AASHTO Green Book 2018">AASHTO Green Book 2018</MenuItem>
                  <MenuItem value="TRL Overseas Road Note 6">TRL Overseas Road Note 6</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Carriageway width (m)
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={projectData.carriagewayWidthM}
                  onChange={e => updateProjectData({ carriagewayWidthM: parseFloat(e.target.value) || 7.0 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Shoulder width, each side (m)
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={projectData.shoulderWidthM}
                  onChange={e => updateProjectData({ shoulderWidthM: parseFloat(e.target.value) || 1.5 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Pavement and Drainage */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Pavement and drainage
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              These feed the quantity engine and the BEME.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Sub-base thickness (mm)
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={projectData.subBaseThicknessMm}
                  onChange={e => updateProjectData({ subBaseThicknessMm: parseInt(e.target.value) || 200 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Base course thickness (mm)
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={projectData.baseCourseThicknessMm}
                  onChange={e => updateProjectData({ baseCourseThicknessMm: parseInt(e.target.value) || 150 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Asphalt wearing course (mm)
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={projectData.asphaltWearingCourseMm}
                  onChange={e => updateProjectData({ asphaltWearingCourseMm: parseInt(e.target.value) || 50 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Drainage requirement
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={projectData.drainageRequirement}
                  onChange={e => updateProjectData({ drainageRequirement: e.target.value })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                >
                  <MenuItem value="Lined side drains, both sides">Lined side drains, both sides</MenuItem>
                  <MenuItem value="Unlined earth trapezoidal ditches">Unlined earth trapezoidal ditches</MenuItem>
                  <MenuItem value="Subsurface French drains">Subsurface French drains</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Card>

          {/* Site Constraints and Notes */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Site constraints and notes
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Known constraints the reasoning layer must respect.
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              value={projectData.constraints}
              onChange={e => updateProjectData({ constraints: e.target.value })}
              placeholder="Existing structures, water conditions, soil information, landowner limits"
              sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
            />
          </Card>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* What this unlocks */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              What this unlocks
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>1</Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Validation rules
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Survey checks use the units and coordinate system chosen here.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>2</Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Design constraints
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Standards and classification decide which rules flag a review.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>3</Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Pavement quantities
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Layer thicknesses drive the material lines in the BEME.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>4</Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    AI context
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Constraints become part of what the reasoning layer reads.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Roles on this Project */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Roles on this project
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Engineering lead
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Approves designs and outputs
                  </Typography>
                </Box>
                <Chip label="Approver" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Business owner
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Approves requirements and scope
                  </Typography>
                </Box>
                <Chip label="Approver" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Engineer
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Reviews calculations and quantities
                  </Typography>
                </Box>
                <Chip label="Reviewer" size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
