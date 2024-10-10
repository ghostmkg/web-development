import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './Trailers.css';  // Import a CSS file for custom styling
import Header from './Header';
const Trailers = () => {
    const [trailers, setTrailers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrailers = async () => {
            try {
                const response = await axios.get('/api/movies/trailers');
                setTrailers(response.data.trailers);
            } catch (error) {
                setError('Failed to fetch trailers');
            }
        };
        fetchTrailers();
    }, []);

    if (error) return <div>{error}</div>;
    if (!trailers.length) return <div>No trailers available</div>;

    return (
        <>
        <Header/>
        <Container>
            <h1>Get a Sneak Peek of the Excitement</h1>
            <Row className="justify-content-center">
                {trailers.map(trailer => (
                    <Col key={trailer.id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
                        <Card className="trailer-card">
                            <div className="trailer-card-img-container">
                                <Card.Img
                                    variant="top"
                                    src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`} // Thumbnail image
                                    alt={trailer.name}
                                    className="trailer-card-img"
                                />
                                <div className="trailer-card-title-overlay">
                                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" >Watch Now
                                </a>
                                </div>
                            </div>
                               
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </>
    );
};

export default Trailers;
