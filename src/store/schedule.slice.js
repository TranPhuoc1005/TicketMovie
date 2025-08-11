import api from "../services/api";

export const createShowtimeApi = async (payload) => {
    try {
        const response = await api.post(`QuanLyDatVe/TaoLichChieu`, payload);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
};