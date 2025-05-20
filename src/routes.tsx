import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WorkoutComponent from './components/WorkoutComponent';
import TdeeCalculator from './components/TdeeCalculator';

const AppRoutes = () => (
  <Routes>
    <Route path="/workout-app" element={<WorkoutComponent />} />
    <Route path="/workout-app/calculator" element={<TdeeCalculator />} />
  </Routes>
);

export default AppRoutes;
