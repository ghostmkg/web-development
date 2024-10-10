import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
    name: 'movie',
    initialState: {
        movieDetails: null,
        bookingDetails: {
            seats: 1,
            date: '',
            time: '',
        }
    },
    reducers: {
        setMovieDetails: (state, action) => {
            state.movieDetails = action.payload;
        },
        setBookingDetails: (state, action) => {
            state.bookingDetails = action.payload;
        }
    }
});

export const { setMovieDetails, setBookingDetails } = movieSlice.actions;

export default movieSlice.reducer;
