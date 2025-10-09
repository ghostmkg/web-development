import React, { useEffect, useState } from 'react'
import './Player.css'
import back_button from "../../assets/back_arrow_icon.png"
import { useNavigate, useParams } from 'react-router-dom'

const Player = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const [apiData ,setApiData] = useState({
    name:"",
    key:"",
    published_at:"",
    type:""
  })

  // TMDB API request configuration
  // Uses Bearer token authentication from environment variables
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
    }
  };
  useEffect(()=>{
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(res => setApiData(res.results[0]))
      .catch(err => console.error(err));
  },[])

  return (
    <div className='player'>
      <img src={back_button} alt='' onClick={()=>{navigate(-2)}}/>
      <iframe width="90%" height="90%"
        src={`https://www.youtube.com/embed/${apiData.key}`}
        title='trailer' allowFullScreen
      ></iframe>
      <div className="player-info">
        <p>{apiData.published_at.slice(0,10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  )
}

export default Player
