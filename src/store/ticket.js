import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../services/api";

const initialState = {
    ticketSchedule: null,
    loading: false,
    error: null,
}

export const fetchTicketSchedule = createAsyncThunk('ticket/fetchSchedule', async(maLichChieu, {rejectWithValue}) => {
    try{
        const result = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`);
        return result.data.content;
    }catch(error) {
        return rejectWithValue(error);
    }
});

const ticketScheduleSlice = createSlice({
    name: 'ticketSlice',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchTicketSchedule.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchTicketSchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.ticketSchedule = action.payload;
        });
        builder.addCase(fetchTicketSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default ticketScheduleSlice.reducer;