/**
 * Main Entry Point
 * 
 * This file is the entry point of the React application.
 * It sets up:
 * - React root rendering
 * - Browser routing context
 * - Global CSS imports
 * - App component mounting
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Global CSS styles
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Create React root and render the application
// BrowserRouter enables client-side routing throughout the app
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
