import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../services/api";

const initialState = {
    cinemaDetail: null,
    error: null,
}

export const fetchCinemaDetail = createAsyncThunk('listCinema/fetchData', async(maPhim, {rejectWithValue}) => {
    try{
        const result = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`);
        return result.data.content
    }catch(error) {
        return rejectWithValue(error);
    }
});

const cinemaDetailSlice = createSlice({
    name: 'cinemaDetailSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCinemaDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCinemaDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.cinemaDetail = action.payload;
        });
        builder.addCase(fetchCinemaDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default cinemaDetailSlice.reducer;