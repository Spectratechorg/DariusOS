const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

export type HealthResponse = {
  status: string
  version: string
  environment: string
  engineer_disclaimer: string
  rules_sha256: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`)
  if (!response.ok) {
    throw new Error(`Backend health check failed with status ${response.status}`)
  }
  return response.json() as Promise<HealthResponse>
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

const TOKEN_KEY = 'dariusos_token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  // Let the browser set the multipart boundary for FormData
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  if (response.status === 401) setToken(null)
  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch { /* ignore */ }
    throw new Error(detail || `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}


export type QualityReport = {
  verdict: 'PASSED' | 'PASSED_WITH_WARNINGS' | 'REJECTED'
  total_raw_points: number
  valid_points: number
  duplicate_count: number
  blank_or_nan_count: number
  spikes_count: number
  holes_count: number
  density_pts_m2: number
  bounds: { min_x: number; max_x: number; min_y: number; max_y: number; min_z: number; max_z: number }
  crs_epsg: number | null
  warnings: string[]
  errors: string[]
  summary_text: string
}

export type SurveyUploadResponse = {
  file_id: string; project_id: string; original_filename: string; file_format: string
  sha256_hash: string; file_size_bytes: number
  status: 'PENDING' | 'VALIDATED' | 'REJECTED'
  quality_report: QualityReport | null
  plain_language_summary: string
}

export function createProject(name: string, description?: string): Promise<ProjectSummary> {
  return fetchJson<ProjectSummary>('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })
}

export function uploadSurvey(projectId: string, file: File, crsEpsg: number): Promise<SurveyUploadResponse> {
  const form = new FormData()
  form.append('file', file)
  form.append('crs_epsg', String(crsEpsg))
  return fetchJson<SurveyUploadResponse>(`/projects/${encodeURIComponent(projectId)}/surveys`, {
    method: 'POST',
    body: form,
  })
}

export function fetchSurveyReport(surveyId: string) {
  return fetchJson<{ survey_id: string; status: string; quality_report: QualityReport }>(
    `/surveys/${encodeURIComponent(surveyId)}/report`,
  )
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

export { API_BASE_URL }

export type SurveySummary = {
  id: string; original_filename: string; file_format: string; sha256_hash: string
  file_size_bytes: number; point_count: number | null; density_pts_m2: number | null
  status: 'PENDING' | 'VALIDATED' | 'REJECTED'; uploaded_at: string
}

export function fetchSurveys(projectId: string): Promise<SurveySummary[]> {
  return fetchJson<SurveySummary[]>(`/projects/${encodeURIComponent(projectId)}/surveys`)
}

export type TerrainSummaryResponse = {
  surveyPointsUsed: number
  tinTriangles: number
  lowestGroundM: number
  highestGroundM: number
  meanSlopePercent: number
  classification: string
  slopeDistribution: Array<{ label: string; percentage: number }>
  engineer_disclaimer: string
}

export function fetchTerrainSummary(runId: string): Promise<TerrainSummaryResponse> {
  return fetchJson<TerrainSummaryResponse>(`/runs/${encodeURIComponent(runId)}/terrain`)
}