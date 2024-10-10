import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Movieslist.css'; // Make sure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import CarouselPage from './CarouselPage';
import Header from './Header';
const Movieslist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies'); // Updated endpoint
        setMovies(response.data.results); // Assuming response.data has a results property
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <>
    <Header/>
    <CarouselPage/>
      <div className="container">
        <h1 className="my-4">Editor's Pick</h1>
        <div className="row">
          {movies.map((movie) => (
            <div className="col-md-4 mb-4" key={movie.id}>
              <div className="card">
                <img
                  src={movie.poster_path} // Assuming this path is directly accessible
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="release-date">Release_date:{movie.release_date}</p>
                  <p className="description">Overview:{movie.overview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Movieslist;
