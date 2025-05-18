import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleComponent from './components/ExampleComponent';

function Home() {
  return <h2>Home Page</h2>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/example" element={<ExampleComponent />} />
  </Routes>
);

export default AppRoutes;