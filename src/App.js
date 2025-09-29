import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FaNotesMedical, FaUserMd, FaExchangeAlt, FaStethoscope } from 'react-icons/fa';
import SearchPage from './SearchPage';
import PatientDashboard from './PatientDashboard';
import DoctorsPage from './DoctorsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="nav-container">
            <NavLink to="/" className="nav-logo">
              <FaStethoscope /> NAMASTE
            </NavLink>
            <nav>
              <ul className="nav-menu">
                <li>
                  <NavLink to="/" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                    <FaExchangeAlt /> 
                    <span>Code Translator</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/patients" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                    <FaNotesMedical />
                    <span>Patient Records</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/doctors" className={({ isActive }) => "nav-links" + (isActive ? " activated" : "")}>
                    <FaUserMd aria-hidden="true"/>
                    <span>Doctor Directory</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/patients" element={<PatientDashboard />} />
              <Route path="/doctors" element={<DoctorsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

