import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
    name: 'ticket',
    initialState: {
        movie: null,   // Ensure `movie` is defined in initialState
        seats: 1,
        date: '',
        time: ''
    },
    reducers: {
        setTicketDetails: (state, action) => {
            const { movie, seats, date, time } = action.payload;
            state.movie = movie;
            state.seats = seats;
            state.date = date;
            state.time = time;
        }
    }
});

export const { setTicketDetails } = ticketSlice.actions;

export default ticketSlice.reducer;
