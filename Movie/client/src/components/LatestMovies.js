import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header';
import Card from 'react-bootstrap/Card';
import './Upcoming.css';  // Import the specific CSS file for this component
import { useNavigate } from 'react-router-dom';

const LatestMovies = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('/api/upcomingmovies');
                setMovies(response.data.results);
            } catch (error) {
                setError('Failed to fetch upcoming movies');
            }
        };
        fetchMovies();
    }, []);

    if (error) return <div>{error}</div>;

    const handleBooking = (id) => {
        navigate(`/bookings/${id}`);
    };

    return (
        <>
            <Header />
            <Container className="latest-movies-container">
                <h1>Check Out the Latest Releases</h1>
                <Row className="justify-content-center">
                    {movies.map(movie => (
                        <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
                            <Card className="movie-card">
                                <Card.Img 
                                    variant="top" 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                    alt={movie.title} 
                                    className="movie-card-img"
                                />
                                <Card.Body className="movie-card-body">
                                    <Card.Title className="movie-card-title"><b>{movie.title}</b></Card.Title>
                                    <i><p>Release Date: {movie.release_date}</p></i>
                                    <Card.Text className="movie-card-text">{movie.overview}</Card.Text>
                                </Card.Body>
                                <button 
                                    type="button" 
                                    className="btn btn-primary movie-card-button" 
                                    onClick={() => handleBooking(movie.id)}
                                >
                                    Book
                                </button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default LatestMovies;
