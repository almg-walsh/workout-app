import React, { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  CardContent,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  StyledCard,
  VideoWrapper,
  RepsContainer,
  MobileTextField,
  MobileButton,
  StyledButton,
} from './WorkoutComponent.styles';
import { workoutData } from './WorkoutData';

// --- Types ---
type SetEntry = { reps: string; weight: string };
type ExerciseLog = { name: string; sets: SetEntry[] };
type WorkoutLog = { [day: string]: ExerciseLog[] };

// --- Helper: Always sync log with workoutData ---
// Initialize each exercise with its default number of sets if not present
function getSyncedLog(): WorkoutLog {
  const stored = localStorage.getItem('workoutLog');
  let log: WorkoutLog = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) log = parsed;
    } catch {}
  }
  // Ensure every day and every exercise exists in the log
  const syncedLog: WorkoutLog = {};
  Object.entries(workoutData).forEach(([day, exercises]) => {
    syncedLog[day] = exercises.map((ex) => {
      const existing = log[day]?.find((e: ExerciseLog) => e.name === ex.name);
      return existing
        ? { ...existing, sets: Array.isArray(existing.sets) ? existing.sets : [] }
        : {
            name: ex.name,
            sets: Array.from({ length: ex.defaultSets }, () => ({ reps: '', weight: '' })),
          };
    });
  });
  return syncedLog;
}

// --- Timer Component ---
const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(120);
  const [running, setRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (running && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0 && running) {
      setRunning(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, seconds]);

  const startTimer = () => {
    setSeconds(120);
    setRunning(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <Typography sx={{ fontSize: 24, fontWeight: 500 }}>
        Rest Timer: {formatTime(seconds)}
      </Typography>
      <Button variant="outlined" onClick={startTimer} disabled={running}>
        Start 2-min Timer
      </Button>
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2023/09/06/audio_9156365c45.mp3"
        preload="auto"
      />
    </Box>
  );
};

// --- Wake Lock Hook ---
function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    let isActive = true;
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator && isActive) {
          // @ts-ignore
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        // Wake Lock request failed - ignore or show a message if you want
      }
    }
    requestWakeLock();

    // Re-activate on visibility change (e.g. after unlocking phone)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isActive = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);
}

// --- Main Component ---
function WorkoutLoggerInner() {
  useWakeLock(); // <-- Add this line at the top

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tab, setTab] = useState('day1');
  const [log, setLog] = useState<WorkoutLog>(getSyncedLog);
  const [addingSet, setAddingSet] = useState<{
    [exercise: string]: { reps: string; weight: string };
  }>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('workoutLog', JSON.stringify(log));
  }, [log]);

  // Show input fields for adding a set to an exercise
  const handleAddSetClick = (exercise: string) => {
    setAddingSet((prev) => ({
      ...prev,
      [exercise]: { reps: '', weight: '' },
    }));
  };

  // Update input values for the set being added
  const handleSetInputChange = (exercise: string, field: 'reps' | 'weight', value: string) => {
    setAddingSet((prev) => ({
      ...prev,
      [exercise]: { ...prev[exercise], [field]: value },
    }));
  };

  // Save the new set to the log and clear the input fields
  const handleSaveSet = (day: string, exercise: string) => {
    const { reps, weight } = addingSet[exercise];
    if (!reps || !weight) return;
    setLog((prev) => ({
      ...prev,
      [day]: prev[day].map((ex) =>
        ex.name === exercise ? { ...ex, sets: [...ex.sets, { reps, weight }] } : ex,
      ),
    }));
    setAddingSet((prev) => {
      const newState = { ...prev };
      delete newState[exercise];
      return newState;
    });
  };

  // Update an existing set's reps or weight
  const updateSet = (
    day: string,
    name: string,
    index: number,
    field: 'reps' | 'weight',
    value: string,
  ) => {
    setLog((prev) => ({
      ...prev,
      [day]: prev[day].map((ex) =>
        ex.name === name
          ? {
              ...ex,
              sets: ex.sets.map((set, i) => (i === index ? { ...set, [field]: value } : set)),
            }
          : ex,
      ),
    }));
  };

  // Remove a set from an exercise
  const removeSet = (day: string, name: string, index: number) => {
    setLog((prev) => ({
      ...prev,
      [day]: prev[day].map((ex) =>
        ex.name === name ? { ...ex, sets: ex.sets.filter((_, i) => i !== index) } : ex,
      ),
    }));
  };

  // Day labels for menu
  const dayLabels = [
    { label: 'Day 1', value: 'day1' },
    { label: 'Day 2', value: 'day2' },
    { label: 'Day 3', value: 'day3' },
    { label: 'Day 4', value: 'day4' },
  ];

  // Responsive: show hamburger on mobile, tabs on desktop
  return (
    <Box sx={{ padding: 1 }}>
      {/* Drawer for mobile day selection */}
      {isMobile && (
        <Box sx={{ paddingLeft: 1 }}>
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 220 }}>
              <List>
                {dayLabels.map((d) => (
                  <ListItem key={d.value} disablePadding>
                    <ListItemButton
                      selected={tab === d.value}
                      onClick={() => {
                        setTab(d.value);
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: 28, fontWeight: 600 }}>{d.label}</Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          {/* Hamburger icon for mobile */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Typography sx={{ fontSize: 28, fontWeight: 600 }}>
              {dayLabels.find((d) => d.value === tab)?.label}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Tabs for desktop only */}
      {!isMobile && (
        <Tabs
          value={tab}
          onChange={(_, newVal) => setTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              fontSize: '18px',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: '56px',
            },
          }}
        >
          {dayLabels.map((d) => (
            <Tab key={d.value} label={d.label} value={d.value} />
          ))}
        </Tabs>
      )}

      <Box sx={{ p: { xs: 1, sm: 0 }, paddingLeft: 3 }}>
        {workoutData[tab].map(({ name, url }) => {
          const exerciseLog = log[tab].find((ex) => ex.name === name);
          const sets = exerciseLog ? exerciseLog.sets : [];
          const isAdding = !!addingSet[name];
          return (
            <StyledCard key={name} elevation={2}>
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '18px', sm: '18px' },
                  }}
                >
                  {name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: { xs: '18px', sm: '18px' },
                    color: 'rgba(180,180,180,0.7)',
                    mb: 1,
                  }}
                >
                  Target Reps: {workoutData[tab].find((ex) => ex.name === name)?.baseReps}
                </Typography>
                <Timer />
                <VideoWrapper>
                  <iframe
                    src={url.replace('watch?v=', 'embed/')}
                    title={name}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </VideoWrapper>

                {/* List all sets for this exercise */}

                {sets.map((set, index) => (
                  <RepsContainer key={index}>
                    <MobileTextField
                      type="number"
                      label={`Reps #${index + 1}`}
                      value={set.reps}
                      onChange={(e) => updateSet(tab, name, index, 'reps', e.target.value)}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      sx={{ fontSize: { xs: '18px', sm: '18px' } }}
                    />
                    <MobileTextField
                      type="number"
                      label={`Weight #${index + 1}`}
                      value={set.weight}
                      onChange={(e) => updateSet(tab, name, index, 'weight', e.target.value)}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      sx={{ fontSize: { xs: '18px', sm: '18px' } }}
                    />
                    <IconButton
                      onClick={() => removeSet(tab, name, index)}
                      size={isMobile ? 'medium' : 'small'}
                      sx={{
                        ml: 1,
                      }}
                      aria-label="Delete set"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </RepsContainer>
                ))}

                {/* Add set input fields or Add Set button */}
                {isAdding ? (
                  <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={1}
                    mt={1}
                    alignItems="center"
                  >
                    <MobileTextField
                      type="number"
                      label="Reps"
                      value={addingSet[name]?.reps || ''}
                      onChange={(e) => handleSetInputChange(name, 'reps', e.target.value)}
                      fullWidth
                      autoFocus
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      sx={{ fontSize: { xs: '18px', sm: '18px' } }}
                    />
                    <MobileTextField
                      type="number"
                      label="Weight"
                      value={addingSet[name]?.weight || ''}
                      onChange={(e) => handleSetInputChange(name, 'weight', e.target.value)}
                      fullWidth
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      sx={{ fontSize: { xs: '18px', sm: '18px' } }}
                    />
                    <MobileButton
                      onClick={() => handleSaveSet(tab, name)}
                      variant="contained"
                      disabled={!addingSet[name]?.reps || !addingSet[name]?.weight}
                    >
                      Save
                    </MobileButton>
                  </Box>
                ) : (
                  <MobileButton onClick={() => handleAddSetClick(name)} variant="outlined">
                    Add Set
                  </MobileButton>
                )}
              </CardContent>
            </StyledCard>
          );
        })}
        <StyledButton variant="contained" onClick={() => setModalOpen(true)}>
          Complete Training
        </StyledButton>
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Workout Saved!</DialogTitle>
          <DialogContent>
            <Typography>Your workout has been saved successfully.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

// --- Dark Mode Theme Wrapper ---
export default function WorkoutLogger() {
  // Toggle this to 'light' for light mode
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
      {/* Optional: Add a toggle button for dark/light mode */}

      <WorkoutLoggerInner />
    </ThemeProvider>
  );
}
