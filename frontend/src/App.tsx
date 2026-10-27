import React from 'react';
import { Box, ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { theme } from './theme';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#0B0F19' }}>
      {/* Top Persistent Mandatory Registered Engineer Banner */}
      <EngineerBanner />

      {/* Main Workspace Frame */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Center Main Stage Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
          <TopBar />
          <StepperBar />
          <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: '#0B0F19' }}>
            {renderActiveView()}
          </Box>
        </Box>
      </Box>

      {/* Interactive Action Toast Notification */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarMessage(null)}
          severity="success"
          sx={{
            backgroundColor: '#0F1E38',
            color: '#38BDF8',
            border: '1px solid #1E3A8A',
            '& .MuiAlert-icon': { color: '#38BDF8' },
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
