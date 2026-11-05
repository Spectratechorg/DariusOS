import type { BemeCategory, TerrainSummary } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

export type HealthResponse = {
  status: string
  version: string
  environment: string
  engineer_disclaimer: string
  rules_sha256: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const response = await fetch(`${API_BASE_URL}/health`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })
  if (!response.ok) {
    throw new Error(`Backend request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
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

export { API_BASE_URL }
