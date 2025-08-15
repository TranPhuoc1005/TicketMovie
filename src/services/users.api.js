import api from "./api";

export const getListUsersApi = async (groupCode) => {
    try {
        const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${groupCode}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const getListUsersPaginationApi = async (groupCode, numberOfPages, numberOfElementsOnPage) => {
    try {
        const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang?MaNhom=${groupCode}&soTrang=${numberOfPages}&soPhanTuTrenTrang=${numberOfElementsOnPage}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const getBookingHistoryApi = async (taiKhoan) => {
    try {
        const response = await api.post('QuanLyNguoiDung/ThongTinTaiKhoan', {
            taiKhoan: taiKhoan
        });
        return response.data.content;
    } catch (error) {
        console.error(error);
    }
};

