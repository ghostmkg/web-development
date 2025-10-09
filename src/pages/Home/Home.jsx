/**
 * Home Component
 * 
 * This is the main homepage component that displays:
 * - Navigation bar
 * - Hero banner with featured content
 * - Multiple rows of movie categories
 * - Footer
 * 
 * The page showcases different movie categories fetched from TMDB API
 * and provides the main Netflix-like browsing experience.
 */

import React from 'react'
import './Home.css'
import Navbar from "../../components/Navbar/Navbar.jsx"
import hero_image from "../../assets/hero_banner.jpg"
import hero_title from "../../assets/hero_title.png"
import play_icon from "../../assets/play_icon.png"
import info_icon from '../../assets/info_icon.png'
import Titlecards from '../../components/Titlecards/Titlecards.jsx'
import Footer from '../../components/Footer/Footer.jsx'


/**
 * Home functional component
 * Renders the main homepage layout with hero section and movie categories
 */
const Home = () => {
  // Component render
  return (
    <div className='home'>
      {/* Main navigation bar */}
      <Navbar />
      
      {/* Hero banner section */}
      <div className="hero">
        {/* Background hero image */}
        <img src={hero_image} alt="Hero banner" className='banner-img'/>
        
        {/* Hero content overlay */}
        <div className="hero-caption">
          {/* Featured content title image */}
          <img src={hero_title} alt="Featured title" className='caption-img'/>
          
          {/* Featured content description */}
          <p>Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.</p>
          
          {/* Action buttons */}
          <div className="btn-box">
            <button className='btn'>
              <img src={play_icon} alt='Play icon'/>Play
            </button>
            <button className='btn dark-btn'>
              <img src={info_icon} alt='Info icon'/>More Info
            </button>
          </div>
          
          {/* Default title cards (no category specified) */}
          <Titlecards />
        </div>
      </div>
      
      {/* Additional movie category sections */}
      <div className="more-cards">
        {/* Popular movies from TMDB */}
        <Titlecards title={"Blockbuster Movies"} category={"popular"} />
        
        {/* Top rated movies */}
        <Titlecards title={"Only on Netflix"} category={"top_rated"} />
        
        {/* Upcoming releases */}
        <Titlecards title={"Upcoming"} category={"upcoming"} />
        
        {/* Currently playing movies */}
        <Titlecards title={"Top Pics For You"} category={"now_playing"} />
      </div>
      
      {/* Page footer */}
      <Footer />
    </div>
  )
}

// Export Home component as default
export default Home
