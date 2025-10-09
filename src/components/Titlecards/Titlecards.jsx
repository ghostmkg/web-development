/**
 * Titlecards Component
 * 
 * This component displays horizontal scrollable movie cards fetched from TMDB API.
 * Features:
 * - Fetches movies from different categories (popular, top_rated, upcoming, now_playing)
 * - Horizontal mouse wheel scrolling
 * - Clickable cards that navigate to video player
 * - Persistent global data storage to avoid duplicate API calls
 * - Environment variable-based API authentication
 */

import React, { useRef, useEffect, useState } from 'react'
import './Titlecards.css'
import cards_data from "../../assets/cards/Cards_data.js"
import { Link } from 'react-router-dom';

// Global array to store all fetched movie data across component instances
// This prevents duplicate API calls and maintains data persistence
const persistentGlobalData = [];

/**
 * Titlecards functional component
 * @param {string} title - Display title for the movie section
 * @param {string} category - TMDB API category (popular, top_rated, upcoming, now_playing)
 */
const Titlecards = ({ title, category }) => {
  // Ref for horizontal scrolling container
  const scrollHori = useRef();
  // State to store fetched movie data from TMDB API
  const [apiData, setApiData] = useState([]);

  // TMDB API request configuration
  // Uses Bearer token authentication from environment variables
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
    }
  };
  /**
   * Horizontal scrolling function
   * Converts vertical mouse wheel movement to horizontal scrolling
   * @param {WheelEvent} event - Mouse wheel event
   */
  const scrollHorizontal = (event) => {
    event.preventDefault();
    // Convert vertical scroll (deltaY) to horizontal scroll
    scrollHori.current.scrollLeft += event.deltaY;
  }

  // Effect hook to fetch movie data and set up scroll listener
  useEffect(() => {
    // Fetch movies from TMDB API based on category or default to 'now_playing'
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => {
        // Set component state with fetched movie data
        setApiData(res.results);
        
        // Update global persistent data to avoid duplicate entries
        const existingIds = persistentGlobalData.map(movie => movie.id);
        const newMovies = res.results.filter(movie => !existingIds.includes(movie.id));
        persistentGlobalData.push(...newMovies);
      })
      .catch(err => console.error('Error fetching movie data:', err));
    
    // Add horizontal scroll event listener to the card container
    scrollHori.current.addEventListener("wheel", scrollHorizontal);
    
    console.log('Global movie data:', persistentGlobalData);
  }, []); // Empty dependency array - runs once on component mount
  // Component render
  return (
    <div className='title-cards'>
      {/* Section title - uses prop or default text */}
      <h1>{title ? title : "Popular on Netflix"}</h1>
      
      {/* Horizontal scrollable container for movie cards */}
      <div className="card-list" ref={scrollHori}>
        {/* Map through fetched movie data to create clickable cards */}
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} className="card" key={index}>
              {/* Movie poster image from TMDB */}
              <img 
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} 
                alt={`${card.title} poster`} 
              />
              {/* Movie title */}
              <p>{card.title}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Export Titlecards component as default
export default Titlecards;
// Export persistent data for use in other components (like Search)
export { persistentGlobalData };
