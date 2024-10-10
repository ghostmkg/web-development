import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Header from './Header';
import { useDispatch } from 'react-redux';
import { setTicketDetails } from '../slices/ticketSlice';
import './Booking.css';

const Bookings = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [movie, setMovie] = useState(null);
    const [seats, setSeats] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [showTimes] = useState([
        '10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'
    ]); // Predefined show timings

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`/api/upcomingmovies/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Failed to fetch movie details', error);
            }
        };
        fetchMovieDetails();
    }, [id]);

    const renderStars = (rating) => {
        const maxStars = 5;
        const fullStars = Math.floor(rating / 2);
        const halfStar = rating % 2 >= 1;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star full">★</span>);
        }

        if (halfStar) {
            stars.push(<span key="half" className="star half">★</span>);
        }

        for (let i = fullStars + (halfStar ? 1 : 0); i < maxStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
        }

        return stars;
    };

    const handleBookingConfirmation = () => {
        dispatch(setTicketDetails({ movie, seats, date, time }));
        navigate(`/ticketdetails`);
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <h1>Bookings</h1>
            <Container className="image-card-container">
                <img
                    id="Banner"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                />
                <div className="card1">
                    <h5 className="card-title">{movie.title}</h5>
                    <h6 className="card-subtitle">Release Date: {movie.release_date}</h6>
                    <h6 className="card-subtitle">Popularity: {movie.popularity}</h6>
                    <p className="card-text">{movie.overview}</p>
                    <div className="star-rating">
                        <h6>What Viewers are Saying: {renderStars(movie.vote_average)}</h6>
                    </div>

                    <div className="form-group">
                        <label htmlFor="seats">Number of Seats:</label>
                        <input
                            type="number"
                            id="seats"
                            className="form-control"
                            min="1"
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Show Time:</label>
                        <select
                            id="time"
                            className="form-control"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        >
                            <option value="">Select a time</option>
                            {showTimes.map((showTime, index) => (
                                <option key={index} value={showTime}>
                                    {showTime}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="button" id="but" className="btn btn-primary" onClick={handleBookingConfirmation}>
                        Confirm Booking
                    </button>
                </div>
            </Container>
        </>
    );
};

export default Bookings;
