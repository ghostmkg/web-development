import React,{useRef,useEffect, useState} from 'react'
import './Titlecards.css'
import cards_data from "../../assets/cards/Cards_data.js"
import { Link } from 'react-router-dom';


const persistentGlobalData = [];

const Titlecards = ({title,category}) => {
  const scrollHori = useRef();
  const [apiData,setApiData] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_MOVIE_DB_BEARER}`
    }
  };
  const scrollHorizontal = (event) =>{
    event.preventDefault();
    scrollHori.current.scrollLeft += event.deltaY;
  }

  useEffect(()=>{
    fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
    .then(res => res.json())
    .then(res => {setApiData(res.results);
      const existingIds = persistentGlobalData.map(movie => movie.id);
      const newMovies = res.results.filter(movie => !existingIds.includes(movie.id));
      persistentGlobalData.push(...newMovies);
    })
    .catch(err => console.error(err));
    scrollHori.current.addEventListener("wheel",scrollHorizontal);
    console.log(persistentGlobalData);
  },[]);
  return (
    <div className='title-cards'>
      <h1>{title?title:"Popular on Netflix"}</h1>
      <div className="card-list" ref={scrollHori}>
        {apiData.map((card, index)=>{
          return <Link to={`/player/${card.id}`} className="card" key={index}>
            <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt='' />
            <p>{card.title}</p>
          </Link>
        })}
      </div>
    </div>
  )
}

export default Titlecards;
export { persistentGlobalData };
