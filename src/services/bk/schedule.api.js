import api from "./api";

export const getScheduleApi = async (groupCode) => {
    try {
        const response = await api.get(`QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${groupCode}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}