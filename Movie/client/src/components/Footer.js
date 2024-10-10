import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Homepage.css'; // Ensure you create this CSS file for custom styles
import './Footer.css'; // Import the CSS file for footer styling

const HomePage = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleGetStartedClick = () => {
        navigate('/MoviesList'); // Use navigate to go to MovieList page
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="navbar-fixed">
                <Container>
                    <Navbar.Brand href="#home">E-Cube</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="hero-section" style={{ backgroundImage: 'url(/images/ju.jpg)' }}>
                <div className="hero-text">
                    <h1>Welcome to E-Cube</h1>
                    <p>Discover the latest movies and events.</p>
                </div>
            </div>

            <div className="hero-section" id="features" style={{ backgroundImage: 'url(/images/leohome.jpg)' }}>
                <div className="hero-text">
                    <h1>Explore Events</h1>
                    <p>Find upcoming events and book tickets effortlessly.</p>
                </div>
            </div>

            <div className="hero-section" id="pricing" style={{ backgroundImage: 'url(/images/sthome.jpg)' }}>
                <div className="hero-text">
                    <h1>Book Your Tickets</h1>
                    <p>Enjoy a seamless booking experience with E-Cube.</p>
                </div>
            </div>

            <Button className="btn-get-started" onClick={handleGetStartedClick}>
                Get Started
            </Button>

            {/* Footer Section */}
            <footer className="footer">
                <Container>
                    <div className="footer-content">
                        <div className="contact-info">
                            <h5>Contact Us</h5>
                            <p>Email: support@ecube.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </div>
                        <div className="copyright">
                            <p>&copy; {new Date().getFullYear()} E-Cube. All rights reserved.</p>
                        </div>
                    </div>
                </Container>
            </footer>
        </>
    );
};

export default HomePage;
