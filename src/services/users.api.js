import api from "./api";

export const getListUsersApi = async (groupCode) => {
    try {
        const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${groupCode}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}