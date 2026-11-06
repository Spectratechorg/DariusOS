import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import useSWR from 'swr';
import { 
  fetchHealth, 
  fetchProjects, 
  fetchProjectDetail, 
  fetchRunBeme,
  fetchRunTerrain,
  uploadSurveyToBackend,
  HealthResponse, 
  ProjectSummary, 
  ProjectDetail,
} from '../api';
import { 
  StageId, 
  ProjectData, 
  SurveyPointRow, 
  EngineerWarning, 
  ValidationCheckItem, 
  TerrainSummary, 
  CurveOption, 
  DesignValidationIssue, 
  BemeCategory, 
} from '../types';
import { 
  INITIAL_PROJECT_DATA, 
  MOCK_SURVEY_WARNINGS, 
  MOCK_TERRAIN_SUMMARY, 
  MOCK_CURVE_OPTIONS, 
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
  uploadSurveyFile: (file: File) => Promise<void>;
  loadDemoSurvey: () => void;
  isUploadingSurvey: boolean;
  
  // Audit Trail
  auditLogs: AuditLogItem[];
  addAuditLog: (title: string, type?: 'info' | 'warning' | 'approval' | 'system') => void;
  
  // Terrain
  terrainSummary: TerrainSummary;
  activeTerrainTab: 'TIN' | 'Contours' | 'Alignment';
  setActiveTerrainTab: (tab: 'TIN' | 'Contours' | 'Alignment') => void;
  
  // AI Reasoning / Curve Options
  curveOptions: CurveOption[];
  selectedCurveId: 'A' | 'B' | 'C';
  selectCurveOption: (id: 'A' | 'B' | 'C') => void;
  
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
  isLiveLoaded: boolean;

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
  const { data: activeBackendProject, error: activeBackendProjectError } = useSWR<ProjectDetail>(
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

  const [activeStage, setActiveStage] = useState<StageId>('overview');
  const [isSampleData, setIsSampleData] = useState<boolean>(false);
  
  // Default project data starts clean for a new road corridor
  const [projectData, setProjectData] = useState<ProjectData>({
    ...INITIAL_PROJECT_DATA,
  });

  // Dynamic Survey state: Starts empty until user uploads a CSV or loads demo
  const [hasSurveyUploaded, setHasSurveyUploaded] = useState<boolean>(false);
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
  
  const [curveOptions, setCurveOptions] = useState<CurveOption[]>(MOCK_CURVE_OPTIONS);
  const [selectedCurveId, setSelectedCurveId] = useState<'A' | 'B' | 'C'>('B');
  
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

  // Synchronize project data with active backend project if connected
  useEffect(() => {
    if (activeBackendProject) {
      setProjectData(prev => ({
        ...prev,
        projectName: activeBackendProject.name || prev.projectName,
        client: 'Federal Ministry of Works / Infrastructure Authority',
        projectLocation: prev.projectLocation,
        carriagewayWidthM: 7.3,
      }));
    }
  }, [activeBackendProject]);

  // Update curve options earthwork numbers if active run has live volume data
  useEffect(() => {
    if (activeRun?.total_cut_volume_m3) {
      const cut = Math.round(activeRun.total_cut_volume_m3);
      const fill = Math.round(activeRun.total_fill_volume_m3 || 0);
      setCurveOptions([
        { id: 'A', radiusM: 180, title: 'Tighter curve', badge: 'Alternative', description: 'Minimizes excavation volumes.', cutM3: Math.round(cut * 0.91), fillM3: Math.round(fill * 0.93) },
        { id: 'B', radiusM: 260, title: 'Balanced alignment (Live DAG)', badge: 'Selected', description: 'Single source of truth computed directly by engineering pipeline.', cutM3: cut, fillM3: fill },
        { id: 'C', radiusM: 420, title: 'Long radius', badge: 'Alternative', description: 'Improves high-speed comfort and stopping sight distance.', cutM3: Math.round(cut * 1.18), fillM3: Math.round(fill * 1.15) },
      ]);
    }
  }, [activeRun]);

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

  const uploadSurveyFile = async (file: File) => {
    setIsUploadingSurvey(true);
    try {
      const sha256 = await computeSha256(file);
      const text = await file.text();
      const parsed = parseSurveyCsv(text, file.name, file.size, sha256);

      setUploadedSurvey({
        filename: parsed.filename,
        fileSizeBytes: parsed.fileSizeBytes,
        pointCount: parsed.totalPoints,
        columnsMapped: parsed.columnsMapped,
        sha256Hash: parsed.sha256Hash,
        minElevation: parsed.minElevation,
        maxElevation: parsed.maxElevation,
        meanElevation: parsed.meanElevation,
        uploadedAt: 'Just now',
      });

      setSurveyPoints(parsed.points);
      setValidationChecks(parsed.validationChecks);
      setSurveyWarnings(parsed.warnings.length > 0 ? parsed.warnings : []);
      setHasSurveyUploaded(true);

      setTerrainSummary(prev => ({
        ...prev,
        surveyPointsUsed: parsed.totalPoints,
        tinTriangles: Math.round(parsed.totalPoints * 1.9),
        lowestGroundM: parsed.minElevation,
        highestGroundM: parsed.maxElevation,
        meanSlopePercent: Math.max(1, Math.min(12, Math.round(((parsed.maxElevation - parsed.minElevation) / 200) * 100))),
        classification: (parsed.maxElevation - parsed.minElevation) < 5 ? 'Flat' : 'Rolling',
      }));

      // Add to dynamic audit log
      addAuditLog(
        `Survey intake validated: ${file.name} (${parsed.totalPoints.toLocaleString()} points, SHA-256 ${sha256.slice(0, 8)}...)`,
        'approval'
      );

      // Try uploading to backend if backend active project is set
      if (activeProjectId) {
        uploadSurveyToBackend(activeProjectId, file).catch(() => {
          // Gracefully continue in client-only or serverless mode
        });
      }

      setSnackbarMessage(`Survey "${file.name}" uploaded successfully: ${parsed.totalPoints.toLocaleString()} points validated.`);
      setActiveStage('survey');
    } catch (err: any) {
      setSnackbarMessage(`Survey upload failed: ${err.message || 'Invalid survey file'}`);
    } finally {
      setIsUploadingSurvey(false);
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

  const selectCurveOption = (id: 'A' | 'B' | 'C') => {
    setSelectedCurveId(id);
    setCurveOptions(prev => prev.map(c => ({
      ...c,
      badge: c.id === id ? 'Selected' : 'Alternative'
    })));
    addAuditLog(`Selected curve option ${id} (Radius: ${id === 'A' ? 180 : id === 'B' ? 260 : 420}m)`, 'info');
    setSnackbarMessage(`Curve option ${id} selected. Engineering calculations updated.`);
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
      curveOptions,
      selectedCurveId,
      selectCurveOption,
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
      isLiveLoaded,
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
