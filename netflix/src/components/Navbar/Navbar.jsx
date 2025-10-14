import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"
import search_icon from "../../assets/search_icon.svg"
import bell_icon from "../../assets/bell_icon.svg"
import profile_img from "../../assets/profile_img.png"
import caret_icon from "../../assets/caret_icon.svg"
import { logout } from '../../firebase'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const dark = useRef();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(()=>{
    window.addEventListener("scroll",()=>{
      if(window.scrollY >= 80){
        dark.current.classList.add("dark-nav");
      }else{
        dark.current.classList.remove("dark-nav");
      }
    })
  },[])

  return (
    <div ref ={dark} className='navbar'>
      <div className="nav-left">
        <img src={logo} alt ="" />
        <ul className={mobileMenuOpen ? 'mobile-menu-open' : ''}>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="nav-right">
        <Link to={"/search"}><img src={search_icon} alt="" className='icons'/></Link>
        <p className="children-text">Children</p>
        <img src={bell_icon} alt="" className='icons'/>
        <div className="nav-profile">
          <img src={profile_img} alt="" className='profile'/>
          <img src={caret_icon} alt=""/>
          <div className="dropdown">
            <p onClick={()=>{logout()}}>Sign out of netflix</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
