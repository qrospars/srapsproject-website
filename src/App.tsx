import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import MapSection from './components/MapSection';
import Contact from './components/Contact';
import CanvasBackground from './components/CanvasBackground';
import Footer from './components/Footer';

const App = () => {

  const [scrollPosition, setScrollPosition] = useState(0);
  function handleScroll(event: Event) {
    const appElement = document.querySelector('.App') as HTMLElement;
    if (!appElement) return;

    const scrollHeight = appElement.scrollHeight;   // Total height of the content
    const clientHeight = appElement.clientHeight;   // Visible height
    const scrollTop = appElement.scrollTop;         // How much has been scrolled

    const scrollableHeight = scrollHeight - clientHeight;
    const scrollPercentage = (scrollTop / scrollableHeight) * 100;

    setScrollPosition(scrollPercentage);
    console.log(scrollPercentage)
  }


  useEffect(() => {
    const appElement = document.querySelector('.App') as HTMLElement | null;
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

