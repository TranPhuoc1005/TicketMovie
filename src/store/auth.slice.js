import { createSlice } from "@reduxjs/toolkit";

const userLocal = localStorage.getItem('user');
const initialState = {
    user: userLocal ? JSON.parse(userLocal) : null
}

const authSlice = createSlice ({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    }
})

export default authSlice.reducer;
export const { setUser, clearUser } = authSlice.actions;