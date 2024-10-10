import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar1">
      <div className="logo">
        <img src="/images/Ecube1.png" alt="Logo" className="logo-img" />
      </div>
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/MoviesList">Movies</Link></li>
        <li><Link to="/Trailers">Watch Trailers</Link></li>
        <li><Link to="/LatestMovies">What’s Hot Now</Link></li>
        <li><Link to="/Upcoming">Upcoming</Link></li>
        <li><Link to="/Events">Events</Link></li>
        <li><Link to="/Logout">Logout</Link></li> {/* Ensure this route matches your route setup */}
      </ul>
      <div className="burger" onClick={handleToggle}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
}

export default Header;
