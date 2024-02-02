import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Registration from './Components/Registration';
import LogIn from './Components/LogIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Register" element={<Registration />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
