import api from "./api"

export const getTicketApi = async (scheduleId) => {
    try {
        const response = await api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${scheduleId}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const getScheduleTicket = async (systemCinemaId,groupCode) => {
    try {
        const response = await api.get(`QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${systemCinemaId}&maNhom=${groupCode}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}