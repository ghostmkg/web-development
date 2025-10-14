import React from 'react'
import './Home.css'
import Navbar from "../../components/Navbar/Navbar.jsx"
import hero_image from "../../assets/hero_banner.jpg"
import hero_title from "../../assets/hero_title.png"
import play_icon from "../../assets/play_icon.png"
import info_icon from '../../assets/info_icon.png'
import Titlecards from '../../components/Titlecards/Titlecards.jsx'
import Footer from '../../components/Footer/Footer.jsx'


const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        <img src={hero_image} alt ="" className='banner-img'/>
        <div className="hero-caption">
          <img src = {hero_title} alt="" className='caption-img'/>
          <p>Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.</p>
          <div className="btn-box">
            <button className='btn'><img src={play_icon} alt=''/>Play</button>
            <button className='btn dark-btn'><img src={info_icon} alt=''/>More Info</button>
          </div>
          <Titlecards />
        </div>
      </div>
      <div className="more-cards">
        <Titlecards title={"Blockbusters Movies"} category={"popular"} />
        <Titlecards title={"Only on Netflix"} category={"top_rated"} />
        <Titlecards title={"Upcoming"} category={"upcoming"} />
        <Titlecards title={"Top Pics For You"} category={"now_playing"} />
      </div>
      <Footer />
    </div>
  )
}

export default Home
