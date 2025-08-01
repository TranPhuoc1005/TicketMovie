import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../services/api";

const initialState = {
    cinemas: null,
    error: null,
}

export const fetchListCinema = createAsyncThunk('listCinema/fetchData', async(__dirname, {rejectWithValue}) => {
    try{
        const result = await api.get('QuanLyRap/LayThongTinHeThongRap');
        return result.data.content
    }catch(error) {
        return rejectWithValue(error);
    }
});

const listCinemaSlice = createSlice({
    name: 'listCinemaSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchListCinema.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchListCinema.fulfilled, (state, action) => {
            state.loading = false;
            state.cinemas = action.payload;
        });
        builder.addCase(fetchListCinema.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default listCinemaSlice.reducer;