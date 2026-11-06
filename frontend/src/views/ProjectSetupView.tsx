import React, { useRef, useState } from 'react';
import { Box, Card, Typography, Grid, TextField, MenuItem, Chip, Button, CircularProgress } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useProject } from '../context/ProjectContext';

export const ProjectSetupView: React.FC = () => {
  const { 
    projectData, 
    updateProjectData, 
    setActiveStage, 
    uploadSurveyFile, 
    loadDemoSurvey, 
    uploadedSurvey, 
    isUploadingSurvey,
    setSnackbarMessage 
  } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadSurveyFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadSurveyFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.xyz,.txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
                  <MenuItem value="Side ditches and precast box/pipe culverts at low points">Side ditches and precast box/pipe culverts at low points</MenuItem>
                  <MenuItem value="Lined side drains, both sides">Lined side drains, both sides</MenuItem>
                  <MenuItem value="Unlined earth trapezoidal ditches">Unlined earth trapezoidal ditches</MenuItem>
                  <MenuItem value="Subsurface French drains">Subsurface French drains</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Card>

          {/* Survey Attachment Card (Upload CSV directly in Setup) */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Survey data intake
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Attach your raw survey points CSV file now, or validate in Stage 2.
                </Typography>
              </Box>
              {uploadedSurvey?.filename && (
                <Chip
                  icon={<CheckCircleOutlineIcon sx={{ '&&': { color: '#34D399', fontSize: '1rem' } }} />}
                  label={`${uploadedSurvey.pointCount.toLocaleString()} points attached`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34D399', fontWeight: 600, fontSize: '0.72rem' }}
                />
              )}
            </Box>

            {/* Dropzone Area */}
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                p: 3,
                mt: 2,
                borderRadius: 2,
                border: isDragOver ? '2px dashed #38BDF8' : '2px dashed #334155',
                backgroundColor: isDragOver ? 'rgba(56, 189, 248, 0.08)' : '#0B0F19',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#38BDF8',
                  backgroundColor: 'rgba(56, 189, 248, 0.04)',
                },
              }}
            >
              {isUploadingSurvey ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 1 }}>
                  <CircularProgress size={32} sx={{ color: '#38BDF8' }} />
                  <Typography variant="body2" sx={{ color: '#38BDF8', fontWeight: 600 }}>
                    Parsing survey coordinates & verifying geometric quality...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38BDF8',
                      mb: 1.5,
                    }}
                  >
                    <UploadFileOutlinedIcon fontSize="medium" />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5, textAlign: 'center' }}>
                    Click to browse or drop your CSV survey file here
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', textAlign: 'center', mb: 2 }}>
                    Accepts CSV, XYZ, and TXT point lists with Easting, Northing, and Elevation (metres)
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      sx={{
                        backgroundColor: '#2563EB',
                        '&:hover': { backgroundColor: '#1D4ED8' },
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Browse survey file
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AutoFixHighIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        loadDemoSurvey();
                      }}
                      sx={{
                        borderColor: '#334155',
                        color: '#38BDF8',
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        '&:hover': { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.08)' },
                      }}
                    >
                      Load Demo Survey (slope.csv)
                    </Button>
                  </Box>
                </>
              )}
            </Box>

            {/* Currently attached file details */}
            {uploadedSurvey?.filename && (
              <Box sx={{ mt: 2, p: 1.5, borderRadius: 1.5, backgroundColor: '#131B2E', border: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <UploadFileOutlinedIcon sx={{ color: '#38BDF8', fontSize: '1.2rem' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                      {uploadedSurvey.filename}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {uploadedSurvey.pointCount.toLocaleString()} points · {(uploadedSurvey.fileSizeBytes / 1024).toFixed(1)} KB · {uploadedSurvey.uploadedAt}
                    </Typography>
                  </Box>
                </Box>
                <Chip label="Ready for Terrain" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.7rem' }} />
              </Box>
            )}
          </Card>

          {/* Site Constraints and Notes */}
          <Card sx={{ p: 3, mb: 3 }}>
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

          {/* Bottom Call-to-Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, pb: 4 }}>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                updateProjectData({
                  carriagewayWidthM: 7.0,
                  shoulderWidthM: 1.5,
                  subBaseThicknessMm: 200,
                  baseCourseThicknessMm: 150,
                  asphaltWearingCourseMm: 50,
                });
                setSnackbarMessage('Design values reset to AASHTO 2018 standards.');
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
                setSnackbarMessage('Project setup saved. Continuing to Survey Intake & Validation.');
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
              Save & Continue to Survey Upload
            </Button>
          </Box>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Quick Flow Card */}
          <Card sx={{ p: 3, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Typography variant="subtitle2" sx={{ color: '#38BDF8', fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.72rem', mb: 1 }}>
              NEXT STEP IN WORKFLOW
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Survey intake & validation
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2.5, fontSize: '0.82rem' }}>
              Upload your survey coordinates CSV to run geometric error filtering, outlier detection, and TIN terrain generation.
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
              Go to Survey Intake (Stage 2)
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
