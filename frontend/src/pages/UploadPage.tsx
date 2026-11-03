import React from 'react'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { ROUTES } from '../routes'

export const UploadPage: React.FC = () => <PlaceholderPage title="Upload survey" path={ROUTES.upload} description="Survey file upload goes here. Backend endpoint: POST /projects/{project_id}/surveys (CSV, XYZ, LAS, LAZ)." />
export default UploadPage
