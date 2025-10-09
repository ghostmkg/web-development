/**
 * App Component - Main Application Router
 * 
 * This is the root component that handles:
 * - Authentication state management
 * - Route configuration and navigation
 * - Toast notifications setup
 * - Protected routing based on user authentication
 * 
 * Routes:
 * - / : Home page (protected)
 * - /login : Login/Signup page
 * - /player/:id : Video player page (protected)
 * - /search : Search page (protected)
 */

import React, { useEffect } from 'react'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Player from './pages/Player/Player.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from './pages/Search/Search.jsx'

/**
 * Main App functional component
 * Manages authentication state and routing
 */
const App = () => {
  // Navigation hook for programmatic routing
  const nav = useNavigate();

  // Effect hook to monitor authentication state changes
  useEffect(() => {
    // Firebase auth state listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is authenticated - redirect to home page
        console.log("User logged in:", user.email);
        nav("/");
      } else {
        // User is not authenticated - redirect to login page
        console.log("User logged out");
        nav("/login");
      }
    });
  }, []); // Empty dependency array - runs once on component mount

  // Component render
  return (
    <div>
      {/* Toast notification container with dark theme */}
      <ToastContainer theme='dark' />
      
      {/* Application routes */}
      <Routes>
        {/* Home page - displays movie categories and hero banner */}
        <Route path='/' element={<Home />} />
        
        {/* Login/Signup page - authentication forms */}
        <Route path='/login' element={<Login />} />
        
        {/* Video player page - displays movie trailers */}
        <Route path='/player/:id' element={<Player />} />
        
        {/* Search page - movie and TV show search functionality */}
        <Route path='/search' element={<Search />} />
      </Routes>
    </div>
  )
}

// Export App component as default
export default App
