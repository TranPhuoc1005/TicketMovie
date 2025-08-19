import api from '../services/api'

const addUserApi = async (userData) => {
    try {
        const response = await api.post('QuanLyNguoiDung/ThemNguoiDung', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const updateUserApi = async (userData) => {
    try {
        const response = await api.put('QuanLyNguoiDung/CapNhatThongTinNguoiDung', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const deleteUserApi = async (taiKhoan) => {
    try {
        const response = await api.delete(`QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const getUserDetailApi = async (taiKhoan) => {
    try {
        const response = await api.post('QuanLyNguoiDung/ThongTinTaiKhoan', { taiKhoan });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const getListUsersApi = async (maNhom) => {
    try {
        const response = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`);
        return response.data.content;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export { addUserApi, updateUserApi, deleteUserApi, getUserDetailApi, getListUsersApi };