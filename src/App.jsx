import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Home from './Components/Home';
import Registration from './Components/Registration';
import LogIn from './Components/LogIn';
import Manager from './Components/Manager';
import Workers from './Components/Workers';
import Tracker from './Components/Tracker';


function App() {
  const [userLocation, setUserLocation] = useState(null);

  const handleClockIn = (location) => {
    console.log("User's location:", location);
    setUserLocation(location); // Set user's location in state
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Registration />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/Manager" element={<Manager />} />
        <Route path="/Tracker" element={<Tracker />} />


        {/* Use dynamic route for /Workers/:username */}
        <Route path="/Workers/:username" element={<Workers onClockIn={handleClockIn} />} />
      </Routes>
    </Router>
  );
}

export default App;
