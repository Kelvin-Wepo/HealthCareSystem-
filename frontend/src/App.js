import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './Pages/LandingPage';
import AppointmentPage from './Pages/AppointmentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
