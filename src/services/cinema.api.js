import api from "./api"

export const getCinemaApi = async (movieId) => {
    try {
        const response = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

// export const cinemaDetailApi = async (movieId) => {
//     try {
//         const response = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`);
//         return response.data.content;
//     } catch (error) {
//         console.log(error)
//     }
// }

export const getListTheatersApi = async () => {
    try {
        const response = await api.get('QuanLyRap/LayThongTinHeThongRap');
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}

export const getDetailTheatersApi = async (theaterId) => {
    try {
        const response = await api.get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${theaterId}`);
        return response.data.content;
    } catch (error) {
        console.log(error);
    }
}