import api from "./api";

export const getScheduleApi = async (theaterSystemId, groupCode) => {
    try {
        const response = await api.get(
            `QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${theaterSystemId}&maNhom=${groupCode}`
        );
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
};

export const getSeatListApi = async (scheduleId) => {
    try {
        const response = await api.get(
            `QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${scheduleId}`
        );
        return response.data.content;
    } catch (error) {
        console.log(error);
        return null;
    }
};
