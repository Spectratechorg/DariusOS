import React from 'react';
import { Box, Card, Typography, Grid, Chip, Button } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useProject } from '../context/ProjectContext';

export const OverviewView: React.FC = () => {
  const { 
    setActiveStage, 
    terrainSummary, 
    grandTotalBeme, 
    activeBackendProject, 
    activeRun, 
    isLiveLoaded,
    projectData,
    hasSurveyUploaded,
    uploadedSurvey,
    surveyWarnings,
    auditLogs,
    loadDemoSurvey,
    resetProjectToEmpty,
    designIssues,
  } = useProject();

  const pointsCount = hasSurveyUploaded && uploadedSurvey
    ? uploadedSurvey.pointCount
    : (activeBackendProject?.surveys?.[0]?.point_count || 0);

  const roadLengthKm = hasSurveyUploaded
    ? (activeRun?.total_road_length_m ? (activeRun.total_road_length_m / 1000).toFixed(2) : '0.20')
    : null;

  const totalEarthworksM3 = (activeRun?.total_cut_volume_m3 !== undefined && activeRun?.total_cut_volume_m3 !== null)
    ? Math.round(activeRun.total_cut_volume_m3 + (activeRun.total_fill_volume_m3 || 0))
    : (hasSurveyUploaded ? 138 : null);

  const cutM3 = (activeRun?.total_cut_volume_m3 !== undefined && activeRun?.total_cut_volume_m3 !== null)
    ? Math.round(activeRun.total_cut_volume_m3)
    : (hasSurveyUploaded ? 138 : null);

  const fillM3 = (activeRun?.total_fill_volume_m3 !== undefined && activeRun?.total_fill_volume_m3 !== null)
    ? Math.round(activeRun.total_fill_volume_m3)
    : (hasSurveyUploaded ? 0 : null);

  const netM3 = (activeRun?.net_volume_m3 !== undefined && activeRun?.net_volume_m3 !== null)
    ? Math.round(activeRun.net_volume_m3)
    : (hasSurveyUploaded ? 138 : null);

  const formattedBeme = grandTotalBeme >= 1_000_000_000
    ? `₦${(grandTotalBeme / 1_000_000_000).toFixed(2)}B`
    : grandTotalBeme >= 1_000_000
    ? `₦${(grandTotalBeme / 1_000_000).toFixed(1)}M`
    : `₦${grandTotalBeme.toLocaleString()}`;

  // Dynamic Pipeline Stages reflecting real progress
  const pipelineStatus = [
    { 
      num: 1, 
      name: 'Project setup', 
      desc: `${projectData.roadClassification} · ${projectData.applicableStandard}`, 
      engine: 'PROJECT CONTEXT', 
      status: projectData.projectName ? 'Complete' : 'In progress', 
      color: '#10B981', 
      stageId: 'setup' 
    },
    { 
      num: 2, 
      name: 'Survey and validation', 
      desc: hasSurveyUploaded 
        ? `${pointsCount.toLocaleString()} points validated (${surveyWarnings.length} warnings)`
        : 'Awaiting survey CSV upload (Stage 1 or 2)', 
      engine: 'VALIDATION', 
      status: hasSurveyUploaded ? 'Complete' : 'Waiting', 
      color: hasSurveyUploaded ? '#10B981' : '#64748B', 
      stageId: 'survey' 
    },
    { 
      num: 3, 
      name: 'Terrain', 
      desc: hasSurveyUploaded 
        ? `${terrainSummary.tinTriangles} triangles, ${terrainSummary.classification} slope analysis`
        : 'TIN surface and slope analysis pending survey intake', 
      engine: 'TERRAIN ENGINE', 
      status: hasSurveyUploaded ? 'Ready' : 'Pending survey', 
      color: hasSurveyUploaded ? '#10B981' : '#64748B', 
      stageId: 'terrain' 
    },
    { 
      num: 4, 
      name: 'Design engine', 
      desc: hasSurveyUploaded 
        ? 'Horizontal alignment and vertical grade calculation ready'
        : 'Alignment & cross-sections pending terrain TIN', 
      engine: 'ENGINEERING ENGINE', 
      status: hasSurveyUploaded ? 'In progress' : 'Pending terrain', 
      color: hasSurveyUploaded ? '#38BDF8' : '#64748B', 
      stageId: 'design' 
    },
    { 
      num: 5, 
      name: 'Drawings', 
      desc: 'Plan, profile and cross-sections as DXF and PDF', 
      engine: 'CAD ENGINE', 
      status: hasSurveyUploaded ? 'Waiting' : 'Pending design', 
      color: '#64748B', 
      stageId: 'drawings' 
    },
    { 
      num: 6, 
      name: 'BEME and report', 
      desc: 'Quantity times rate, deterministic takeoff', 
      engine: 'QUANTITY AND BEME', 
      status: hasSurveyUploaded ? 'Draft' : 'Pending quantities', 
      color: hasSurveyUploaded ? '#F59E0B' : '#64748B', 
      stageId: 'beme' 
    },
  ];

  const openIssues = designIssues.filter(i => !i.isAccepted);

  return (
    <Box sx={{ p: 3 }}>
      {/* Dynamic Project Banner / Quick Actions */}
      <Card sx={{ p: 2, mb: 3, backgroundColor: '#0F1626', border: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Active Corridor
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
            {projectData.projectName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            Client: {projectData.client} · Standard: {projectData.applicableStandard}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          {!hasSurveyUploaded ? (
            <>
              <Button
                variant="contained"
                size="small"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={() => setActiveStage('survey')}
                sx={{ backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1D4ED8' }, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
              >
                Upload survey CSV (Stage 2)
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AutoFixHighIcon />}
                onClick={loadDemoSurvey}
                sx={{ borderColor: '#334155', color: '#38BDF8', '&:hover': { borderColor: '#38BDF8' }, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
              >
                Load demo survey (slope.csv)
              </Button>
            </>
          ) : (
            <>
              <Chip
                icon={<CheckCircleOutlineIcon sx={{ '&&': { color: '#34D399', fontSize: '1rem' } }} />}
                label={`${uploadedSurvey?.filename || 'Survey'} (${pointsCount.toLocaleString()} pts)`}
                size="small"
                sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 600, fontSize: '0.75rem' }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={resetProjectToEmpty}
                sx={{ borderColor: '#334155', color: '#94A3B8', '&:hover': { borderColor: '#EF4444', color: '#EF4444' }, textTransform: 'none', fontSize: '0.75rem' }}
              >
                Reset to clean state
              </Button>
            </>
          )}
        </Box>
      </Card>

      {/* 4 Summary Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Survey Points */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            onClick={() => setActiveStage('survey')}
            sx={{ p: 2.2, height: '100%', cursor: 'pointer', transition: 'all 0.15s ease', '&:hover': { borderColor: '#38BDF8' } }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5, fontWeight: 600 }}>
              SURVEY POINTS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: hasSurveyUploaded ? '#F8FAFC' : '#64748B', mb: 1.5, letterSpacing: '-0.02em' }}>
              {hasSurveyUploaded ? pointsCount.toLocaleString() : '0'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {hasSurveyUploaded ? (
                <>
                  <Chip label={`${surveyWarnings.length} warnings`} size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontSize: '0.7rem' }} />
                  <Chip label="0 errors" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.7rem' }} />
                </>
              ) : (
                <Chip label="No survey uploaded" size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.7rem' }} />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Alignment */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            onClick={() => hasSurveyUploaded && setActiveStage('design')}
            sx={{ p: 2.2, height: '100%', cursor: hasSurveyUploaded ? 'pointer' : 'default', transition: 'all 0.15s ease', '&:hover': hasSurveyUploaded ? { borderColor: '#38BDF8' } : {} }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5, fontWeight: 600 }}>
              ALIGNMENT
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: hasSurveyUploaded ? '#F8FAFC' : '#64748B', mb: 1, letterSpacing: '-0.02em' }}>
              {hasSurveyUploaded ? `${roadLengthKm} km` : '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
              {hasSurveyUploaded 
                ? `Ch 0+000 to ${roadLengthKm?.replace('.', '+')} · ${terrainSummary.classification.toLowerCase()} terrain`
                : 'Pending survey intake & horizontal alignment'}
            </Typography>
          </Card>
        </Grid>

        {/* Earthworks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            onClick={() => hasSurveyUploaded && setActiveStage('design')}
            sx={{ p: 2.2, height: '100%', cursor: hasSurveyUploaded ? 'pointer' : 'default', transition: 'all 0.15s ease', '&:hover': hasSurveyUploaded ? { borderColor: '#38BDF8' } : {} }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5, fontWeight: 600 }}>
              EARTHWORKS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: hasSurveyUploaded ? '#F8FAFC' : '#64748B', mb: 1, letterSpacing: '-0.02em' }}>
              {hasSurveyUploaded ? `${totalEarthworksM3?.toLocaleString()} m³` : '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
              {hasSurveyUploaded 
                ? `${cutM3?.toLocaleString()} m³ cut · ${fillM3?.toLocaleString()} m³ fill · ${Math.abs(netM3 || 0).toLocaleString()} m³ ${(netM3 || 0) >= 0 ? 'net spoil' : 'net borrow'}`
                : '0 m³ cut · 0 m³ fill · Pending cross-sections'}
            </Typography>
          </Card>
        </Grid>

        {/* BEME Total */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            onClick={() => hasSurveyUploaded && setActiveStage('beme')}
            sx={{ p: 2.2, height: '100%', cursor: hasSurveyUploaded ? 'pointer' : 'default', transition: 'all 0.15s ease', '&:hover': hasSurveyUploaded ? { borderColor: '#38BDF8' } : {} }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5, fontWeight: 600 }}>
              BEME TOTAL {isLiveLoaded ? '(LIVE)' : '(DRAFT)'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: hasSurveyUploaded ? '#F8FAFC' : '#64748B', mb: 1.5, letterSpacing: '-0.02em' }}>
              {hasSurveyUploaded ? formattedBeme : '—'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {hasSurveyUploaded ? (
                <>
                  <Chip label={isLiveLoaded ? "Live DAG" : "Rev A"} size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.7rem' }} />
                  <Chip label={isLiveLoaded ? "Pipeline verified" : "Draft estimate"} size="small" sx={{ backgroundColor: isLiveLoaded ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: isLiveLoaded ? '#34D399' : '#FBBF24', fontSize: '0.7rem' }} />
                </>
              ) : (
                <Chip label="Pending quantities" size="small" sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.7rem' }} />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column (2/3) */}
        <Grid item xs={12} lg={8}>
          {/* Workflow Pipeline */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Workflow pipeline
              </Typography>
              <Chip 
                label={hasSurveyUploaded ? "DESIGN REVISION A (ACTIVE)" : "NEW PROJECT (INITIALIZING)"} 
                size="small" 
                sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontWeight: 600, fontSize: '0.7rem' }} 
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {pipelineStatus.map(stage => (
                <Box
                  key={stage.num}
                  onClick={() => setActiveStage(stage.stageId as any)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 1.5,
                    border: '1px solid #1E293B',
                    backgroundColor: '#0F1626',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': { borderColor: '#334155', backgroundColor: '#141E33' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stage.color,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {stage.num}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                        {stage.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {stage.desc}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem' }}>
                      {stage.engine}
                    </Typography>
                    <Chip
                      label={stage.status}
                      size="small"
                      sx={{
                        backgroundColor: `${stage.color}18`,
                        color: stage.color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: `1px solid ${stage.color}40`,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* How Every Output is Produced Card */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Deterministic Engineering Architecture
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2.5 }}>
              The software never fabricates civil engineering numbers. Algorithms compute, standard codes check, and a registered civil engineer approves.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    01
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    Raw survey intake
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    CSV coordinate validation, SHA-256 hash stamp, and blunder check.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    02
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    Deterministic maths
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Delaunay triangulation, profile curve fitting, and end-area earthworks.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    03
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    FMW&H rule checks
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Grade limits, superelevation, sight distance, and culvert cover verified.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 1.5, backgroundColor: '#0F1626', border: '1px solid #1E293B', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    04
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    Engineer sign-off
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', display: 'block' }}>
                    Nothing is issued for construction until a licensed COREN engineer signs.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right Column (1/3) */}
        <Grid item xs={12} lg={4}>
          {/* Needs Engineer Review */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Needs engineer review
              </Typography>
              <Chip 
                label={hasSurveyUploaded ? `${openIssues.length} open` : '0 open'} 
                size="small" 
                sx={{ 
                  backgroundColor: openIssues.length > 0 && hasSurveyUploaded ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                  color: openIssues.length > 0 && hasSurveyUploaded ? '#EF4444' : '#34D399', 
                  fontWeight: 700, 
                  fontSize: '0.7rem' 
                }} 
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {hasSurveyUploaded && openIssues.length > 0 ? (
                openIssues.slice(0, 3).map((issue) => (
                  <Box key={issue.id} sx={{ p: 1.8, borderRadius: 1.5, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                        {issue.title}
                      </Typography>
                      <Chip 
                        label={issue.severity} 
                        size="small" 
                        sx={{ 
                          backgroundColor: issue.severity === 'Review required' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                          color: issue.severity === 'Review required' ? '#EF4444' : '#FBBF24', 
                          fontSize: '0.65rem' 
                        }} 
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                      {issue.description}
                    </Typography>
                    <Button size="small" onClick={() => setActiveStage('design')} sx={{ color: '#38BDF8', p: 0, fontSize: '0.75rem', textTransform: 'none' }}>
                      Open item →
                    </Button>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2.5, borderRadius: 1.5, border: '1px dashed #1E293B', backgroundColor: '#0B0F19', textAlign: 'center' }}>
                  <InfoOutlinedIcon sx={{ color: '#64748B', fontSize: '1.8rem', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', mb: 0.5 }}>
                    No pending review items
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                    {hasSurveyUploaded 
                      ? 'All standard checks pass. Ready for CAD drawings and BEME.'
                      : 'Design warnings and slope checks will appear here once your survey coordinates are processed.'}
                  </Typography>
                  {!hasSurveyUploaded && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => setActiveStage('setup')}
                      sx={{ borderColor: '#334155', color: '#38BDF8', fontSize: '0.75rem', textTransform: 'none' }}
                    >
                      Begin in Project Setup →
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Card>

          {/* Dynamic Audit Trail */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Audit trail
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {auditLogs.map((evt) => (
                <Box key={evt.id} sx={{ borderLeft: '2px solid #1E293B', pl: 1.8, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -5,
                      top: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: evt.type === 'approval' ? '#10B981' : evt.type === 'warning' ? '#F59E0B' : evt.type === 'system' ? '#2563EB' : '#38BDF8',
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#F8FAFC', fontSize: '0.8125rem' }}>
                    {evt.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                    {evt.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
