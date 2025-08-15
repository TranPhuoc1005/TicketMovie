import api from "./api"

export const loginApi = async (values) => {
    try {
        const response = await api.post('/QuanLyNguoiDung/DangNhap',values);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const registerApi = async (values) => {
    try {
        const response = await api.post('/QuanLyNguoiDung/DangKy', values);
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}