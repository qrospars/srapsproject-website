import React, { useEffect, useRef, useState } from 'react';
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
  const appElementRef = useRef<HTMLElement | null>(null);
  const scrollHeightRef = useRef<number>(0);
  const clientHeightRef = useRef<number>(0);

  function handleScroll() {
    if (!appElementRef.current) return;

    if (!scrollHeightRef.current || !clientHeightRef.current) {
      scrollHeightRef.current = appElementRef.current.scrollHeight;
      clientHeightRef.current = appElementRef.current.clientHeight;
    }

    const scrollTop = appElementRef.current.scrollTop;
    const scrollableHeight = scrollHeightRef.current - clientHeightRef.current;
    const scrollPercentage = (scrollTop / scrollableHeight) * 100;

    setScrollPosition(Math.round(scrollPercentage));
  }

  useEffect(() => {
    appElementRef.current = document.querySelector('.App') as HTMLElement | null;

    if (appElementRef.current) {
      appElementRef.current.addEventListener('scroll', handleScroll);
    }

    // Cleanup function
    return () => {
      if (appElementRef.current) {
        appElementRef.current.removeEventListener('scroll', handleScroll);
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
