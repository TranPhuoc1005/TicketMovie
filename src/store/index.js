import { configureStore } from "@reduxjs/toolkit";
import scheduleSlice from './cinemaDetail.js'
import authSlice from './auth.slice.js'

export const store = configureStore({
    reducer: {
        scheduleSlice,
        authSlice
    }
})