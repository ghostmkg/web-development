import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Events.css'; // Import CSS file
import Header from './Header';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events');
                setEvents(response.data.events);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <>
            <Header />
            <h1 className="events-title">Nearby Events</h1>
            <div className="events-container">
                {events.map((event) => (
                    <div className="event-card" key={event.id}>
                        <img
                            src={event.image}
                            alt={event.title}
                            className="event-image"
                        />
                        <div className="event-details">
                            <h2 className="event-title">{event.title}</h2>
                            <p className="event-description">{event.description}</p>
                            <p className="event-date">Date: {event.date}</p>
                            <p className="event-time">Time: {event.time}</p>
                            <p className="event-venue">Venue: {event.venue}</p>
                            <p className="event-city">City: {event.city}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Events;
