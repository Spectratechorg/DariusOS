import React from 'react'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../routes'

interface PlaceholderPageProps {
  title: string
  path: string
  description: string
}

const NAV_LINKS = [
  { label: 'Login', to: ROUTES.login },
  { label: 'Upload', to: ROUTES.upload },
  { label: 'Project', to: ROUTES.project },
  { label: 'Workspace (mock)', to: ROUTES.workspace },
]

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, path, description }) => (
  <Box component="main" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, bgcolor: 'background.default' }}>
    <Paper sx={{ width: '100%', maxWidth: 560, p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Chip label="Empty page · screen not built yet" size="small" color="warning" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
        <Typography component="h1" variant="h5">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
        <Typography variant="body2" sx={{ fontFamily: "'JetBrains Mono', monospace" }}>Route: {path}</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} component="nav" aria-label="Scaffold routes">
          {NAV_LINKS.map((link) => (
            <Button key={link.to} component={RouterLink} to={link.to} size="small" variant={link.to === path ? 'contained' : 'outlined'} sx={{ minHeight: 44 }}>
              {link.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Paper>
  </Box>
)
