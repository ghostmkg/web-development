import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './carousel.css'; // Import your custom CSS for Carousel
import Header from './Header';
function CarouselPage() {
  return (
    <>
    
    <Carousel data-bs-theme="dark" id="see">
      <Carousel.Item>
        <img id="sii"
          className="d-block w-100 carousel-image"
          src="/images/caro2.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h5>Movie Posters</h5>
          <p>A Tale of Adventure and Triumph</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img id="sii"
          className="d-block w-100 carousel-image"
          src="/images/leo2.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5>Featured Movies</h5>
          <p>Explore the world of movies: Dive into our top picks.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img id="sii"
          className="d-block w-100 carousel-image"
          src="/images/Doctor.webp"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h5>Search and Discover</h5>
          <p>
          Explore Our Extensive Movie Collection.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </>
  );
}

export default CarouselPage;
