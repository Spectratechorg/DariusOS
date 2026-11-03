import React from 'react'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { ROUTES } from '../routes'

export const LoginPage: React.FC = () => <PlaceholderPage title="Login" path={ROUTES.login} description="Sign-in screen goes here. Backend endpoints: POST /auth/login and GET /auth/me." />
export default LoginPage
