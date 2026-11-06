import type { BemeCategory, TerrainSummary } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

export type HealthResponse = {
  status: string
  version: string
  environment: string
  engineer_disclaimer: string
  rules_sha256: string
  neon?: {
    connected: boolean
    provider: string
    configured: boolean
    latency_ms: number | null
    database: string | null
    error: string | null
  }
  database?: {
    status?: string
    engine?: string
    is_neon?: boolean
    latency_ms?: number | null
    connected?: boolean
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { headers })
    if (response.ok) {
      return (await response.json()) as HealthResponse
    }
  } catch (e) {
    // Continue to fallback
  }

  try {
    const fallback = await fetch('/api/health', { headers })
    if (fallback.ok) {
      return (await fallback.json()) as HealthResponse
    }
  } catch (e) {
    // Throw below
  }

  throw new Error('Backend health check failed')
}

export type ProjectSummary = {
  id: string
  name: string
  description: string | null
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export type ProjectDetail = ProjectSummary & {
  surveys: Array<{
    id: string
    original_filename: string
    file_format: string
    sha256_hash: string
    file_size_bytes: number
    point_count: number | null
    density_pts_m2: number | null
    status: string
    uploaded_at: string
  }>
  runs: Array<{
    id: string
    survey_file_id: string
    status: string
    execution_duration_sec: number | null
    total_road_length_m: number | null
    total_cut_volume_m3: number | null
    total_fill_volume_m3: number | null
    net_volume_m3: number | null
    created_at: string
    completed_at: string | null
  }>
}

export interface BemeResponse {
  project_title: string
  currency: string
  engineer_disclaimer: string
  grand_total: number
  categories: BemeCategory[]
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) || {}),
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    })
    if (response.ok) {
      return (await response.json()) as T
    }
  } catch (e) {
    // Continue to fallback
  }

  // Fallback to /api prefix if /api/v1 wasn't mapped
  try {
    const fallbackPath = path.startsWith('/v1') ? `/api${path}` : `/api${path.startsWith('/') ? '' : '/'}${path}`
    const fallbackResponse = await fetch(fallbackPath, {
      ...init,
      headers,
    })
    if (fallbackResponse.ok) {
      return (await fallbackResponse.json()) as T
    }
  } catch (e) {
    // Throw below
  }

  throw new Error(`Backend request failed for ${path}`)
}

export function fetchProjects(): Promise<ProjectSummary[]> {
  return fetchJson<ProjectSummary[]>('/projects')
}

export function fetchProjectDetail(projectId: string): Promise<ProjectDetail> {
  return fetchJson<ProjectDetail>(`/projects/${encodeURIComponent(projectId)}`)
}

export type EngineeringResult = Record<string, unknown>

export function fetchRunResult(runId: string, result: 'alignment' | 'profile' | 'sections' | 'quantities'): Promise<EngineeringResult> {
  return fetchJson<EngineeringResult>(`/runs/${encodeURIComponent(runId)}/${result}`)
}

export function fetchRunBeme(runId: string): Promise<BemeResponse> {
  return fetchJson<BemeResponse>(`/runs/${encodeURIComponent(runId)}/beme`)
}

export function fetchRunTerrain(runId: string): Promise<TerrainSummary> {
  return fetchJson<TerrainSummary>(`/runs/${encodeURIComponent(runId)}/terrain`)
}

export async function uploadSurveyToBackend(projectId: string, file: File): Promise<Record<string, unknown>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const formData = new FormData()
  formData.append('file', file)
  formData.append('crs_epsg', '32632')

  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/surveys`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Survey upload failed with status ${response.status}`)
  }
  return response.json()
}

// ---------------------------------------------------------------------------
// Engineering results (typed)
// ---------------------------------------------------------------------------
export type AlignmentPoint = {
  station_m: number; x: number; y: number; bearing_deg: number; ground_z: number;
  segment_type: 'TANGENT' | 'CIRCULAR_CURVE'; tangent_dx: number; tangent_dy: number;
}
export type AlignmentCurve = {
  curve_id: number; pi_x: number; pi_y: number; pc_station_m: number; pt_station_m: number;
  radius_m: number; deflection_angle_deg: number; tangent_length_m: number; arc_length_m: number;
}
export type AlignmentPackage = {
  start_point: [number, number]; end_point: [number, number]; total_length_m: number;
  station_interval_m: number; design_speed_kph: number; min_radius_m: number;
  max_allowable_ground_grade_percent: number; max_detected_ground_grade_percent: number;
  is_grade_compliant: boolean; curves: AlignmentCurve[]; stations: AlignmentPoint[]; summary_text: string;
}
export type ProfilePoint = {
  station_m: number; ground_elevation_m: number; design_elevation_m: number; difference_m: number;
  cut_or_fill: 'CUT' | 'FILL' | 'AT_GRADE'; grade_percent: number; curve_type: 'CREST' | 'SAG' | 'TANGENT';
}
export type ProfilePackage = {
  total_length_m: number; station_interval_m: number; min_allowable_grade_percent: number;
  max_allowable_grade_percent: number; max_detected_design_grade_percent: number;
  max_cut_depth_m: number; max_fill_depth_m: number; mean_cut_depth_m: number; mean_fill_depth_m: number;
  is_grade_compliant: boolean; profile_points: ProfilePoint[]; summary_text: string;
}
export type OffsetPoint = { offset_m: number; elevation_m: number }
export type CrossSectionSlice = {
  station_m: number; centreline_x: number; centreline_y: number; centreline_bearing_deg: number;
  ground_z: number; design_z: number; difference_m: number;
  section_class: 'CUT' | 'FILL' | 'TRANSITION' | 'AT_GRADE';
  cut_area_m2: number; fill_area_m2: number; topsoil_strip_width_m: number;
  left_daylight_offset_m: number; right_daylight_offset_m: number;
  ground_profile: OffsetPoint[]; design_template: OffsetPoint[];
}
export type CrossSectionPackage = {
  total_sections: number; interval_m: number; carriageway_width_m: number; shoulder_width_m: number;
  camber_slope_percent: number; cut_slope_v_to_h: number; fill_slope_v_to_h: number;
  sections: CrossSectionSlice[]; total_cut_area_sum_m2: number; total_fill_area_sum_m2: number; summary_text: string;
}
export type EarthworkInterval = {
  interval_id: number; from_station_m: number; to_station_m: number; distance_m: number;
  incremental_cut_m3: number; incremental_fill_m3: number;
  cumulative_cut_m3: number; cumulative_fill_m3: number; net_cumulative_m3: number;
}
export type QuantitiesPackage = {
  total_cut_volume_m3: number; total_fill_volume_m3: number; factored_fill_volume_m3: number;
  total_topsoil_strip_volume_m3: number; net_volume_m3: number;
  balance_status: 'EXCESS_CUT' | 'EXCESS_FILL' | 'BALANCED';
  intervals: EarthworkInterval[]; summary_text: string;
}

export type PipelineRunPayload = {
  survey_file_id: string;
  start_point: [number, number];
  end_point: [number, number];
  intermediate_pis?: Array<[number, number]>;
  target_elevation_offset_m?: number;
  station_interval_m?: number;
  force_recompute?: boolean;
}

export type PipelineRunResponse = {
  run_id: string;
  status: string;
  execution_duration_sec?: number | null;
  summary: {
    total_length_m: number;
    total_cut_volume_m3: number;
    total_fill_volume_m3: number;
    net_volume_m3: number;
    balance_status: string;
  };
}

export function triggerPipelineRun(projectId: string, payload: PipelineRunPayload): Promise<PipelineRunResponse> {
  return fetchJson<PipelineRunResponse>(`/projects/${encodeURIComponent(projectId)}/runs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export type UploadSummary = {
  file_id: string;
  project_id: string;
  original_filename: string;
  file_format: string;
  sha256_hash: string;
  file_size_bytes: number;
  status: string;
  plain_language_summary?: string;
  quality_report?: {
    verdict?: string;
    total_raw_points?: number;
    valid_points?: number;
    duplicate_count?: number;
    spikes_count?: number;
    holes_count?: number;
    blank_or_nan_count?: number;
    density_pts_m2?: number;
    crs_epsg?: number;
    summary_text?: string;
    errors?: string[];
    warnings?: string[];
  };
}

export async function uploadSurveyWithReport(
  projectId: string,
  file: File,
  crsEpsg: number = 32632
): Promise<UploadSummary> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const formData = new FormData()
  formData.append('file', file)
  formData.append('crs_epsg', String(crsEpsg))
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectId)}/surveys`, {
    method: 'POST',
    headers,
    body: formData,
  })
  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = typeof body?.detail === 'string' ? body.detail : JSON.stringify(body?.detail ?? body)
    } catch { /* ignore */ }
    throw new Error(detail || `Survey upload failed (${response.status})`)
  }
  return (await response.json()) as UploadSummary
}

export async function downloadRunExport(runId: string, kind: 'beme' | 'pilot-report'): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await fetch(`${API_BASE_URL}/runs/${encodeURIComponent(runId)}/export/${kind}`, { headers })
  if (!response.ok) {
    throw new Error(`Export failed (${response.status})`)
  }
  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const match = /filename="?([^";]+)"?/i.exec(disposition)
  const fallback = kind === 'beme' ? `BEME_${runId.slice(0, 8)}.xlsx` : `PilotReport_${runId.slice(0, 8)}.pdf`
  const filename = match?.[1] || fallback
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export { API_BASE_URL }
