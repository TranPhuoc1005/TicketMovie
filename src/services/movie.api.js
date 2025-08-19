import api from "./api";

export const getMoviesApi = async (groupCode = "GP01") => {
    try {
        const res = await api.get(`QuanLyPhim/LayDanhSachPhim?maNhom=${groupCode}`);
        return res.data.content;
    } catch (error) {
        console.log(error);
    }
};

export const getListMovieApi = async (groupCode, numberOfPages, numberOfElementsOnPage) => {
    try {
        const response = await api.get(`QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=${groupCode}&soTrang=${numberOfPages}&soPhanTuTrenTrang=${numberOfElementsOnPage}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const getMovieDetailsApi = async (movieId) => {
    try {
        const response = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${movieId}`);
        console.log(response)
        return response.data.content;
    } catch (error) {
        console.log(error)
    }
}

export const addMovieApi = async (formData) => {
    try {
        const response = await api.post('QuanLyPhim/ThemPhimUploadHinh', formData);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const deleteMovieApi = async (maPhim) => {
    try {
        const response = await api.delete(`QuanLyPhim/XoaPhim?MaPhim=${maPhim}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const updateMovieApi = async (formData) => {
    try {
        const response = await api.post("QuanLyPhim/CapNhatPhimUpload", formData);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}
