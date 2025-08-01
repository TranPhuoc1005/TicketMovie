import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    loading: false,
    data: null,
    error: null,
    detail: [],
}

export const fetchListMovie = createAsyncThunk('listMove/fetchData', async(__dirname, {rejectWithValue}) => {
    try {
        const result = await api.get('/QuanLyPhim/LayDanhSachPhim?maNhom=GP01');
        return result.data.content;
    }catch(error) {
        return rejectWithValue(error);
    }
})

const listMovieSlice = createSlice({
    name: 'listMovieSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchListMovie.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchListMovie.fulfilled, (state, action) => {
            state.loading =false;
            state.data = action.payload;
        });
        builder.addCase(fetchListMovie.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})
export default listMovieSlice.reducer;