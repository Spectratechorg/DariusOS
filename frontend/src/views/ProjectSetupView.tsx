import React from 'react';
import { Box, Card, Typography, Grid, TextField, MenuItem, Chip, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useProject } from '../context/ProjectContext';

export const ProjectSetupView: React.FC = () => {
  const { 
    projectData, 
    updateProjectData, 
    setActiveStage, 
    setSnackbarMessage 
  } = useProject();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Project Corridor Info */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Project corridor details
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              Define the corridor name, client authority, and route classification for this road package.
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
                  placeholder="e.g. East-West Road Corridor (Port Harcourt)"
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Client / Authority
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={projectData.client}
                  onChange={e => updateProjectData({ client: e.target.value })}
                  placeholder="e.g. Federal Ministry of Works / Infrastructure Authority"
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Project location / Region
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={projectData.projectLocation}
                  onChange={e => updateProjectData({ projectLocation: e.target.value })}
                  placeholder="e.g. Port Harcourt - Rivers State Corridor"
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
                  <MenuItem value="Rural arterial corridor">Rural arterial corridor</MenuItem>
                  <MenuItem value="Rehabilitation / As-built widening">Rehabilitation / As-built widening</MenuItem>
                  <MenuItem value="Feeder road development">Feeder road development</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Card>

          {/* Road and Design Requirements */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Road and design standards
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              Geometric design parameters set by the engineer to guide horizontal curves and vertical grade tolerances.
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
                  <MenuItem value="Class II Arterial">Class II Arterial</MenuItem>
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
                  <MenuItem value="FMW&H / AASHTO 2018">FMW&H / AASHTO 2018</MenuItem>
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
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: 0.1, min: 3.0, max: 15.0 }}
                  value={projectData.carriagewayWidthM}
                  onChange={e => updateProjectData({ carriagewayWidthM: parseFloat(e.target.value) || 7.3 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Shoulder width (m)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: 0.1, min: 0.5, max: 3.5 }}
                  value={projectData.shoulderWidthM}
                  onChange={e => updateProjectData({ shoulderWidthM: parseFloat(e.target.value) || 1.5 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Pavement Layer Structure */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Pavement structural layers
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              Layer thicknesses in millimetres directly drive the Bill 4 and Bill 5 material quantities in the BEME.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Sub-base thickness (mm)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={projectData.subBaseThicknessMm}
                  onChange={e => updateProjectData({ subBaseThicknessMm: parseInt(e.target.value) || 200 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Base course thickness (mm)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={projectData.baseCourseThicknessMm}
                  onChange={e => updateProjectData({ baseCourseThicknessMm: parseInt(e.target.value) || 150 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 500 }}>
                  Asphalt wearing course (mm)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={projectData.asphaltWearingCourseMm}
                  onChange={e => updateProjectData({ asphaltWearingCourseMm: parseInt(e.target.value) || 50 })}
                  sx={{ backgroundColor: '#0B0F19', borderRadius: 1 }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Site Constraints and Notes */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Site constraints and notes
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Physical constraints, water crossings, and soil conditions to respect during alignment design.
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

          {/* Bottom Call-to-Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, pb: 4 }}>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                updateProjectData({
                  carriagewayWidthM: 7.3,
                  shoulderWidthM: 1.5,
                  subBaseThicknessMm: 200,
                  baseCourseThicknessMm: 150,
                  asphaltWearingCourseMm: 50,
                });
                setSnackbarMessage('Design values reset to FMW&H standard values.');
              }}
              sx={{
                borderColor: '#334155',
                color: '#94A3B8',
                textTransform: 'none',
                '&:hover': { borderColor: '#475569', backgroundColor: '#1E293B' },
              }}
            >
              Reset to standard values
            </Button>

            <Button
              variant="contained"
              size="medium"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                setSnackbarMessage('Specifications saved. Proceed to Stage 2 to upload your survey CSV.');
                setActiveStage('survey');
              }}
              sx={{
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
              Save Specifications & Continue to Survey Intake (Stage 2) →
            </Button>
          </Box>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Next Step Card */}
          <Card sx={{ p: 3, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Typography variant="subtitle2" sx={{ color: '#38BDF8', fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.72rem', mb: 1 }}>
              NEXT STEP IN PIPELINE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Stage 2: Survey intake & validation
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2.5, fontSize: '0.82rem' }}>
              In Stage 2, you will upload your Easting, Northing, and Elevation CSV file to validate coordinate bounds and generate the existing terrain surface.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setActiveStage('survey')}
              sx={{
                backgroundColor: '#2563EB',
                '&:hover': { backgroundColor: '#1D4ED8' },
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
              }}
            >
              Proceed to Survey Intake (Stage 2) →
            </Button>
          </Card>

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
            </Box>
          </Card>

          {/* Engineering Roles */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Sign-off hierarchy
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Registered civil engineer (COREN)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Final engineering sign-off & seal
                  </Typography>
                </Box>
                <Chip label="Required" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Project surveyor
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Coordinate intake and control verification
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
