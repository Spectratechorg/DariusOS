const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

export type HealthResponse = {
  status: string
  version: string
  environment: string
  engineer_disclaimer: string
  rules_sha256: string
}

export type ProjectResponse = {
  id: string
  name: string
  description?: string | null
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export type SurveyUploadResponse = {
  file_id: string
  project_id: string
  original_filename: string
  file_format: string
  sha256_hash: string
  file_size_bytes: number
  status: string
  quality_report: Record<string, unknown>
  plain_language_summary: string
}

function authHeaders(): HeadersInit {
  const token = sessionStorage.getItem('dariusos_access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) },
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Backend request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function fetchHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health')
}

export function createProject(name: string, description?: string): Promise<ProjectResponse> {
  return request<ProjectResponse>('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  })
}

export function uploadSurvey(projectId: string, file: File, crsEpsg = 32632): Promise<SurveyUploadResponse> {
  const body = new FormData()
  body.append('file', file)
  body.append('crs_epsg', String(crsEpsg))
  return request<SurveyUploadResponse>(`/projects/${projectId}/surveys`, { method: 'POST', body })
}

export { API_BASE_URL }
