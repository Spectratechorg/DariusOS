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
  projectName: 'Lifidi - Piapung Road Corridor (19.50km)',
  client: 'Mastodon Engineering Services / Spectra Tech',
  projectLocation: 'Lifidi - Piapung Corridor',
  projectType: 'Rural arterial corridor',
  roadClassification: 'Class II Arterial',
  applicableStandard: 'FMW&H / AASHTO 2018',
  carriagewayWidthM: 7.0,
  shoulderWidthM: 1.5,
  subBaseThicknessMm: 200,
  baseCourseThicknessMm: 150,
  asphaltWearingCourseMm: 50,
  drainageRequirement: 'Side ditches and precast box/pipe culverts at low points',
  constraints: 'Rolling terrain, seasonal drainage crossings, and corridor offset limits',
};

export const MOCK_SURVEY_POINTS: SurveyPointRow[] = [
  { pointId: 'SP-001', easting: 482130.2, northing: 5210840.6, elevation: 300.2, description: 'Control point CP-01', checkStatus: 'OK' },
  { pointId: 'SP-002', easting: 482188.7, northing: 5210901.4, elevation: 301.1, description: 'Centerline CL', checkStatus: 'OK' },
  { pointId: 'SP-003', easting: 482241.3, northing: 5210966.8, elevation: 302.4, description: 'Culvert inlet CW', checkStatus: 'Unusual level' },
];

export const MOCK_SURVEY_WARNINGS: EngineerWarning[] = [
  { id: 'w1', title: 'Unusual level at SP-003', detail: 'Review against adjacent shots in terrain corridor.', isAcknowledged: false },
  { id: 'w2', title: 'Vegetation boundary proximity', detail: 'Edge clearance requires physical field verification.', isAcknowledged: false },
  { id: 'w3', title: 'Culvert invert depth tolerance', detail: 'Minimum 0.60m cover over pipe crown required.', isAcknowledged: false },
];

export const MOCK_VALIDATION_CHECKS: ValidationCheckItem[] = [
  { id: 'v1', name: 'Coordinate system', status: 'Pass' },
  { id: 'v2', name: 'Duplicate points', status: 'Warning', warningCount: 1 },
  { id: 'v3', name: 'Elevation range', status: 'Pass' },
];

export const MOCK_TERRAIN_SUMMARY: TerrainSummary = {
  surveyPointsUsed: 287,
  tinTriangles: 545,
  lowestGroundM: 300.0,
  highestGroundM: 304.0,
  meanSlopePercent: 2.0,
  classification: 'Flat',
  slopeDistribution: [
    { label: '0–3%', percentage: 72 },
    { label: '3–6%', percentage: 20 },
    { label: '6–10%', percentage: 6 },
    { label: '>10%', percentage: 2 },
  ],
};

export const MOCK_CURVE_OPTIONS: CurveOption[] = [
  { id: 'A', radiusM: 180, title: 'Tighter curve', badge: 'Alternative', description: 'Minimizes excavation volumes.', cutM3: 126, fillM3: 0 },
  { id: 'B', radiusM: 260, title: 'Balanced alignment (Live DAG)', badge: 'Selected', description: 'Single source of truth computed directly by engineering pipeline.', cutM3: 138, fillM3: 0 },
  { id: 'C', radiusM: 420, title: 'Long radius', badge: 'Alternative', description: 'Improves high-speed comfort and stopping sight distance.', cutM3: 163, fillM3: 0 },
];

export const MOCK_DESIGN_ISSUES: DesignValidationIssue[] = [
  { id: 'd1', title: 'Gradient review at Ch 1+840', severity: 'Review required', description: 'Gradient exceeds the preferred threshold for heavy vehicles.', isAccepted: false },
];

export const MOCK_BEME_CATEGORIES: BemeCategory[] = [
  {
    categoryCode: 'BILL-01',
    categoryName: 'Site Clearance & Preliminary Works',
    items: [
      { code: '1.01', description: 'Site clearance and bush clearing along road corridor', unit: 'm²', quantity: 2475.5, unitRate: 750, amount: 1856625 },
      { code: '1.02', description: 'Corridor setting out, control pegging, and benchmark protection', unit: 'LS', quantity: 1, unitRate: 35000, amount: 35000 },
    ],
    subtotal: 1891625,
  },
  {
    categoryCode: 'BILL-02',
    categoryName: 'Earthworks & Roadbed Formation',
    items: [
      { code: '2.01', description: 'Roadway cut excavation in all types of material (excluding rock)', unit: 'm³', quantity: 138.2, unitRate: 6000, amount: 829200 },
      { code: '2.02', description: 'Compacted roadway fill to 95% MDD using approved borrow material', unit: 'm³', quantity: 0.0, unitRate: 7500, amount: 0 },
    ],
    subtotal: 829200,
  },
  {
    categoryCode: 'BILL-03',
    categoryName: 'Drainage & Culverts',
    items: [
      { code: '3.01', description: 'Excavation and lining of trapezoidal concrete side drains (600x600)', unit: 'm', quantity: 400.0, unitRate: 14500, amount: 5800000 },
      { code: '3.02', description: 'Standard 900mm diameter reinforced concrete pipe culvert with headwalls', unit: 'm', quantity: 24.0, unitRate: 42000, amount: 1008000 },
    ],
    subtotal: 6808000,
  },
  {
    categoryCode: 'BILL-04',
    categoryName: 'Pavement Courses & Surfacing',
    items: [
      { code: '4.01', description: 'Crushed stone base course 150mm thick compacted to 100% MDD', unit: 'm³', quantity: 260.0, unitRate: 18500, amount: 4810000 },
      { code: '4.02', description: 'Asphaltic concrete wearing course 50mm thick compacted', unit: 'm²', quantity: 1300.0, unitRate: 9200, amount: 11955000 },
    ],
    subtotal: 16765000,
  },
];

export const MOCK_AS_BUILT_ROWS: AsBuiltComparisonRow[] = [
  { chainage: '0+050', approvedM: 300.2, asBuiltM: 300.25, deviationM: 0.05, status: 'Within tolerance' },
  { chainage: '0+100', approvedM: 301.1, asBuiltM: 301.25, deviationM: 0.15, status: 'Within tolerance' },
  { chainage: '0+150', approvedM: 302.4, asBuiltM: 302.85, deviationM: 0.45, status: 'Watch' },
];

export const MOCK_ROUTE_OPTIONS: RouteOption[] = [
  { id: 'route-a', name: 'Route A (Northern bypass)', badge: 'Alternative', distanceKm: 19.8, estCostM: 27.8, cutM3: 152, fillM3: 12 },
  { id: 'route-b', name: 'Route B (Piapung Direct Corridor)', badge: 'Selected', distanceKm: 19.5, estCostM: 26.3, cutM3: 138, fillM3: 0 },
  { id: 'route-c', name: 'Route C (Southern ridge option)', badge: 'Alternative', distanceKm: 21.2, estCostM: 31.4, cutM3: 198, fillM3: 45 },
];

export const MOCK_GRADIENT_SEGMENTS: { chainage: string; gradient: string; result: 'Pass' | 'Review required' }[] = [
  { chainage: '0+000 – 0+080', gradient: '+1.8%', result: 'Pass' },
  { chainage: '0+080 – 0+160', gradient: '+2.1%', result: 'Pass' },
  { chainage: '0+160 – 0+200', gradient: '-0.9%', result: 'Pass' },
];

export const MOCK_AUDIT_TRAIL: { title: string; time: string; type: 'approval' | 'warning' | 'info' }[] = [
  { title: 'DAG Pipeline execution completed (Run 19790393)', time: 'Today, 11:12', type: 'approval' },
  { title: 'Terrain TIN surface generated (287 points, 545 triangles)', time: 'Today, 10:42', type: 'info' },
  { title: 'Survey intake validated (slope.csv SHA-256 e59c712d)', time: 'Today, 09:18', type: 'approval' },
  { title: 'Project corridor initiated (Lifidi - Piapung 19.50km)', time: 'Yesterday, 16:29', type: 'info' },
];
