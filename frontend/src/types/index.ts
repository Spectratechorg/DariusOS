export type StageId = 
  | 'overview'
  | 'setup'
  | 'survey'
  | 'terrain'
  | 'reasoning'
  | 'design'
  | 'drawings'
  | 'beme'
  | 'monitoring';

export type UserRole = 'Approver' | 'Reviewer' | 'Viewer';

export interface ProjectData {
  projectName: string;
  client: string;
  projectLocation: string;
  projectType: string;
  roadClassification: string;
  applicableStandard: string;
  carriagewayWidthM: number;
  shoulderWidthM: number;
  subBaseThicknessMm: number;
  baseCourseThicknessMm: number;
  asphaltWearingCourseMm: number;
  drainageRequirement: string;
  constraints: string;
}

export interface SurveyPointRow {
  pointId: string;
  easting: number;
  northing: number;
  elevation: number;
  description: string;
  checkStatus: 'OK' | 'Near duplicate' | 'Unusual level';
}

export interface EngineerWarning {
  id: string;
  title: string;
  detail: string;
  isAcknowledged: boolean;
}

export interface ValidationCheckItem {
  id: string;
  name: string;
  status: 'Pass' | 'Warning' | 'Fail';
  warningCount?: number;
}

export interface TerrainSummary {
  surveyPointsUsed: number;
  tinTriangles: number;
  lowestGroundM: number;
  highestGroundM: number;
  meanSlopePercent: number;
  classification: 'Flat' | 'Rolling' | 'Hilly' | 'Steep';
  slopeDistribution: {
    label: string;
    percentage: number;
  }[];
}

export interface CurveOption {
  id: 'A' | 'B' | 'C';
  radiusM: number;
  title: string;
  badge: 'Alternative' | 'Selected';
  description: string;
  cutM3: number;
  fillM3: number;
}

export interface DesignValidationIssue {
  id: string;
  title: string;
  severity: 'Review required' | 'Warning';
  description: string;
  isAccepted: boolean;
  engineerNote?: string;
}

export interface BemeRowItem {
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
}

export interface BemeCategory {
  categoryCode: string;
  categoryName: string;
  items: BemeRowItem[];
  subtotal: number;
}

export interface AsBuiltComparisonRow {
  chainage: string;
  approvedM: number;
  asBuiltM: number;
  deviationM: number;
  status: 'Within tolerance' | 'Watch' | 'Flagged';
}

export interface RouteOption {
  id: string;
  name: string;
  badge: 'Alternative' | 'Selected';
  distanceKm: number;
  estCostM: number;
  cutM3: number;
  fillM3: number;
}
