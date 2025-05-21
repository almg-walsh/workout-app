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
import styled from 'styled-components';

const activityLevels = [
  { label: 'Sedentary (little to no exercise)', value: 1.2 },
  { label: 'Lightly active (1-3 days/week)', value: 1.375 },
  { label: 'Moderately active (3-5 days/week)', value: 1.55 },
  { label: 'Very active (6-7 days/week)', value: 1.725 },
  { label: 'Extra active (hard training & physical job)', value: 1.9 },
];

type FormState = {
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: 'male' | 'female';
  activity: number;
  goal: 'aggressive' | 'lose' | 'maintain' | 'gain';
};

// Styled TextField for large mobile font and input box
const BigTextField = styled(TextField)`
  && {
    .MuiInputBase-input,
    .MuiSelect-select {
      font-size: 18px !important;
      padding-top: 18px;
      padding-bottom: 18px;
      height: 40px;
      display: flex;
      align-items: center;
    }
    .MuiInputLabel-root {
      font-size: 32px !important;
      color: rgba(180, 180, 180, 0.7) !important;
    }
    .MuiSelect-icon {
      font-size: 18px !important;
    }
    margin-bottom: 32px;
  }
`;

// Styled Table for large font and spacing
const BigTableCell = styled(TableCell)`
  && {
    font-size: 18px;
    padding: 24px 16px;
  }
`;

const BigTableHeadCell = styled(TableCell)`
  && {
    font-size: 18px;
    font-weight: bold;
    padding: 28px 16px;
  }
`;

export default function TDEECalculator() {
  const [form, setForm] = useState<FormState>({
    age: 35,
    weight: 78,
    height: 180,
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
    const safeWeight = weight ?? 0;
    const safeHeight = height ?? 0;
    const safeAge = age ?? 0;
    const BMR =
      gender === 'male'
        ? 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5
        : 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161;
    return BMR * activity;
  };

  const tdee = calculateTDEE();
  let goalFactor = 1;
  if (form.goal === 'aggressive') goalFactor = 0.65;
  else if (form.goal === 'lose') goalFactor = 0.8;
  else if (form.goal === 'gain') goalFactor = 1.2;

  const calories = tdee * goalFactor;
  const protein = form?.weight * 2; // grams
  const fat = form?.weight * 1; // grams
  const carbs = (calories - (protein * 4 + fat * 9)) / 4; // grams

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: 24, sm: 24 } }}>
        TDEE & Macro Calculator
      </Typography>

      <BigTextField
        label="Age"
        type="number"
        fullWidth
        margin="normal"
        value={form.age}
        onChange={(e) =>
          handleChange('age', isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
        }
      />
      <BigTextField
        label="Weight (kg)"
        type="number"
        fullWidth
        margin="normal"
        value={form.weight}
        onChange={(e) =>
          handleChange('weight', isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
        }
      />
      <BigTextField
        label="Height (cm)"
        type="number"
        fullWidth
        margin="normal"
        value={form.height}
        onChange={(e) =>
          handleChange('height', isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
        }
      />
      <BigTextField
        select
        label="Gender"
        fullWidth
        margin="normal"
        value={form.gender}
        onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female')}
        SelectProps={{ native: false }}
      >
        <MenuItem
          value="male"
          sx={{
            fontSize: '18px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '40px',
          }}
        >
          Male
        </MenuItem>
        <MenuItem
          value="female"
          sx={{
            fontSize: '18px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '40px',
          }}
        >
          Female
        </MenuItem>
      </BigTextField>

      <BigTextField
        select
        label="Activity Level"
        fullWidth
        margin="normal"
        value={form.activity}
        onChange={(e) => handleChange('activity', Number(e.target.value))}
      >
        {activityLevels.map((level) => (
          <MenuItem
            key={level.value}
            value={level.value}
            sx={{
              fontSize: '18px !important',
              paddingTop: '28px',
              paddingBottom: '28px',
              height: '40px',
            }}
          >
            {level.label}
          </MenuItem>
        ))}
      </BigTextField>

      <BigTextField
        select
        label="Goal"
        fullWidth
        margin="normal"
        value={form.goal}
        onChange={(e) =>
          handleChange('goal', e.target.value as 'aggressive' | 'lose' | 'maintain' | 'gain')
        }
      >
        <MenuItem
          value="aggressive"
          sx={{
            fontSize: '18px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '40px',
          }}
        >
          Aggressive Fat Loss
        </MenuItem>
        <MenuItem
          value="lose"
          sx={{
            fontSize: '18px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '40px',
          }}
        >
          Fat Loss
        </MenuItem>
        <MenuItem
          value="maintain"
          sx={{
            fontSize: '18px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '40px',
          }}
        >
          Maintenance
        </MenuItem>
        <MenuItem
          value="gain"
          sx={{
            fontSize: '18px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '40px',
          }}
        >
          Muscle Gain
        </MenuItem>
      </BigTextField>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <BigTableHeadCell>Metric</BigTableHeadCell>
              <BigTableHeadCell align="right">Value</BigTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <BigTableCell>TDEE</BigTableCell>
              <BigTableCell align="right">{tdee.toFixed(0)} kcal</BigTableCell>
            </TableRow>
            <TableRow>
              <BigTableCell>Target Calories</BigTableCell>
              <BigTableCell align="right">{calories.toFixed(0)} kcal</BigTableCell>
            </TableRow>
            <TableRow>
              <BigTableCell>Protein</BigTableCell>
              <BigTableCell align="right">{protein.toFixed(0)} g</BigTableCell>
            </TableRow>
            <TableRow>
              <BigTableCell>Fat</BigTableCell>
              <BigTableCell align="right">{fat.toFixed(0)} g</BigTableCell>
            </TableRow>
            <TableRow>
              <BigTableCell>Carbs</BigTableCell>
              <BigTableCell align="right">{carbs.toFixed(0)} g</BigTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
