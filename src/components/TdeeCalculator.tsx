import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const activityLevels = [
  { label: 'Sedentary (little to no exercise)', value: 1.2 },
  { label: 'Lightly active (1-3 days/week)', value: 1.375 },
  { label: 'Moderately active (3-5 days/week)', value: 1.55 },
  { label: 'Very active (6-7 days/week)', value: 1.725 },
  { label: 'Extra active (hard training & physical job)', value: 1.9 },
];

type FormState = {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activity: number;
  goal: 'lose' | 'maintain' | 'gain';
};

export default function TDEECalculator() {
  const [form, setForm] = useState<FormState>({
    age: 40,
    weight: 100,
    height: 178,
    gender: 'male',
    activity: 1.55,
    goal: 'lose',
  });

  const handleChange = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTDEE = () => {
    const { age, weight, height, gender, activity } = form;
    const BMR =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    return BMR * activity;
  };

  const tdee = calculateTDEE();
  const goalFactor = form.goal === 'lose' ? 0.8 : form.goal === 'gain' ? 1.2 : 1;
  const calories = tdee * goalFactor;

  const protein = form.weight * 2; // grams
  const fat = form.weight * 1; // grams
  const carbs = (calories - (protein * 4 + fat * 9)) / 4; // grams

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        TDEE & Macro Calculator
      </Typography>

      <TextField
        label="Age"
        type="number"
        fullWidth
        margin="normal"
        value={form.age}
        onChange={(e) =>
          handleChange('age', isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
        }
      />
      <TextField
        label="Weight (kg)"
        type="number"
        fullWidth
        margin="normal"
        value={form.weight}
        onChange={(e) =>
          handleChange('weight', isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
        }
      />
      <TextField
        label="Height (cm)"
        type="number"
        fullWidth
        margin="normal"
        value={form.height}
        onChange={(e) =>
          handleChange('height', isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
        }
      />
      <TextField
        select
        label="Gender"
        fullWidth
        margin="normal"
        value={form.gender}
        onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female')}
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </TextField>

      <TextField
        select
        label="Activity Level"
        fullWidth
        margin="normal"
        value={form.activity}
        onChange={(e) => handleChange('activity', Number(e.target.value))}
      >
        {activityLevels.map((level) => (
          <MenuItem key={level.value} value={level.value}>
            {level.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Goal"
        fullWidth
        margin="normal"
        value={form.goal}
        onChange={(e) => handleChange('goal', e.target.value as 'lose' | 'maintain' | 'gain')}
      >
        <MenuItem value="lose">Fat Loss</MenuItem>
        <MenuItem value="maintain">Maintenance</MenuItem>
        <MenuItem value="gain">Muscle Gain</MenuItem>
      </TextField>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>TDEE</TableCell>
              <TableCell align="right">{tdee.toFixed(0)} kcal</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Target Calories</TableCell>
              <TableCell align="right">{calories.toFixed(0)} kcal</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Protein</TableCell>
              <TableCell align="right">{protein.toFixed(0)} g</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fat</TableCell>
              <TableCell align="right">{fat.toFixed(0)} g</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Carbs</TableCell>
              <TableCell align="right">{carbs.toFixed(0)} g</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
