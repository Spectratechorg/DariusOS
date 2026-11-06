import React, { useState } from 'react';
import { Box, Drawer, ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
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
import { DesignEngineView } from './views/DesignEngineView';
import { DrawingsView } from './views/DrawingsView';
import { BemeReportView } from './views/BemeReportView';

const MainLayout: React.FC = () => {
  const { activeStage, snackbarMessage, setSnackbarMessage } = useProject();
  const [navOpen, setNavOpen] = useState(false);

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
      case 'design':
        return <DesignEngineView />;
      case 'drawings':
        return <DrawingsView />;
      case 'beme':
        return <BemeReportView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', overflow: 'hidden', backgroundColor: '#0B0F19' }}>
      {/* Top Persistent Mandatory Registered Engineer Banner */}
      <EngineerBanner />

      {/* Main Workspace Frame */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Navigation Sidebar */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }}>
          <Sidebar />
        </Box>

        <Drawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' } }}
          slotProps={{
            paper: {
              sx: {
                width: 248,
                backgroundColor: '#0A0E17',
                backgroundImage: 'none',
                borderRight: '1px solid #1E293B',
              },
            },
          }}
        >
          <Sidebar onNavigate={() => setNavOpen(false)} />
        </Drawer>

        {/* Center Main Stage Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
          <TopBar onOpenNav={() => setNavOpen(true)} />
          <StepperBar />
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#0B0F19' }}>
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
