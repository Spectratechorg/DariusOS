import React from 'react';
import { Box, ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { theme, tokens } from './theme';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StepperBar } from './components/StepperBar';
import { EngineerBanner } from './components/EngineerBanner';

// Views
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

  const renderActiveView = () => {
    switch (activeStage) {
      case 'overview':
        return <OverviewView />;
      case 'setup':
        return <ProjectSetupView />;
      case 'survey':
        return <SurveyValidationView />;
      case 'terrain':
        return <TerrainView />;
      case 'reasoning':
        return <AiReasoningView />;
      case 'design':
        return <DesignEngineView />;
      case 'drawings':
        return <DrawingsView />;
      case 'beme':
        return <BemeReportView />;
      case 'monitoring':
        return <RoutesMonitoringView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: tokens.base,
      }}
    >
      <EngineerBanner />

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Sidebar />

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
          <TopBar />
          <StepperBar />
          <Box component="main" sx={{ flex: 1, overflowY: 'auto', backgroundColor: tokens.base }}>
            {renderActiveView()}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarMessage(null)}
          severity="info"
          variant="outlined"
          sx={{
            backgroundColor: '#141922',
            color: tokens.text,
            border: `1px solid ${tokens.lineStrong}`,
            boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
            '& .MuiAlert-icon': { color: tokens.accent },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProjectProvider>
        <MainLayout />
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;
