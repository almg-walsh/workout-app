import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WorkoutComponent from './components/WorkoutComponent';

const AppRoutes = () => (
  <Routes>
    <Route path="/workout-app" element={<WorkoutComponent />} />
  </Routes>
);

export default AppRoutes;
