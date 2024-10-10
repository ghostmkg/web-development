import React from 'react';
import { useSelector } from 'react-redux';
import './TicketDetails.css';
import Header from './Header';

const TicketDetails = () => {
    const ticketState = useSelector(state => state.ticket);

    // Handle the case when `ticketState` or `ticketState.movie` might be undefined
    const { movie, seats, date, time } = ticketState || {};

    if (!movie) return <div>Loading...</div>; // Handle the case when movie is not available

    return (
        <>
        <Header/>
        <br></br>
        <div className="ticket-details-container">
            <h2>Your Booking for {movie.title}</h2>
            <img
                    id="Banner"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                />
            <p>Show Time: {time}</p>
            <p>Date: {date}</p>
            <p>Seat Number: {seats}</p>
            <img src="/images/qr_code.png" alt="QR Code" className="qr-code" width="250px" height="250px"/>
            <p>Scan this QR code at the entrance.</p>
        </div>
        </>
    );
};

export default TicketDetails;
