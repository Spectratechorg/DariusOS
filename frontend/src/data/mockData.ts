import type {
  AsBuiltComparisonRow,
  BemeCategory,
  CurveOption,
  DesignValidationIssue,
  EngineerWarning,
  ProjectData,
  RouteOption,
  SurveyPointRow,
  TerrainSummary,
  ValidationCheckItem,
} from '../types';

export const INITIAL_PROJECT_DATA: ProjectData = {
  projectName: 'North Ridge Access Road', client: 'Spectra Infrastructure', projectLocation: 'North Ridge, Sector 4', projectType: 'Rural access road', roadClassification: 'Class III', applicableStandard: 'AASHTO 2018', carriagewayWidthM: 7.0, shoulderWidthM: 1.5, subBaseThicknessMm: 200, baseCourseThicknessMm: 150, asphaltWearingCourseMm: 50, drainageRequirement: 'Cross-drainage at low points', constraints: 'Steep terrain and protected wetland boundary',
};

export const MOCK_SURVEY_POINTS: SurveyPointRow[] = [
  { pointId: 'SP-001', easting: 482130.2, northing: 5210840.6, elevation: 184.2, description: 'Control point', checkStatus: 'OK' },
  { pointId: 'SP-002', easting: 482188.7, northing: 5210901.4, elevation: 185.1, description: 'Centerline', checkStatus: 'OK' },
  { pointId: 'SP-003', easting: 482241.3, northing: 5210966.8, elevation: 186.4, description: 'Drainage inlet', checkStatus: 'Unusual level' },
];
export const MOCK_SURVEY_WARNINGS: EngineerWarning[] = [{ id: 'w1', title: 'Unusual level at SP-003', detail: 'Review against adjacent shots.', isAcknowledged: false }];
export const MOCK_VALIDATION_CHECKS: ValidationCheckItem[] = [
  { id: 'v1', name: 'Coordinate system', status: 'Pass' }, { id: 'v2', name: 'Duplicate points', status: 'Warning', warningCount: 1 }, { id: 'v3', name: 'Elevation range', status: 'Pass' },
];
export const MOCK_TERRAIN_SUMMARY: TerrainSummary = { surveyPointsUsed: 1248, tinTriangles: 2386, lowestGroundM: 182.4, highestGroundM: 214.8, meanSlopePercent: 6.8, classification: 'Rolling', slopeDistribution: [{ label: '0–3%', percentage: 24 }, { label: '3–6%', percentage: 38 }, { label: '6–10%', percentage: 26 }, { label: '>10%', percentage: 12 }] };
export const MOCK_CURVE_OPTIONS: CurveOption[] = [
  { id: 'A', radiusM: 180, title: 'Tighter curve', badge: 'Alternative', description: 'Minimizes earthworks.', cutM3: 3820, fillM3: 2960 },
  { id: 'B', radiusM: 260, title: 'Balanced alignment', badge: 'Selected', description: 'Best balance of safety and cost.', cutM3: 4210, fillM3: 3180 },
  { id: 'C', radiusM: 420, title: 'Long radius', badge: 'Alternative', description: 'Improves comfort and sight distance.', cutM3: 4980, fillM3: 3650 },
];
export const MOCK_DESIGN_ISSUES: DesignValidationIssue[] = [{ id: 'd1', title: 'Gradient review at Ch 1+840', severity: 'Review required', description: 'Gradient exceeds the preferred threshold.', isAccepted: false }];
export const MOCK_BEME_CATEGORIES: BemeCategory[] = [{ categoryCode: 'R01', categoryName: 'Earthworks', items: [{ code: 'R01.01', description: 'Common excavation', unit: 'm³', quantity: 4210, unitRate: 18, amount: 75780 }], subtotal: 75780 }];
export const MOCK_AS_BUILT_ROWS: AsBuiltComparisonRow[] = [{ chainage: '0+500', approvedM: 184.2, asBuiltM: 184.4, deviationM: 0.2, status: 'Within tolerance' }, { chainage: '1+000', approvedM: 188.6, asBuiltM: 189.4, deviationM: 0.8, status: 'Watch' }, { chainage: '1+500', approvedM: 194.1, asBuiltM: 195.5, deviationM: 1.4, status: 'Flagged' }];
export const MOCK_ROUTE_OPTIONS: RouteOption[] = [
  { id: 'route-a', name: 'Route A', badge: 'Alternative', distanceKm: 4.8, estCostM: 2.4, cutM3: 4120, fillM3: 2980 },
  { id: 'route-b', name: 'Route B', badge: 'Selected', distanceKm: 5.2, estCostM: 2.7, cutM3: 4210, fillM3: 3180 },
  { id: 'route-c', name: 'Route C', badge: 'Alternative', distanceKm: 5.9, estCostM: 3.1, cutM3: 4980, fillM3: 3650 },
];
export const MOCK_GRADIENT_SEGMENTS: { chainage: string; gradient: string; result: 'Pass' | 'Review required' }[] = [{ chainage: '0+000 – 0+920', gradient: '+2.8%', result: 'Pass' }, { chainage: '0+920 – 1+840', gradient: '+5.2%', result: 'Review required' }, { chainage: '1+840 – 2+700', gradient: '-3.1%', result: 'Pass' }];
export const MOCK_AUDIT_TRAIL: { title: string; time: string; type: 'approval' | 'warning' | 'info' }[] = [{ title: 'Route B selected for design', time: 'Today, 10:42', type: 'approval' }, { title: 'Gradient review requested', time: 'Today, 09:18', type: 'warning' }, { title: 'Survey dataset processed', time: 'Yesterday, 16:05', type: 'info' }];
