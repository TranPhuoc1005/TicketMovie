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



export const createShowtimeWithCheck = async ({
    maPhim,
    ngayChieuGioChieu,
    maRap,
    giaVe,
}) => {
    try {
        console.log("Input data:", { maPhim, ngayChieuGioChieu, maRap, giaVe });

        if (!maPhim || !maRap || !giaVe || !ngayChieuGioChieu) {
            throw new Error("Thiếu dữ liệu bắt buộc");
        }

        const buildPayload = (rapValue) => ({
            maPhim: Number(maPhim),
            ngayChieuGioChieu: String(ngayChieuGioChieu),
            maRap: rapValue,
            giaVe: Number(giaVe),
        });

        let payload = buildPayload(String(maRap));
        console.log("Try payload (string maRap):", payload);

        try {
            const response = await api.post(
                "QuanLyDatVe/TaoLichChieu",
                payload
            );
            console.log("API Response (first try):", response.data);
            return response.data;
        } catch (firstErr) {
            console.error(
                "First attempt error response:",
                firstErr.response?.data || firstErr.message
            );

            const respData = firstErr.response?.data;
            const errorContent = respData?.content || respData?.message || "";
            if (
                firstErr.response?.status === 404 &&
                typeof errorContent === "string" &&
                errorContent.includes("Chọn sai cụm rạp")
            ) {
                payload = buildPayload(Number(maRap));
                console.log("Retry payload (number maRap):", payload);
                const retryResp = await api.post(
                    "QuanLyDatVe/TaoLichChieu",
                    payload
                );
                console.log("API Response (retry):", retryResp.data);
                return retryResp.data;
            }

            throw firstErr;
        }
    } catch (err) {
        console.error("=== ERROR CREATE SHOWTIME ===");
        console.error("Error object:", err);

        if (err.response) {
            console.error("Response status:", err.response.status);
            console.error("Response data:", err.response.data);

            const errorMessage =
                err.response.data?.message ||
                err.response.data?.content ||
                "Lỗi không xác định";

            switch (err.response.status) {
                case 400:
                    throw new Error(`Dữ liệu không hợp lệ: ${errorMessage}`);
                case 401:
                    throw new Error("Token đã hết hạn, vui lòng đăng nhập lại");
                case 403:
                    throw new Error(
                        "Bạn không có quyền thực hiện chức năng này"
                    );
                case 404:
                    throw new Error(`Lỗi: ${errorMessage}`);
                case 500:
                    throw new Error(`Lỗi server: ${errorMessage}`);
                default:
                    throw new Error(errorMessage);
            }
        }

        throw new Error(err.message || "Lỗi không xác định");
    }
};
