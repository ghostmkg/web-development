import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './slices/ticketSlice';

const store = configureStore({
    reducer: {
        ticket: ticketReducer,
    },
});

export default store;
