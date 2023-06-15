import React from 'react';
import logo from '../assets/images/logo192.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="App-header">
      <Link to="/">
        <img className="App-logo" src={logo} alt="SRAPSProject Logo" />
      </Link>
      <nav>
        <Link className="App-contact" to="/contact">
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default Header;
