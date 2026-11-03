export const ROUTES = {
  login: '/login',
  upload: '/upload',
  project: '/project',
  workspace: '/workspace',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
