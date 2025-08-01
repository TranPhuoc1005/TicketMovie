import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

const initialState = {
    user: null,
    loading: false,
    error: null
}

export const loginUser = createAsyncThunk('auth/login', async(loginData, {rejectWithValue}) => {
    try {
        const result = await api.post('QuanLyNguoiDung/DangNhap', loginData);
        console.log(result);
        return result.data.content;
    } catch (error) {
        const message = error?.response?.data?.content || error.message || "Đăng nhập thất bại";
        return rejectWithValue(message); // ✅ Trả chuỗi thuần
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        loadUserFromStorage: (state) => {
            const stored = localStorage.getItem('user');
            if(stored) {
                state.user = JSON.parse(stored);
            }
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})


export const {logout, loadUserFromStorage} = authSlice.actions;
export default authSlice.reducer;
