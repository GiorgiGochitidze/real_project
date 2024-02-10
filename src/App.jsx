import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Registration from './Components/Registration';
import LogIn from './Components/LogIn';
import Manager from './Components/Manager';
import Workers from './Components/Workers';
import Tracker from './Components/Tracker';
import UserLokacia from './Components/UserLokacia';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Registration />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/Manager" element={<Manager />} />
        <Route path="/Tracker" element={<Tracker />} />
        <Route path="/UserLokacia" element={<UserLokacia />} />

        {/* Use dynamic route for /Workers/:username */}
        <Route path="/Workers/:username" element={<Workers />} />
      </Routes>
    </Router>
  );
}

export default App;
