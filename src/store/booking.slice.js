import api from '../services/api'


export const bookingTicketApi = async (bookingData) => {
    try {
        const response = await api.post('QuanLyDatVe/DatVe', bookingData);
        return response.data.content;
    } catch (error) {
        console.error(error);
    }
};