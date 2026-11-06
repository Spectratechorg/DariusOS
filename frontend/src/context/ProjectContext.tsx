import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import useSWR from 'swr';
import { 
  fetchHealth, 
  fetchProjects, 
  fetchProjectDetail, 
  fetchRunBeme,
  fetchRunTerrain,
  fetchRunResult,
  triggerPipelineRun,
  uploadSurveyWithReport,
  HealthResponse,
  ProjectSummary,
  ProjectDetail,
  PipelineRunPayload,
  UploadSummary,
  AlignmentPackage,
  ProfilePackage,
  CrossSectionPackage,
  QuantitiesPackage,
} from '../api';
import { 
  StageId, 
  ProjectData, 
  SurveyPointRow, 
  EngineerWarning, 
  ValidationCheckItem, 
  TerrainSummary, 
  DesignValidationIssue, 
  BemeCategory, 
} from '../types';
import { 
  INITIAL_PROJECT_DATA, 
  MOCK_SURVEY_WARNINGS, 
  MOCK_TERRAIN_SUMMARY, 
  MOCK_DESIGN_ISSUES, 
  MOCK_BEME_CATEGORIES, 
} from '../data/mockData';
import { parseSurveyCsv, computeSha256 } from '../utils/surveyParser';
import { SLOPE_CSV_RAW, SLOPE_CSV_FILENAME, SLOPE_CSV_SIZE, SLOPE_CSV_SHA256 } from '../data/demoSurveyData';

export interface UploadedSurveyInfo {
  filename: string;
  fileSizeBytes: number;
  pointCount: number;
  columnsMapped: string[];
  sha256Hash: string;
  minElevation: number;
  maxElevation: number;
  meanElevation: number;
  uploadedAt: string;
  verdict?: string;
  backendStatus?: string;
  backendSummary?: string;
  reportWarnings?: string[];
  reportErrors?: string[];
}

export interface AuditLogItem {
  id: string;
  title: string;
  time: string;
  type: 'info' | 'warning' | 'approval' | 'system';
}

interface ProjectContextType {
  activeStage: StageId;
  setActiveStage: (stage: StageId) => void;
  isSampleData: boolean;
  setIsSampleData: (val: boolean) => void;
  
  // Project Setup
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
  resetProjectToEmpty: () => void;
  
  // Survey
  hasSurveyUploaded: boolean;
  uploadedSurvey: UploadedSurveyInfo | null;
  surveyPoints: SurveyPointRow[];
  surveyWarnings: EngineerWarning[];
  toggleWarningAcknowledged: (id: string) => void;
  validationChecks: ValidationCheckItem[];
  uploadSurveyFile: (file: File, crsEpsg?: number) => Promise<void>;
  loadDemoSurvey: () => void;
  isUploadingSurvey: boolean;
  
  // Audit Trail
  auditLogs: AuditLogItem[];
  addAuditLog: (title: string, type?: 'info' | 'warning' | 'approval' | 'system') => void;
  
  // Terrain
  terrainSummary: TerrainSummary;
  activeTerrainTab: 'TIN' | 'Contours' | 'Alignment';
  setActiveTerrainTab: (tab: 'TIN' | 'Contours' | 'Alignment') => void;
  
  // Design Engine
  activeDesignTab: 'Longitudinal profile' | 'Horizontal alignment' | 'Cross-section';
  setActiveDesignTab: (tab: 'Longitudinal profile' | 'Horizontal alignment' | 'Cross-section') => void;
  designIssues: DesignValidationIssue[];
  acceptDesignIssue: (id: string, note?: string) => void;
  
  // CAD Drawings
  activeCadSheet: 'PL-01' | 'LP-01' | 'XS-01';
  setActiveCadSheet: (sheet: 'PL-01' | 'LP-01' | 'XS-01') => void;
  cadLayers: Record<string, boolean>;
  toggleCadLayer: (layer: string) => void;
  
  // BEME
  bemeCategories: BemeCategory[];
  updateBemeRate: (categoryCode: string, itemCode: string, newRate: number) => void;
  grandTotalBeme: number;
  
  // Backend connection & live results
  backendHealth?: HealthResponse;
  backendHealthError?: Error;
  isBackendChecking: boolean;
  backendProjects: ProjectSummary[];
  backendProjectsError?: Error;
  activeBackendProject?: ProjectDetail;
  activeBackendProjectError?: Error;
  activeRun?: ProjectDetail['runs'][0];
  activeRunId?: string;
  activeSurveyId?: string;
  isLiveLoaded: boolean;
  liveAlignment?: AlignmentPackage;
  liveProfile?: ProfilePackage;
  liveSections?: CrossSectionPackage;
  liveQuantities?: QuantitiesPackage;
  isRunBusy: boolean;
  runError: string | null;
  triggerRun: (payload: PipelineRunPayload) => Promise<void>;

  // Notifications
  snackbarMessage: string | null;
  setSnackbarMessage: (msg: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: backendHealth, error: backendHealthError, isLoading: isBackendChecking } = useSWR<HealthResponse>('backend-health', fetchHealth, {
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  const { data: backendProjects = [], error: backendProjectsError } = useSWR<ProjectSummary[]>('backend-projects', fetchProjects, {
    shouldRetryOnError: false,
  });

  const activeProjectId = backendProjects[0]?.id;
  const { data: activeBackendProject, error: activeBackendProjectError, mutate: mutateActiveProject } = useSWR<ProjectDetail>(
    activeProjectId ? ['backend-project-detail', activeProjectId] : null,
    () => fetchProjectDetail(activeProjectId as string),
    { shouldRetryOnError: false },
  );

  const activeRun = activeBackendProject?.runs?.[0];
  const activeRunId = activeRun?.id;

  const { data: liveBeme } = useSWR<{ categories: BemeCategory[]; grand_total: number }>(
    activeRunId ? ['backend-run-beme', activeRunId] : null,
    () => fetchRunBeme(activeRunId as string),
    { shouldRetryOnError: false }
  );

  const { data: liveTerrain } = useSWR<TerrainSummary>(
    activeRunId ? ['backend-run-terrain', activeRunId] : null,
    () => fetchRunTerrain(activeRunId as string),
    { shouldRetryOnError: false }
  );

  const { data: liveAlignment } = useSWR<AlignmentPackage>(
    activeRunId ? ['run-alignment', activeRunId] : null,
    () => fetchRunResult(activeRunId as string, 'alignment') as Promise<AlignmentPackage>,
    { shouldRetryOnError: false }
  );
  const { data: liveProfile } = useSWR<ProfilePackage>(
    activeRunId ? ['run-profile', activeRunId] : null,
    () => fetchRunResult(activeRunId as string, 'profile') as Promise<ProfilePackage>,
    { shouldRetryOnError: false }
  );
  const { data: liveSections } = useSWR<CrossSectionPackage>(
    activeRunId ? ['run-sections', activeRunId] : null,
    () => fetchRunResult(activeRunId as string, 'sections') as Promise<CrossSectionPackage>,
    { shouldRetryOnError: false }
  );
  const { data: liveQuantities } = useSWR<QuantitiesPackage>(
    activeRunId ? ['run-quantities', activeRunId] : null,
    () => fetchRunResult(activeRunId as string, 'quantities') as Promise<QuantitiesPackage>,
    { shouldRetryOnError: false }
  );

  const [activeStage, setActiveStage] = useState<StageId>('overview');
  const [isSampleData, setIsSampleData] = useState<boolean>(false);
  
  // Default project data starts clean for a new road corridor
  const [projectData, setProjectData] = useState<ProjectData>({
    ...INITIAL_PROJECT_DATA,
    projectName: 'East-West Road Corridor (Port Harcourt)',
    client: 'Federal Ministry of Works / Regional Infrastructure',
    projectLocation: 'Port Harcourt - Rivers State Corridor',
  });

  // Dynamic Survey state: Starts empty until user uploads a CSV or loads demo
  const [hasSurveyUploaded, setHasSurveyUploaded] = useState<boolean>(false);
  const [uploadedSurveyId, setUploadedSurveyId] = useState<string | null>(null);
  const [isRunBusy, setIsRunBusy] = useState<boolean>(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [uploadedSurvey, setUploadedSurvey] = useState<UploadedSurveyInfo | null>(null);
  const [surveyPoints, setSurveyPoints] = useState<SurveyPointRow[]>([]);
  const [surveyWarnings, setSurveyWarnings] = useState<EngineerWarning[]>([]);
  const [validationChecks, setValidationChecks] = useState<ValidationCheckItem[]>([]);
  const [isUploadingSurvey, setIsUploadingSurvey] = useState<boolean>(false);

  // Dynamic Audit Trail: Starts with project creation and records real events
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      title: 'Project workspace initialized (Stage 1 Ready)',
      time: 'Just now',
      type: 'system',
    },
  ]);

  const addAuditLog = (title: string, type: 'info' | 'warning' | 'approval' | 'system' = 'info') => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      time: 'Just now',
      type,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const [terrainSummary, setTerrainSummary] = useState<TerrainSummary>({
    ...MOCK_TERRAIN_SUMMARY,
    surveyPointsUsed: 0,
    tinTriangles: 0,
  });
  const [activeTerrainTab, setActiveTerrainTab] = useState<'TIN' | 'Contours' | 'Alignment'>('TIN');
  
  
  const [activeDesignTab, setActiveDesignTab] = useState<'Longitudinal profile' | 'Horizontal alignment' | 'Cross-section'>('Longitudinal profile');
  const [designIssues, setDesignIssues] = useState<DesignValidationIssue[]>(MOCK_DESIGN_ISSUES);
  
  const [activeCadSheet, setActiveCadSheet] = useState<'PL-01' | 'LP-01' | 'XS-01'>('PL-01');
  const [cadLayers, setCadLayers] = useState<Record<string, boolean>>({
    Alignment: true,
    Contours: true,
    Drainage: true,
    'Chainage labels': true,
  });
  
  const [bemeCategories, setBemeCategories] = useState<BemeCategory[]>(MOCK_BEME_CATEGORIES);
  
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Synchronize live BEME when available from backend
  useEffect(() => {
    if (liveBeme?.categories && liveBeme.categories.length > 0) {
      setBemeCategories(liveBeme.categories);
    }
  }, [liveBeme]);

  // Synchronize live Terrain summary when available from backend
  useEffect(() => {
    if (liveTerrain) {
      setTerrainSummary(liveTerrain);
    }
  }, [liveTerrain]);

  // Hydrate client survey state from the active backend project so a seeded
  // project shows its survey instead of zeros on first load.
  useEffect(() => {
    if (!hasSurveyUploaded && activeBackendProject?.surveys?.length) {
      const survey =
        activeBackendProject.surveys.find(item => item.id === activeRun?.survey_file_id) ??
        activeBackendProject.surveys[0];
      setUploadedSurvey({
        filename: survey.original_filename,
        fileSizeBytes: survey.file_size_bytes,
        pointCount: survey.point_count ?? 0,
        columnsMapped: [],
        sha256Hash: survey.sha256_hash,
        minElevation: 0,
        maxElevation: 0,
        meanElevation: 0,
        uploadedAt: survey.uploaded_at,
        backendStatus: survey.status,
        verdict: survey.status,
      });
      setUploadedSurveyId(survey.id);
      setHasSurveyUploaded(true);
    }
  }, [activeBackendProject, activeRun?.survey_file_id, hasSurveyUploaded]);

  // Synchronize project data with active backend project if connected
  useEffect(() => {
    if (activeBackendProject) {
      setProjectData(prev => ({
        ...prev,
        projectName: activeBackendProject.name || prev.projectName,
        client: 'Federal Ministry of Works / Infrastructure Authority',
        projectLocation: 'Port Harcourt Corridor',
        carriagewayWidthM: 7.3,
      }));
    }
  }, [activeBackendProject]);

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData(prev => {
      const updated = { ...prev, ...data };
      if (data.projectName && data.projectName !== prev.projectName) {
        addAuditLog(`Project renamed: ${data.projectName}`, 'system');
      } else if (data.roadClassification && data.roadClassification !== prev.roadClassification) {
        addAuditLog(`Classification changed to: ${data.roadClassification}`, 'system');
      }
      return updated;
    });
  };

  const uploadSurveyFile = async (file: File, crsEpsg: number = 32632) => {
    setIsUploadingSurvey(true);
    setRunError(null);
    try {
      const isPointCloud = /\.(las|laz)$/i.test(file.name);
      const sha256 = await computeSha256(file);
      let parsed: ReturnType<typeof parseSurveyCsv> | null = null;

      if (!isPointCloud) {
        const text = await file.text();
        parsed = parseSurveyCsv(text, file.name, file.size, sha256);
        setSurveyPoints(parsed.points);
        setValidationChecks(parsed.validationChecks);
        setSurveyWarnings(parsed.warnings.length > 0 ? parsed.warnings : []);
        setTerrainSummary(prev => ({
          ...prev,
          surveyPointsUsed: parsed!.totalPoints,
          tinTriangles: Math.round(parsed!.totalPoints * 1.9),
          lowestGroundM: parsed!.minElevation,
          highestGroundM: parsed!.maxElevation,
          meanSlopePercent: Math.max(1, Math.min(12, Math.round(((parsed!.maxElevation - parsed!.minElevation) / 200) * 100))),
          classification: (parsed!.maxElevation - parsed!.minElevation) < 5 ? 'Flat' : 'Rolling',
        }));
      }

      let summary: UploadSummary | null = null;
      if (activeProjectId) {
        summary = await uploadSurveyWithReport(activeProjectId, file, crsEpsg);
      }

      const pointCount =
        summary?.quality_report?.valid_points ?? summary?.quality_report?.total_raw_points ?? parsed?.totalPoints ?? 0;

      setUploadedSurvey({
        filename: summary?.original_filename ?? file.name,
        fileSizeBytes: summary?.file_size_bytes ?? file.size,
        pointCount,
        columnsMapped: parsed?.columnsMapped ?? [],
        sha256Hash: summary?.sha256_hash ?? sha256,
        minElevation: parsed?.minElevation ?? 0,
        maxElevation: parsed?.maxElevation ?? 0,
        meanElevation: parsed?.meanElevation ?? 0,
        uploadedAt: 'Just now',
        verdict: summary?.quality_report?.verdict ?? summary?.status,
        backendStatus: summary?.status,
        backendSummary: summary?.plain_language_summary ?? summary?.quality_report?.summary_text,
        reportWarnings: summary?.quality_report?.warnings,
        reportErrors: summary?.quality_report?.errors,
      });
      if (summary?.file_id) setUploadedSurveyId(summary.file_id);
      setHasSurveyUploaded(true);
      if (activeProjectId) mutateActiveProject();

      addAuditLog(
        `Survey intake validated: ${file.name} (${pointCount.toLocaleString()} points, SHA-256 ${sha256.slice(0, 8)}...)`,
        'approval'
      );

      setSnackbarMessage(`Survey "${file.name}" uploaded: ${pointCount.toLocaleString()} points validated.`);
      setActiveStage('survey');
    } catch (err: any) {
      setSnackbarMessage(`Survey upload failed: ${err.message || 'Invalid survey file'}`);
      setRunError(err.message || 'Survey upload failed');
    } finally {
      setIsUploadingSurvey(false);
    }
  };

  const triggerRun = async (payload: PipelineRunPayload) => {
    if (!activeProjectId) {
      setRunError('No backend project available for the pipeline run.');
      return;
    }
    setIsRunBusy(true);
    setRunError(null);
    try {
      const result = await triggerPipelineRun(activeProjectId, payload);
      await mutateActiveProject();
      addAuditLog(
        `Pipeline run ${result.run_id.slice(0, 8)} completed (${result.summary.total_length_m.toFixed(1)} m, cut ${result.summary.total_cut_volume_m3.toFixed(1)} m³)`,
        'approval'
      );
      setSnackbarMessage(
        `Design generated: ${result.summary.total_length_m.toFixed(0)} m, cut ${result.summary.total_cut_volume_m3.toFixed(0)} m³.`
      );
      setActiveStage('design');
    } catch (err: any) {
      setRunError(err.message || 'Pipeline run failed');
      setSnackbarMessage(`Pipeline run failed: ${err.message || 'unknown error'}`);
    } finally {
      setIsRunBusy(false);
    }
  };

  const loadDemoSurvey = () => {
    try {
      const parsed = parseSurveyCsv(SLOPE_CSV_RAW, SLOPE_CSV_FILENAME, SLOPE_CSV_SIZE, SLOPE_CSV_SHA256);
      setUploadedSurvey({
        filename: SLOPE_CSV_FILENAME,
        fileSizeBytes: SLOPE_CSV_SIZE,
        pointCount: parsed.totalPoints,
        columnsMapped: parsed.columnsMapped,
        sha256Hash: SLOPE_CSV_SHA256,
        minElevation: parsed.minElevation,
        maxElevation: parsed.maxElevation,
        meanElevation: parsed.meanElevation,
        uploadedAt: 'Demonstration verified dataset',
      });
      setSurveyPoints(parsed.points);
      setValidationChecks(parsed.validationChecks);
      setSurveyWarnings(MOCK_SURVEY_WARNINGS);
      setHasSurveyUploaded(true);

      setTerrainSummary(prev => ({
        ...prev,
        surveyPointsUsed: parsed.totalPoints,
        tinTriangles: 545,
        lowestGroundM: 300.0,
        highestGroundM: 304.0,
        meanSlopePercent: 2.0,
        classification: 'Flat',
      }));

      addAuditLog(
        `Loaded demo survey dataset (${SLOPE_CSV_FILENAME} - 287 points, SHA-256 ${SLOPE_CSV_SHA256.slice(0, 8)}...)`,
        'info'
      );

      setSnackbarMessage('Demo survey "slope.csv" loaded with 287 validated points.');
      setActiveStage('survey');
    } catch {
      setSnackbarMessage('Failed to load demo survey');
    }
  };

  const resetProjectToEmpty = () => {
    setHasSurveyUploaded(false);
    setUploadedSurvey(null);
    setSurveyPoints([]);
    setSurveyWarnings([]);
    setValidationChecks([]);
    setTerrainSummary({
      ...MOCK_TERRAIN_SUMMARY,
      surveyPointsUsed: 0,
      tinTriangles: 0,
    });
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        title: 'Project workspace reset to clean state (Stage 1 Ready)',
        time: 'Just now',
        type: 'system',
      },
    ]);
    setSnackbarMessage('Project reset to a clean dynamic state.');
  };

  const toggleWarningAcknowledged = (id: string) => {
    setSurveyWarnings(prev => prev.map(w => {
      if (w.id === id) {
        const nextState = !w.isAcknowledged;
        addAuditLog(
          `Engineer ${nextState ? 'acknowledged' : 're-opened'} survey warning (${w.title})`,
          nextState ? 'approval' : 'warning'
        );
        return { ...w, isAcknowledged: nextState };
      }
      return w;
    }));
  };

  const acceptDesignIssue = (id: string, note?: string) => {
    setDesignIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        addAuditLog(`Engineer approved review item: ${issue.title}`, 'approval');
        return {
          ...issue,
          isAccepted: true,
          engineerNote: note || 'Accepted by Engineering Lead with geotechnical verification note.'
        };
      }
      return issue;
    }));
    setSnackbarMessage(`Item accepted with engineer note. Ready for drawing release.`);
  };

  const toggleCadLayer = (layer: string) => {
    setCadLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const updateBemeRate = (categoryCode: string, itemCode: string, newRate: number) => {
    setBemeCategories(prev => prev.map(cat => {
      if (cat.categoryCode !== categoryCode) return cat;
      const updatedItems = cat.items.map(item => {
        if (item.code !== itemCode) return item;
        const amount = Math.round(item.quantity * newRate);
        return { ...item, unitRate: newRate, amount };
      });
      const subtotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
      return { ...cat, items: updatedItems, subtotal };
    }));
  };

  const grandTotalBeme = useMemo(() => {
    return bemeCategories.reduce((acc, cat) => acc + cat.subtotal, 0);
  }, [bemeCategories]);

  const isLiveLoaded = Boolean(activeRun && activeRun.status === 'COMPLETED');

  return (
    <ProjectContext.Provider value={{
      activeStage,
      setActiveStage,
      isSampleData,
      setIsSampleData,
      projectData,
      updateProjectData,
      resetProjectToEmpty,
      hasSurveyUploaded,
      uploadedSurvey,
      surveyPoints,
      surveyWarnings,
      toggleWarningAcknowledged,
      validationChecks,
      uploadSurveyFile,
      loadDemoSurvey,
      isUploadingSurvey,
      auditLogs,
      addAuditLog,
      terrainSummary,
      activeTerrainTab,
      setActiveTerrainTab,
      activeDesignTab,
      setActiveDesignTab,
      designIssues,
      acceptDesignIssue,
      activeCadSheet,
      setActiveCadSheet,
      cadLayers,
      toggleCadLayer,
      bemeCategories,
      updateBemeRate,
      grandTotalBeme,
      backendHealth,
      backendHealthError,
      isBackendChecking,
      backendProjects,
      backendProjectsError,
      activeBackendProject,
      activeBackendProjectError,
      activeRun,
      activeRunId,
      activeSurveyId: uploadedSurveyId ?? activeRun?.survey_file_id ?? activeBackendProject?.surveys?.[0]?.id,
      isLiveLoaded,
      liveAlignment,
      liveProfile,
      liveSections,
      liveQuantities,
      isRunBusy,
      runError,
      triggerRun,
      snackbarMessage,
      setSnackbarMessage,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
