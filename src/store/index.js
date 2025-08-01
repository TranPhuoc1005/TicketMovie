import { configureStore } from "@reduxjs/toolkit";
import listMovieSlice from '../pages/HomeTemplate/ListMoviePage/slice.js'
import listCinemaSlice from './cinema.js'
import scheduleSlice from './cinemaDetail.js'
import ticketScheduleSlice from './ticket.js'
import authSlice from './auth.js'

export const store = configureStore({
    reducer: {
        listMovieSlice,
        listCinemaSlice,
        scheduleSlice,
        ticketSchedule: ticketScheduleSlice,
        auth: authSlice
    }
})