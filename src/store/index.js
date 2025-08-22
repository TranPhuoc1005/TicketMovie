import { configureStore } from "@reduxjs/toolkit";
import authSlice from './auth.slice.js'

export const store = configureStore({
    reducer: {
        authSlice
    }
})