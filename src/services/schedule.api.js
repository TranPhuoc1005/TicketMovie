import api from "./api";

export const getScheduleApi = async (scheduleId) => {
    try {
        const response = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${scheduleId}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}