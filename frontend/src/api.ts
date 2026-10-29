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

export { API_BASE_URL }
