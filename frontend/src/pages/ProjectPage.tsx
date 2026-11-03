import React from 'react'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { ROUTES } from '../routes'

export const ProjectPage: React.FC = () => <PlaceholderPage title="Project" path={ROUTES.project} description="Project details go here. Backend endpoints: GET /projects and GET /projects/{project_id}." />
export default ProjectPage
