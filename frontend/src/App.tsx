import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { theme } from './theme';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StepperBar } from './components/StepperBar';
import { EngineerBanner } from './components/EngineerBanner';
import { ROUTES } from './routes';
import { LoginPage } from './pages/LoginPage';
import { UploadPage } from './pages/UploadPage';
import { ProjectPage } from './pages/ProjectPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OverviewView } from './views/OverviewView';
import { ProjectSetupView } from './views/ProjectSetupView';
import { SurveyValidationView } from './views/SurveyValidationView';
import { TerrainView } from './views/TerrainView';
import { AiReasoningView } from './views/AiReasoningView';
import { DesignEngineView } from './views/DesignEngineView';
import { DrawingsView } from './views/DrawingsView';
import { BemeReportView } from './views/BemeReportView';
import { RoutesMonitoringView } from './views/RoutesMonitoringView';

const MainLayout: React.FC = () => {
  const { activeStage, snackbarMessage, setSnackbarMessage } = useProject();
  const views = { overview: <OverviewView />, setup: <ProjectSetupView />, survey: <SurveyValidationView />, terrain: <TerrainView />, reasoning: <AiReasoningView />, design: <DesignEngineView />, drawings: <DrawingsView />, beme: <BemeReportView />, monitoring: <RoutesMonitoringView /> } as const;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#0B0F19' }}>
      <EngineerBanner />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
          <TopBar />
          <StepperBar />
          <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: '#0B0F19' }}>{views[activeStage as keyof typeof views] ?? <OverviewView />}</Box>
        </Box>
      </Box>
      <Snackbar open={Boolean(snackbarMessage)} autoHideDuration={4000} onClose={() => setSnackbarMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarMessage(null)} severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.upload} element={<UploadPage />} />
        <Route path={ROUTES.project} element={<ProjectPage />} />
        <Route path={ROUTES.workspace} element={<ProjectProvider><MainLayout /></ProjectProvider>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
