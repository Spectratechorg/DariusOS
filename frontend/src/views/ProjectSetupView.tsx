import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  TextField, 
  MenuItem, 
  Button,
  Chip 
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useProject } from '../context/ProjectContext';
import { VIZ_TOKENS } from '../tokens';

export const ProjectSetupView: React.FC = () => {
  const { 
    projectData, 
    updateProjectData, 
    setActiveStage, 
    setSnackbarMessage 
  } = useProject();

  const totalPavementMm = 
    projectData.subBaseThicknessMm + 
    projectData.baseCourseThicknessMm + 
    projectData.asphaltWearingCourseMm;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Left Column (2/3): Core Engineering Inputs */}
        <Grid item xs={12} lg={8}>
          {/* Card 1: Corridor Identity */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 2 }}>
              Corridor Identification
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Project name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={projectData.projectName}
                  onChange={(e) => updateProjectData({ projectName: e.target.value })}
                  placeholder="e.g. Lifidi - Piapung Road Corridor (19.50km)"
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Client / Authority
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={projectData.client}
                  onChange={(e) => updateProjectData({ client: e.target.value })}
                  placeholder="e.g. Federal Ministry of Works / Regional Infrastructure Authority"
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem' },
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Card 2: Geometric Road Standards */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 2 }}>
              Geometric Standards & Cross-Section Dimensions
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Road classification
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={projectData.roadClassification}
                  onChange={(e) => updateProjectData({ roadClassification: e.target.value })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& .MuiSelect-select': { color: '#F8FAFC', fontSize: '0.85rem' },
                  }}
                >
                  <MenuItem value="Class II Arterial">Class II Arterial (Interstate / Regional)</MenuItem>
                  <MenuItem value="Primary arterial">Primary Arterial</MenuItem>
                  <MenuItem value="Secondary road">Secondary Road</MenuItem>
                  <MenuItem value="Access feeder road">Access Feeder Road</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Applicable engineering standard
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={projectData.applicableStandard}
                  onChange={(e) => updateProjectData({ applicableStandard: e.target.value })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& .MuiSelect-select': { color: '#F8FAFC', fontSize: '0.85rem' },
                  }}
                >
                  <MenuItem value="FMW&H / AASHTO 2018">FMW&H / AASHTO 2018</MenuItem>
                  <MenuItem value="Highway Manual Part 1 (Geometric Design)">Highway Manual Part 1 (Geometric Design)</MenuItem>
                  <MenuItem value="AASHTO Green Book 2018">AASHTO Green Book 2018</MenuItem>
                  <MenuItem value="TRL Overseas Road Note 6">TRL Overseas Road Note 6</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Carriageway width (m)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: 0.1, min: 3.0, max: 15.0 }}
                  value={projectData.carriagewayWidthM}
                  onChange={(e) => updateProjectData({ carriagewayWidthM: parseFloat(e.target.value) || 7.3 })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem', fontFamily: VIZ_TOKENS.typography.monoFont },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Shoulder width (m)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: 0.1, min: 0.5, max: 3.5 }}
                  value={projectData.shoulderWidthM}
                  onChange={(e) => updateProjectData({ shoulderWidthM: parseFloat(e.target.value) || 1.5 })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem', fontFamily: VIZ_TOKENS.typography.monoFont },
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Card 3: Pavement Structural Layers */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Pavement Structural Layers
              </Typography>
              <Chip
                label={`Total: ${totalPavementMm} mm`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38BDF8',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Sub-base thickness (mm)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={projectData.subBaseThicknessMm}
                  onChange={(e) => updateProjectData({ subBaseThicknessMm: parseInt(e.target.value) || 200 })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem', fontFamily: VIZ_TOKENS.typography.monoFont },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Base course thickness (mm)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={projectData.baseCourseThicknessMm}
                  onChange={(e) => updateProjectData({ baseCourseThicknessMm: parseInt(e.target.value) || 150 })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem', fontFamily: VIZ_TOKENS.typography.monoFont },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5, fontWeight: 600 }}>
                  Asphalt wearing course (mm)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={projectData.asphaltWearingCourseMm}
                  onChange={(e) => updateProjectData({ asphaltWearingCourseMm: parseInt(e.target.value) || 50 })}
                  sx={{
                    backgroundColor: '#090D16',
                    '& input': { color: '#F8FAFC', fontSize: '0.85rem', fontFamily: VIZ_TOKENS.typography.monoFont },
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, pb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                updateProjectData({
                  carriagewayWidthM: 7.3,
                  shoulderWidthM: 1.5,
                  subBaseThicknessMm: 200,
                  baseCourseThicknessMm: 150,
                  asphaltWearingCourseMm: 50,
                });
                setSnackbarMessage('Parameters reset to standard FMW&H values.');
              }}
              sx={{
                borderColor: '#334155',
                color: '#94A3B8',
                fontSize: '0.78rem',
                '&:hover': { borderColor: '#475569', backgroundColor: '#1E293B' },
              }}
            >
              Reset to Standards
            </Button>

            <Button
              variant="contained"
              size="medium"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                setSnackbarMessage('Specifications saved.');
                setActiveStage('survey');
              }}
              sx={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 2.5,
                py: 0.8,
                fontSize: '0.85rem',
                '&:hover': { backgroundColor: '#1D4ED8' },
              }}
            >
              Save & Proceed to Survey Intake (Stage 2) →
            </Button>
          </Box>
        </Grid>

        {/* Right Column (1/3): Active Parameter Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Specification Summary
              </Typography>
              <Chip
                icon={<CheckCircleOutlineIcon sx={{ '&&': { color: '#16A34A', fontSize: '0.9rem' } }} />}
                label="Ready"
                size="small"
                sx={{
                  backgroundColor: 'rgba(22, 163, 74, 0.12)',
                  color: '#4ADE80',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>Road Class</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
                  {projectData.roadClassification}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>Design Standard</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
                  {projectData.applicableStandard}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>Total Width (CW + 2 SH)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#38BDF8', fontSize: '0.8rem', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {(projectData.carriagewayWidthM + (projectData.shoulderWidthM * 2)).toFixed(2)} m
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #161F30' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>Crossfall Camber</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  -2.5%
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>Total Pavement Thickness</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4ADE80', fontSize: '0.8rem', fontFamily: VIZ_TOKENS.typography.monoFont }}>
                  {totalPavementMm} mm
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #1E293B' }}>
              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => setActiveStage('survey')}
                sx={{
                  backgroundColor: '#2563EB',
                  '&:hover': { backgroundColor: '#1D4ED8' },
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  py: 0.9,
                }}
              >
                Go to Stage 2 (Survey Intake) →
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
