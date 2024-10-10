// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Movieslist from './components/Movieslist';
import HomePage from './components/Homepage';
import LatestMovies from './components/LatestMovies';
import Events from './components/Events';
import Upcoming from './components/Upcoming';
import Bookings from './components/Bookings';
import Trailers from './components/Trailers';
import TicketDetails from './components/Tickets';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Register" element={<Register/>}/>
                <Route path="/Movieslist" element={<Movieslist />} />
                <Route path="/LatestMovies" element={<LatestMovies />} />
                <Route path="/Trailers" element={<Trailers />} />
                <Route path="/Upcoming" element={<Upcoming/>}/>
                <Route path="/Events" element={<Events />} />
                <Route path="/Bookings/:id" element={<Bookings />} />
                <Route path="/TicketDetails" element={<TicketDetails />} />
                <Route path="/Logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
