import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Upcoming.css';  // Import a CSS file for custom styling

const Upcoming = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <>
        <Header/>
        <Container>
            <h1>Upcoming Movies to Watch</h1>
            <Row>
                {movies.map(movie => (
                    <Col key={movie.id} xs={10} md={6} lg={4} className="mb-4">
                        <Card className="movie-card">
                            <Card.Img 
                                variant="top" 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                alt={movie.title} 
                                className="movie-card-img"
                            />
                            <Card.Body className="movie-card-body">
                               <Card.Title className="movie-card-title"><b>{movie.title}</b></Card.Title>
                               <i><p>Release_date:{movie.release_date}</p></i>
                                <Card.Text className="movie-card-text">{movie.overview}</Card.Text>
                                <Button variant="primary">Book</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </>
    );
};

export default Upcoming;
