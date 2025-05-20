import React, { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// --- Types ---
type SetEntry = { reps: string; weight: string };
type ExerciseLog = { name: string; sets: SetEntry[] };
type WorkoutLog = { [day: string]: ExerciseLog[] };

// --- Data ---
// Add defaultSets and baseReps to each exercise
const workoutData: {
  [day: string]: { name: string; url: string; defaultSets: number; baseReps: string }[];
} = {
  day1: [
    {
      name: 'Smith machine incline bench press',
      url: 'https://www.youtube.com/watch?v=X4YsGnP4a-A',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Quad Focused Leg Press 2 Press',
      url: 'https://www.youtube.com/watch?v=O6Fr-819xbU',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Overhand Lat Pulldown',
      url: '  https://www.youtube.com/watch?v=zJWmGede-Zk',
      defaultSets: 4,
      baseReps: '8-12',
    },
    {
      name: 'Seated Hamstring Curl',
      url: '  https://www.youtube.com/watch?v=H6R1SNKhsiU',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Face away cable curls',
      url: '  https://www.youtube.com/watch?v=MhJfVKlYjWE',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'RP Cable Upright Row',
      url: '  https://www.youtube.com/watch?v=EyJ7bIYCq8g',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Machine Bent Leg Calf Raise',
      url: '  https://www.youtube.com/watch?v=nQlW0Nv8rK',
      defaultSets: 3,
      baseReps: '8-12',
    },
  ],
  day2: [
    {
      name: 'Smith machine flat bench press',
      url: 'https://www.youtube.com/watch?v=o9XidjeUGx4',
      defaultSets: 4,
      baseReps: '8-12',
    },
    {
      name: 'RDL',
      url: 'https://www.youtube.com/watch?v=EzjyxCfA9F4',
      defaultSets: 3,
      baseReps: '6-9',
    },
    {
      name: 'Upper back focused pin loaded machine row',
      url: 'https://www.youtube.com/watch?v=ow7YE1FXZbY',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Neutral Grip Lat Pull Down',
      url: 'https://www.youtube.com/watch?v=5Qv_XRJectI',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Seated smith machine shoulder press',
      url: 'https://www.youtube.com/watch?v=hOe67uR-iM8',
      defaultSets: 3,
      baseReps: '6-9',
    },
    {
      name: 'Leg Extensions',
      url: 'https://www.youtube.com/watch?v=Yrvhp8KL6VQ',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Katana tricep extensions',
      url: 'https://www.youtube.com/watch?v=J0NZ2SSfTds',
      defaultSets: 3,
      baseReps: '8-12',
    },
  ],
  day3: [
    {
      name: 'Elbow supported bicep curls',
      url: 'https://www.youtube.com/watch?v=mpwy3sRj7rk',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Tricep pushdown',
      url: 'https://www.youtube.com/watch?v=LBMjUKzQPPM',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Lying Hamstring Curl',
      url: 'https://www.youtube.com/watch?v=Db5TL45wp4k',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Flat Dumbell Bench Press',
      url: 'https://www.youtube.com/watch?v=6Idh48dxgpI',
      defaultSets: 4,
      baseReps: '8-12',
    },
    {
      name: 'Chest Supported Dumbell Row',
      url: 'https://www.youtube.com/watch?v=OTRM728_QM4',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Behind The Back Lateral Raise',
      url: 'https://www.youtube.com/watch?v=Nb_usIwWgyA',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Knee Raises',
      url: 'https://www.youtube.com/watch?v=UqmbxvOgnX4',
      defaultSets: 3,
      baseReps: '8-12',
    },
  ],
  day4: [
    {
      name: 'Hack Squat ',
      url: 'https://www.youtube.com/watch?v=QU6fqaX-kFM',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Upper back Hi-Lo row Raises',
      url: 'https://www.youtube.com/watch?v=Tojxn_p0OUI',
      defaultSets: 4,
      baseReps: '6-9',
    },
    {
      name: 'Y Raises',
      url: 'https://www.youtube.com/watch?v=m-6H7NTKX8U',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'STANDING CABLE FLY ',
      url: 'https://www.youtube.com/watch?v=PRw7ieDBLl4',
      defaultSets: 3,
      baseReps: '8-12',
    },
    {
      name: 'Cable Hammer Curl 2 ',
      url: 'https://www.youtube.com/watch?v=QR0KcEWloO8',
      defaultSets: 3,
      baseReps: '6-9',
    },
    {
      name: 'Barbell Skullcrusher',
      url: 'https://www.youtube.com/watch?v=l3rHYPtMUo8',
      defaultSets: 3,
      baseReps: '8-12',
    },
  ],
};

// --- Styled Components ---
const StyledCard = styled(Card)`
  margin-bottom: 20px;
  width: 100%;
  border-radius: 16px;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin-bottom: 12px;
  border-radius: 12px;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;

// Styled TextField for mobile-friendly input
const MobileTextField = styled(TextField)`
  && {
    .MuiInputBase-input {
      font-size: 42px !important;
    }
    .MuiInputLabel-root {
      font-size: 32px !important;
      color: rgba(180, 180, 180, 0.7) !important; /* lighter and more transparent */
    }
    margin-bottom: 16px; /* Add space below each input */
  }
`;

// Styled Button for mobile-friendly size
const MobileButton = styled(Button)`
  && {
    min-width: 80px;

    padding-top: 4px;
    padding-bottom: 4px;
    width: auto;

    @media (max-width: 600px) {
      min-width: 120px;

      padding-top: 12px;
      padding-bottom: 12px;
      width: 100%;
      margin-top: 16px;
    }
  }
`;

const RepsContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 21px;

  @media (min-width: 600px) {
    flex-direction: column;
    /* background-color: red; // for debugging, remove if not needed */
  }
`;

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
    <Box>
      {/* Drawer for mobile day selection */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
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
                  <ListItemText primary={d.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Tabs for desktop */}
      <Tabs
        value={tab}
        onChange={(_, newVal) => setTab(newVal)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          display: { xs: 'none', sm: 'flex' },
          '& .MuiTab-root': {
            fontSize: '45px', // Match the h6 font size
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

      <Box sx={{ p: { xs: 1, sm: 0 } }}>
        {workoutData[tab].map(({ name, url }) => {
          const exerciseLog = log[tab].find((ex) => ex.name === name);
          const sets = exerciseLog ? exerciseLog.sets : [];
          const isAdding = !!addingSet[name];
          return (
            <StyledCard key={name} elevation={2}>
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '45px' }}>
                  {name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: '24px', color: 'rgba(180,180,180,0.7)', mb: 1 }}
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
                      sx={{ fontSize: '32px' }}
                    />
                    <MobileTextField
                      type="number"
                      label={`Weight #${index + 1}`}
                      value={set.weight}
                      onChange={(e) => updateSet(tab, name, index, 'weight', e.target.value)}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <IconButton
                      onClick={() => removeSet(tab, name, index)}
                      size={window.innerWidth < 600 ? 'medium' : 'small'}
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
                    />
                    <MobileTextField
                      type="number"
                      label="Weight"
                      value={addingSet[name]?.weight || ''}
                      onChange={(e) => handleSetInputChange(name, 'weight', e.target.value)}
                      fullWidth
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
