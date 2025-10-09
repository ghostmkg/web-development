/**
 * Search Component
 * 
 * This component provides search functionality for movies and TV shows.
 * Features:
 * - Real-time search input with instant filtering
 * - Searches through persistent global movie data
 * - Displays default movie categories when no search term
 * - Shows filtered results based on movie titles
 * 
 * TODO: Enhance search results with clickable movie cards
 * TODO: Add search by genre, year, rating, etc.
 * TODO: Implement search history and suggestions
 */

import search_icon from "../../assets/search_icon.svg"
import { useEffect, useRef, useState } from "react";
import Titlecards from '../../components/Titlecards/Titlecards.jsx'
import { persistentGlobalData } from "../../components/Titlecards/Titlecards.jsx";

/**
 * Search functional component
 * Handles search input and displays filtered movie results
 */
const Search = () => {
    // State to store current search query
    const [search, setSearch] = useState("");
    // Component render
    return (
        <>
            {/* Search input bar */}
            <div className="search-bar">
                {/* Search icon */}
                <img src={search_icon} alt="Search icon"/>
                
                {/* Search input field with real-time onChange */}
                <input 
                    onChange={(e) => setSearch(e.target.value)}  
                    type="text" 
                    placeholder="Movies, shows and more"
                />
                
                {/* Close/Clear button (TODO: implement functionality) */}
                <p>X</p>
            </div>
            
            {/* Search results container */}
            <div className="result">
                {/* Conditional rendering based on search query */}
                {search.length === 0 ? 
                    // Default view: Show movie categories when no search term
                    <>
                        <Titlecards title={"Blockbuster Movies"} category={"popular"} />
                        <Titlecards title={"Only on Netflix"} category={"top_rated"} />
                        <Titlecards title={"Upcoming"} category={"upcoming"} />
                        <Titlecards title={"Top Pics For You"} category={"now_playing"} />
                    </>
                    : (
                        // Search results: Filter and display matching movies
                        // Uses persistent global data from Titlecards component
                        persistentGlobalData
                            .filter(item => 
                                // Case-insensitive search in movie titles
                                item.title.toLowerCase().includes(search.toLowerCase())
                            )
                            .map(item => (
                                // TODO: Replace with clickable movie cards
                                // Currently displays simple text list
                                <p key={item.id}>{item.title}</p>
                            ))
                    )
                }
            </div>
        </>
    );
}

// Export Search component as default
export default Search;