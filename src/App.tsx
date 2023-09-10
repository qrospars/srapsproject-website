import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import MapSection from './components/MapSection';
import Contact from './components/Contact';
import CanvasBackground from './components/CanvasBackground';

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<WelcomeSection />} />
            <Route path="/map" element={<MapSection />} />
            <Route path="/contact" element={<Contact />} />
            {/* You can add other routes as needed */}
          </Routes>
        </div>
        <CanvasBackground key={Math.random()} /> {/* Render canvas background */}
      </div>
    </Router>
  );
}

export default App;
