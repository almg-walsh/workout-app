import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppRoutes from './routes';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  // Optional: dark mode toggle at the app level
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#90caf9' },
      background: {
        default: mode === 'dark' ? '#181a1b' : '#fafafa',
        paper: mode === 'dark' ? '#23272a' : '#fff',
      },
    },
    shape: { borderRadius: 16 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navigation */}
      <Box
        component="nav"
        sx={{
          width: '100vw',
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          component={Link}
          to="/workout-app"
          variant="text"
          color="primary"
          sx={{ mr: 2, fontSize: '45px' }}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/workout-app/calculator"
          variant="text"
          color="primary"
          sx={{ mr: 2, fontSize: '45px' }}
        >
          Calculator
        </Button>
      </Box>
      {/* Main content area */}
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          px: { xs: 0, sm: 2 },
          py: { xs: 1, sm: 2 },
          bgcolor: 'background.default',
        }}
      >
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;
