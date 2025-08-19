import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../services/api";

const initialState = {
    schedule: null,
    error: null,
}

export const fetchSchedule = createAsyncThunk('schedule/fetchData', async(maPhim, {rejectWithValue}) => {
    try{
        const result = await api.get('QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP01');
        return result.data.content
    }catch(error) {
        return rejectWithValue(error);
    }
});

const scheduleSlice = createSlice({
    name: 'scheduleSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchSchedule.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchSchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.schedule = action.payload;
        });
        builder.addCase(fetchSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default scheduleSlice.reducer;