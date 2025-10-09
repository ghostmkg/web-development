/**
 * Navbar Component
 * 
 * This component renders the main navigation bar with:
 * - Netflix logo and navigation menu
 * - Search functionality
 * - User profile dropdown with logout
 * - Responsive mobile hamburger menu
 * - Dynamic background opacity on scroll
 */

import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"
import search_icon from "../../assets/search_icon.svg"
import bell_icon from "../../assets/bell_icon.svg"
import profile_img from "../../assets/profile_img.png"
import caret_icon from "../../assets/caret_icon.svg"
import { logout } from '../../firebase'
import { Link } from 'react-router-dom'

/**
 * Navbar functional component
 * Handles navigation, user interactions, and responsive behavior
 */
const Navbar = () => {
  // Ref for navbar element to add/remove dark background class
  const dark = useRef();
  // State to control mobile hamburger menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Effect hook to add scroll-based navbar styling
  useEffect(() => {
    // Add scroll event listener to change navbar appearance
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 80) {
        // Add dark background when scrolled down 80px or more
        dark.current.classList.add("dark-nav");
      } else {
        // Remove dark background when at top of page
        dark.current.classList.remove("dark-nav");
      }
    })
  }, []); // Empty dependency array - runs once on component mount

  // Component render
  return (
    <div ref={dark} className='navbar'>
      {/* Left side of navbar - logo and navigation menu */}
      <div className="nav-left">
        {/* Netflix logo */}
        <img src={logo} alt="Netflix logo" />
        
        {/* Navigation menu - responsive based on mobile menu state */}
        <ul className={mobileMenuOpen ? 'mobile-menu-open' : ''}>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
        
        {/* Mobile hamburger menu button */}
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Right side of navbar - search, notifications, profile */}
      <div className="nav-right">
        {/* Search icon - links to search page */}
        <Link to={"/search"}>
          <img src={search_icon} alt="Search" className='icons'/>
        </Link>
        
        {/* Children profile text */}
        <p className="children-text">Children</p>
        
        {/* Notification bell icon */}
        <img src={bell_icon} alt="Notifications" className='icons'/>
        
        {/* User profile dropdown */}
        <div className="nav-profile">
          {/* Profile image */}
          <img src={profile_img} alt="Profile" className='profile'/>
          
          {/* Dropdown caret icon */}
          <img src={caret_icon} alt="Dropdown"/>
          
          {/* Dropdown menu with logout option */}
          <div className="dropdown">
            <p onClick={() => { logout() }}>Sign out of netflix</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export Navbar component as default
export default Navbar
