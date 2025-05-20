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
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activity: number;
  goal: 'aggressive' | 'lose' | 'maintain' | 'gain';
};

// Styled TextField for large mobile font and input box
const BigTextField = styled(TextField)`
  && {
    .MuiInputBase-input,
    .MuiSelect-select {
      font-size: 45px !important;
      padding-top: 28px;
      padding-bottom: 28px;
      height: 60px;
      display: flex;
      align-items: center;
    }
    .MuiInputLabel-root {
      font-size: 32px !important;
      color: rgba(180, 180, 180, 0.7) !important;
    }
    .MuiSelect-icon {
      font-size: 45px !important;
    }
    margin-bottom: 32px;
  }
`;

// Styled Table for large font and spacing
const BigTableCell = styled(TableCell)`
  && {
    font-size: 36px;
    padding: 24px 16px;
  }
`;

const BigTableHeadCell = styled(TableCell)`
  && {
    font-size: 40px;
    font-weight: bold;
    padding: 28px 16px;
  }
`;

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
  let goalFactor = 1;
  if (form.goal === 'aggressive') goalFactor = 0.65;
  else if (form.goal === 'lose') goalFactor = 0.8;
  else if (form.goal === 'gain') goalFactor = 1.2;

  const calories = tdee * goalFactor;
  const protein = form.weight * 2; // grams
  const fat = form.weight * 1; // grams
  const carbs = (calories - (protein * 4 + fat * 9)) / 4; // grams

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: 38, sm: 44 } }}>
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
            fontSize: '45px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '60px',
          }}
        >
          Male
        </MenuItem>
        <MenuItem
          value="female"
          sx={{
            fontSize: '45px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '60px',
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
              fontSize: '45px !important',
              paddingTop: '28px',
              paddingBottom: '28px',
              height: '60px',
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
            fontSize: '45px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '60px',
          }}
        >
          Aggressive Fat Loss
        </MenuItem>
        <MenuItem
          value="lose"
          sx={{
            fontSize: '45px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '60px',
          }}
        >
          Fat Loss
        </MenuItem>
        <MenuItem
          value="maintain"
          sx={{
            fontSize: '45px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '60px',
          }}
        >
          Maintenance
        </MenuItem>
        <MenuItem
          value="gain"
          sx={{
            fontSize: '45px !important',
            paddingTop: '28px',
            paddingBottom: '28px',
            height: '60px',
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
