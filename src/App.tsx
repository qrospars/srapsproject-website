import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import MapSection from './components/MapSection';
import Contact from './components/Contact';
import CanvasBackground from './components/CanvasBackground';
import Footer from './components/Footer';

const App = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const appElement = document.querySelector('.App') as HTMLElement | null;

    function handleScroll() {
      if (!appElement) return;

      const scrollTop = appElement.scrollTop;
      const scrollableHeight = appElement.scrollHeight - appElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;

      setScrollPosition(Math.round(scrollPercentage));
    }

    if (appElement) {
      appElement.addEventListener('scroll', handleScroll);
    }

    // Cleanup function
    return () => {
      if (appElement) {
        appElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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
          <Footer />
        </div>
        <CanvasBackground scroll={scrollPosition} /> {/* Render canvas background */}
      </div>
    </Router>
  );
}

export default App;
