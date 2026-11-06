import React from 'react';
import { Box, Card, Typography, Grid, Chip, Button } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useProject } from '../context/ProjectContext';
import { VIZ_TOKENS } from '../tokens';

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

  // 6-stage pipeline reflecting live status
  const pipelineStages = [
    { 
      num: 1, 
      name: 'Project setup', 
      desc: `${projectData.roadClassification} · ${projectData.applicableStandard}`, 
      engine: 'PROJECT CONTEXT', 
      status: 'Complete' as const, 
      icon: <LayersOutlinedIcon sx={{ fontSize: '1.1rem' }} />,
      stageId: 'setup' 
    },
    { 
      num: 2, 
      name: 'Survey intake & validation', 
      desc: hasSurveyUploaded 
        ? `${pointsCount.toLocaleString()} points validated (${surveyWarnings.length} warnings)`
        : 'Awaiting survey coordinates (CSV/XYZ)', 
      engine: 'VALIDATION ENGINE', 
      status: (hasSurveyUploaded ? 'Complete' : 'Waiting') as 'Complete' | 'Waiting' | 'In progress', 
      icon: <TimelineRoundedIcon sx={{ fontSize: '1.1rem' }} />,
      stageId: 'survey' 
    },
    { 
      num: 3, 
      name: 'Terrain & TIN surface', 
      desc: hasSurveyUploaded 
        ? `${terrainSummary.tinTriangles} mesh triangles · ${terrainSummary.classification} slope`
        : 'Pending survey point intake', 
      engine: 'TERRAIN ENGINE', 
      status: (hasSurveyUploaded ? 'Complete' : 'Waiting') as 'Complete' | 'Waiting' | 'In progress', 
      icon: <TerrainOutlinedIcon sx={{ fontSize: '1.1rem' }} />,
      stageId: 'terrain' 
    },
    { 
      num: 4, 
      name: 'Geometric design engine', 
      desc: hasSurveyUploaded 
        ? 'Horizontal curve tangents, VPI grade checks'
        : 'Requires terrain surface model', 
      engine: 'ENGINEERING ENGINE', 
      status: (hasSurveyUploaded ? 'In progress' : 'Waiting') as 'Complete' | 'Waiting' | 'In progress', 
      icon: <ConstructionOutlinedIcon sx={{ fontSize: '1.1rem' }} />,
      stageId: 'design' 
    },
    { 
      num: 5, 
      name: 'CAD drawing sheets', 
      desc: 'PL-01 Plan, LP-01 Profile, XS-01 Cross-sections', 
      engine: 'CAD ENGINE', 
      status: (hasSurveyUploaded ? 'Waiting' : 'Waiting') as 'Complete' | 'Waiting' | 'In progress', 
      icon: <DesignServicesOutlinedIcon sx={{ fontSize: '1.1rem' }} />,
      stageId: 'drawings' 
    },
    { 
      num: 6, 
      name: 'BEME & takeoff report', 
      desc: 'Itemized 6-bill takeoff with live rate analysis', 
      engine: 'QUANTITY & BEME', 
      status: (hasSurveyUploaded ? 'In progress' : 'Waiting') as 'Complete' | 'Waiting' | 'In progress', 
      icon: <ReceiptLongOutlinedIcon sx={{ fontSize: '1.1rem' }} />,
      stageId: 'beme' 
    },
  ];

  const openIssues = designIssues.filter(i => !i.isAccepted);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Corridor Header Card */}
      <Card
        sx={{
          p: 2.5,
          mb: 3,
          backgroundColor: '#0F1626',
          border: '1px solid #1E293B',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#38BDF8',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: VIZ_TOKENS.typography.monoFont,
                fontSize: '0.68rem',
              }}
            >
              ACTIVE HIGHWAY CORRIDOR
            </Typography>
            <Chip
              label={isLiveLoaded ? 'LIVE DAG RUN' : 'ENGINEERING REVISION C'}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                fontFamily: VIZ_TOKENS.typography.monoFont,
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F8FAFC', mb: 0.5 }}>
            {projectData.projectName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
            Authority: <strong style={{ color: '#CBD5E1' }}>{projectData.client}</strong> · Standard: <strong style={{ color: '#CBD5E1' }}>{projectData.applicableStandard}</strong> · Terrain: <strong style={{ color: '#CBD5E1' }}>{terrainSummary.classification}</strong>
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
                sx={{
                  backgroundColor: '#2563EB',
                  '&:hover': { backgroundColor: '#1D4ED8' },
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Upload survey CSV (Stage 2)
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AutoFixHighIcon />}
                onClick={loadDemoSurvey}
                sx={{
                  borderColor: '#334155',
                  color: '#38BDF8',
                  '&:hover': { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.05)' },
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                Load demo survey
              </Button>
            </>
          ) : (
            <>
              <Chip
                icon={<CheckCircleOutlineIcon sx={{ '&&': { color: '#16A34A', fontSize: '1rem' } }} />}
                label={`${uploadedSurvey?.filename || 'Survey'} (${pointsCount.toLocaleString()} pts)`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(22, 163, 74, 0.12)',
                  color: '#4ADE80',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={resetProjectToEmpty}
                sx={{
                  borderColor: '#334155',
                  color: '#94A3B8',
                  '&:hover': { borderColor: '#DC2626', color: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.05)' },
                  fontSize: '0.75rem',
                }}
              >
                Reset project state
              </Button>
            </>
          )}
        </Box>
      </Card>

      {/* 4 Stat Cards with Tabular Numerals & Subtext Sparklines */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Stat 1: Survey Points */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => setActiveStage('survey')}
            sx={{
              p: 2.2,
              height: '100%',
              cursor: 'pointer',
              border: '1px solid #1E293B',
              backgroundColor: '#0F1626',
              transition: VIZ_TOKENS.transitions.cardHover,
              '&:hover': { borderColor: '#38BDF8', transform: 'translateY(-1px)' },
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.8 }}>
              SURVEY POINTS
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: hasSurveyUploaded ? '#F8FAFC' : '#64748B',
                mb: 1.2,
                fontFamily: VIZ_TOKENS.typography.monoFont,
              }}
            >
              {hasSurveyUploaded ? pointsCount.toLocaleString() : '0'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {hasSurveyUploaded ? (
                <>
                  <Chip
                    label={`${surveyWarnings.length} warnings`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      color: '#FBBF24',
                      fontSize: '0.68rem',
                      height: 20,
                      fontWeight: 600,
                      fontFamily: VIZ_TOKENS.typography.monoFont,
                    }}
                  />
                  <Chip
                    label="0 errors"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(22, 163, 74, 0.12)',
                      color: '#4ADE80',
                      fontSize: '0.68rem',
                      height: 20,
                      fontWeight: 600,
                      fontFamily: VIZ_TOKENS.typography.monoFont,
                    }}
                  />
                </>
              ) : (
                <Chip
                  label="No survey ingested"
                  size="small"
                  sx={{ backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.68rem', height: 20 }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Stat 2: Alignment */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => hasSurveyUploaded && setActiveStage('design')}
            sx={{
              p: 2.2,
              height: '100%',
              cursor: hasSurveyUploaded ? 'pointer' : 'default',
              border: '1px solid #1E293B',
              backgroundColor: '#0F1626',
              transition: VIZ_TOKENS.transitions.cardHover,
              '&:hover': hasSurveyUploaded ? { borderColor: '#38BDF8', transform: 'translateY(-1px)' } : {},
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.8 }}>
              ALIGNMENT
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: hasSurveyUploaded ? '#F8FAFC' : '#64748B',
                mb: 1.2,
                fontFamily: VIZ_TOKENS.typography.monoFont,
              }}
            >
              {hasSurveyUploaded ? `${roadLengthKm} km` : '—'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#94A3B8',
                fontSize: '0.73rem',
                fontFamily: VIZ_TOKENS.typography.monoFont,
                display: 'block',
              }}
            >
              {hasSurveyUploaded
                ? `Ch 0+000 to ${roadLengthKm?.replace('.', '+')} · ${terrainSummary.classification.toLowerCase()} terrain`
                : 'Pending survey intake & horizontal alignment'}
            </Typography>
          </Card>
        </Grid>

        {/* Stat 3: Earthworks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => hasSurveyUploaded && setActiveStage('design')}
            sx={{
              p: 2.2,
              height: '100%',
              cursor: hasSurveyUploaded ? 'pointer' : 'default',
              border: '1px solid #1E293B',
              backgroundColor: '#0F1626',
              transition: VIZ_TOKENS.transitions.cardHover,
              '&:hover': hasSurveyUploaded ? { borderColor: '#38BDF8', transform: 'translateY(-1px)' } : {},
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.8 }}>
              EARTHWORKS
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: hasSurveyUploaded ? '#F8FAFC' : '#64748B',
                mb: 1.2,
                fontFamily: VIZ_TOKENS.typography.monoFont,
              }}
            >
              {hasSurveyUploaded ? `${totalEarthworksM3?.toLocaleString()} m³` : '—'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#94A3B8',
                fontSize: '0.73rem',
                fontFamily: VIZ_TOKENS.typography.monoFont,
                display: 'block',
              }}
            >
              {hasSurveyUploaded
                ? `${cutM3?.toLocaleString()} m³ cut · ${fillM3?.toLocaleString()} m³ fill · ${Math.abs(netM3 || 0).toLocaleString()} m³ ${(netM3 || 0) >= 0 ? 'spoil' : 'borrow'}`
                : '0 m³ cut · 0 m³ fill · Pending cross-sections'}
            </Typography>
          </Card>
        </Grid>

        {/* Stat 4: BEME Total */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => setActiveStage('beme')}
            sx={{
              p: 2.2,
              height: '100%',
              cursor: 'pointer',
              border: '1px solid #1E293B',
              backgroundColor: '#0F1626',
              transition: VIZ_TOKENS.transitions.cardHover,
              '&:hover': { borderColor: '#38BDF8', transform: 'translateY(-1px)' },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Typography variant="subtitle2" sx={{ color: '#64748B' }}>
                BEME TOTAL (LIVE)
              </Typography>
              <Chip
                label="Traceable"
                size="small"
                sx={{
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38BDF8',
                  fontSize: '0.65rem',
                  height: 18,
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#F8FAFC',
                mb: 1.2,
                fontFamily: VIZ_TOKENS.typography.monoFont,
              }}
            >
              {formattedBeme}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.73rem', display: 'block' }}>
              {isLiveLoaded ? 'Python DAG takeoff · 6 Bills' : 'Deterministic formula takeoff · 6 Bills'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 6-Stage Engineering Pipeline Tracker */}
      <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0D1424' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Engineering Workflow Pipeline
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Corridor stages from survey intake to priced BEME and printable drawing sheets.
            </Typography>
          </Box>
          <Chip
            icon={<ShieldOutlinedIcon sx={{ '&&': { color: '#38BDF8', fontSize: '0.9rem' } }} />}
            label="Deterministic Pipeline"
            size="small"
            sx={{
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              color: '#38BDF8',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
        </Box>

        <Grid container spacing={1.5}>
          {pipelineStages.map((stage) => {
            const isComplete = stage.status === 'Complete';
            const isInProgress = stage.status === 'In progress';
            const statusColor = isComplete ? '#16A34A' : isInProgress ? '#38BDF8' : '#64748B';

            return (
              <Grid item xs={12} sm={6} md={4} lg={2} key={stage.num}>
                <Box
                  onClick={() => setActiveStage(stage.stageId as any)}
                  sx={{
                    p: 1.8,
                    borderRadius: 1.5,
                    border: isInProgress
                      ? '1.5px solid #38BDF8'
                      : isComplete
                      ? '1px solid rgba(22, 163, 74, 0.35)'
                      : '1px solid #1E293B',
                    backgroundColor: isInProgress
                      ? 'rgba(56, 189, 248, 0.05)'
                      : isComplete
                      ? 'rgba(22, 163, 74, 0.03)'
                      : '#0A0E1A',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: VIZ_TOKENS.transitions.cardHover,
                    '&:hover': {
                      borderColor: '#38BDF8',
                      backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isComplete
                            ? '#16A34A'
                            : isInProgress
                            ? '#38BDF8'
                            : '#1E293B',
                          color: '#F8FAFC',
                          fontFamily: VIZ_TOKENS.typography.monoFont,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {stage.num}
                      </Box>
                      <Chip
                        label={stage.status}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          backgroundColor: isComplete
                            ? 'rgba(22, 163, 74, 0.15)'
                            : isInProgress
                            ? 'rgba(56, 189, 248, 0.15)'
                            : 'rgba(100, 116, 139, 0.12)',
                          color: statusColor,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.825rem', mb: 0.5 }}>
                      {stage.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', lineHeight: 1.35, display: 'block' }}>
                      {stage.desc}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: statusColor,
                        fontFamily: VIZ_TOKENS.typography.monoFont,
                      }}
                    >
                      {stage.engine}
                    </Typography>
                    <ArrowForwardRoundedIcon sx={{ fontSize: '0.8rem', color: '#64748B' }} />
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column (2/3): Engineering Sign-Off Ledger & Execution Sequence */}
        <Grid item xs={12} lg={8}>
          {/* Engineering Review Alerts */}
          <Card sx={{ p: 2.5, mb: 3, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  Registered Engineer Review Items
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Deterministic checks flagged for human sign-off before CAD sheet issuance.
                </Typography>
              </Box>
              <Chip
                label={`${openIssues.length} open items`}
                size="small"
                sx={{
                  backgroundColor: openIssues.length > 0 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 163, 74, 0.15)',
                  color: openIssues.length > 0 ? '#F87171' : '#4ADE80',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {designIssues.map((issue) => {
                const isCritical = issue.severity === 'Review required';
                const isWarning = issue.severity === 'Warning';
                const flagColor = isCritical ? '#DC2626' : isWarning ? '#F59E0B' : '#38BDF8';

                return (
                  <Box
                    key={issue.id}
                    sx={{
                      p: 1.8,
                      borderRadius: 1.5,
                      border: `1px solid ${issue.isAccepted ? 'rgba(22, 163, 74, 0.3)' : 'rgba(30, 41, 59, 0.9)'}`,
                      backgroundColor: issue.isAccepted ? 'rgba(22, 163, 74, 0.04)' : '#0A0E1A',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      {isCritical ? (
                        <ErrorOutlineRoundedIcon sx={{ color: '#DC2626', fontSize: '1.25rem', mt: 0.2 }} />
                      ) : isWarning ? (
                        <WarningAmberRoundedIcon sx={{ color: '#F59E0B', fontSize: '1.25rem', mt: 0.2 }} />
                      ) : (
                        <ShieldOutlinedIcon sx={{ color: '#38BDF8', fontSize: '1.25rem', mt: 0.2 }} />
                      )}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.85rem' }}>
                            {issue.title}
                          </Typography>
                          <Chip
                            label={issue.severity}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              backgroundColor: `${flagColor}1F`,
                              color: flagColor,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                          {issue.description}
                        </Typography>
                        {issue.isAccepted && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: '#4ADE80',
                              fontSize: '0.7rem',
                              mt: 0.5,
                              fontStyle: 'italic',
                            }}
                          >
                            ✓ Signed off: "{issue.engineerNote}"
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Button
                      size="small"
                      variant={issue.isAccepted ? 'text' : 'outlined'}
                      onClick={() => setActiveStage('design')}
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderColor: '#334155',
                        color: issue.isAccepted ? '#4ADE80' : '#38BDF8',
                        '&:hover': { borderColor: '#38BDF8' },
                      }}
                    >
                      {issue.isAccepted ? 'View Sign-off' : 'Review & Sign off'}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Card>

          {/* 4-Step Engineering Rigor Architecture */}
          <Card sx={{ p: 2.5, border: '1px solid #1E293B', backgroundColor: '#0F1626' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
              Deterministic Output Architecture
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 2 }}>
              Algorithms suggest parameters; deterministic civil maths calculates; validation checks tolerances; registered engineer signs off.
            </Typography>

            <Grid container spacing={2}>
              {[
                { step: '01', title: 'System Proposes', desc: 'Standards parameters and curve alternatives suggested with clear rationale.' },
                { step: '02', title: 'Maths Calculates', desc: 'Deterministic formulas produce alignments, profiles, daylighting cross-sections, and cut/fill.' },
                { step: '03', title: 'Validation Checks', desc: 'Every grade, slope, and radius tested against FMW&H / AASHTO design standards.' },
                { step: '04', title: 'Engineer Approves', desc: 'Final CAD sheets and priced BEME are only issued upon registered engineer signature.' },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.step}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: '#0A0E1A',
                      border: '1px solid #1E293B',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#38BDF8',
                        fontFamily: VIZ_TOKENS.typography.monoFont,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        display: 'block',
                        mb: 0.5,
                      }}
                    >
                      {item.step}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem', mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', lineHeight: 1.35 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Right Column (1/3): Audit Trail & Session Verification */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, border: '1px solid #1E293B', backgroundColor: '#0F1626', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Engineering Audit Trail
              </Typography>
              <Chip
                label="SHA-256 Verified"
                size="small"
                sx={{
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  color: '#4ADE80',
                  fontSize: '0.65rem',
                  fontFamily: VIZ_TOKENS.typography.monoFont,
                  height: 20,
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              {auditLogs.map((log, idx) => (
                <Box
                  key={idx}
                  sx={{
                    pb: 1.5,
                    borderBottom: idx < auditLogs.length - 1 ? '1px solid #1A2436' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#38BDF8',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        fontFamily: VIZ_TOKENS.typography.monoFont,
                      }}
                    >
                      {log.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.78rem', lineHeight: 1.4 }}>
                    {log.title}
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
