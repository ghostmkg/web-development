import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Homepage.css'; // Ensure you create this CSS file for custom styles

const HomePage = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleGetStartedClick = () => {
        navigate('/Login'); // Use navigate to go to MovieList page
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="navbar-fixed" id="nav1">
                <Container>
                    <Navbar.Brand href="#home" className="navbar-brand">
                        <img src="/images/Ecube1.png" alt="Logo" className="logo-img" /> {/* Logo Image */}
                        ECube
                    </Navbar.Brand>
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
                    <img src='/images/Ecube1.png'></img>
                    <h1>Welcome to ECube</h1>
                    <p>Discover, Watch, Repeat Your Movie Adventure Awaits!</p>
                </div>
            </div>

            <div className="hero-section" id="features" style={{ backgroundImage: 'url(/images/leohome.jpg)' }}>
                <div className="hero-text">
                
                    <h1> Explore Events</h1>
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
            <footer className="footer" id="contact">
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
