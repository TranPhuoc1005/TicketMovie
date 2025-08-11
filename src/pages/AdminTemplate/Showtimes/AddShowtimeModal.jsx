import { X, Calendar, Film, MapPin } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getMoviesApi } from "../../../services/movie.api";
import { getDetailTheatersApi, getListTheatersApi } from "../../../services/cinema.api";
import { createShowtimeWithCheck } from "../../../services/schedule.api";

export default function AddShowtimeModal({ isOpen, onClose }) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        maPhim: "",
        heThongRap: "",
        maCumRap: "",
        maRap: "",
        ngayChieuGioChieu: "",
        giaVe: ""
    });
    const [errorMsg, setErrorMsg] = useState("");

    const { data: movies } = useQuery({
        queryKey: ["movies"],
        queryFn: () => getMoviesApi(),
        enabled: isOpen
    });

    const { data: theaters } = useQuery({
        queryKey: ["theaters"],
        queryFn: getListTheatersApi,
        enabled: isOpen
    });

    const { data: cinemas } = useQuery({
        queryKey: ["cinemas", formData.heThongRap],
        queryFn: () => getDetailTheatersApi(formData.heThongRap),
        enabled: !!formData.heThongRap
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === "heThongRap") {
                return { ...prev, heThongRap: value, maCumRap: "", maRap: "" };
            }
            if (name === "maCumRap") {
                return { ...prev, maCumRap: value, maRap: "" };
            }
            if (name === "maRap") {
                if (!prev.maCumRap) {
                    alert("Vui lòng chọn cụm rạp trước!");
                    return prev;
                }
                return { ...prev, maRap: value };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleDateTimeChange = (e) => {
        const rawValue = e.target.value;
        setFormData(prev => ({
            ...prev,
            ngayChieuGioChieu: rawValue
        }));
    };


    const validateForm = () => {
        if (!formData.maPhim) return "Vui lòng chọn phim";
        if (!formData.heThongRap) return "Vui lòng chọn hệ thống rạp";
        if (!formData.maCumRap) return "Vui lòng chọn cụm rạp";
        if (!formData.maRap) return "Vui lòng chọn phòng chiếu";
        if (!formData.ngayChieuGioChieu) return "Vui lòng chọn ngày giờ chiếu";

        const selectedDate = new Date(formData.ngayChieuGioChieu);
        if (selectedDate <= new Date()) return "Ngày giờ chiếu phải lớn hơn hiện tại";

        const price = Number(formData.giaVe);
        if (!price || price < 75000 || price > 200000) return "Giá vé từ 75,000 đến 200,000";

        const movieExists = movies?.find(m => String(m.maPhim) === String(formData.maPhim));
        if (!movieExists) return "Phim được chọn không tồn tại";

        const selectedCumRap = cinemas?.find(c => c.maCumRap === formData.maCumRap);
        const rapExists = selectedCumRap?.danhSachRap?.find(r => String(r.maRap) === String(formData.maRap));
        if (!rapExists) return "Phòng chiếu không thuộc cụm rạp được chọn";

        return null;
    };


    const debugCheckData = async () => {
        try {
            const movieExists = movies?.find(m => m.maPhim == formData.maPhim);
            console.log("Movie exists:", movieExists);
            const rapExists = cinemas?.flatMap(c => c.danhSachRap)?.find(r => r.maRap == formData.maRap);
            console.log("Rap exists:", rapExists);
            const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            console.log("User:", user);
            console.log("User type:", user?.maLoaiNguoiDung);
        } catch (error) {
            console.error("Debug error:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            setErrorMsg(error);
            return;
        }

        setErrorMsg("");

        console.log("DEBUG before submit:");
        console.log("formData:", JSON.parse(JSON.stringify(formData)));
        console.log("cinemas (detail):", JSON.parse(JSON.stringify(cinemas)));

        const selectedCumRap = cinemas?.find(c => c.maCumRap === formData.maCumRap);
        console.log("selectedCumRap object:", JSON.parse(JSON.stringify(selectedCumRap)));
        console.log("selectedCumRap.danhSachRap:", JSON.parse(JSON.stringify(selectedCumRap?.danhSachRap)));

        const rapExists = selectedCumRap?.danhSachRap?.some(r => String(r.maRap) === String(formData.maRap));
        if (!rapExists) {
            setErrorMsg("Phòng chiếu không thuộc cụm rạp đã chọn (kiểm tra lại).");
            return;
        }

        await debugCheckData();

        try {
            const formattedDate = dayjs(formData.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss");

            const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            if (!user || !user.accessToken) {
                throw new Error("Vui lòng đăng nhập lại");
            }
            if (user.maLoaiNguoiDung !== 'QuanTri') {
                throw new Error("Bạn không có quyền tạo lịch chiếu");
            }

            const payload = {
                maPhim: Number(formData.maPhim),
                ngayChieuGioChieu: formattedDate,
                maRap: String(formData.maRap),
                giaVe: Number(formData.giaVe)
            };

            console.log("=== FINAL PAYLOAD DEBUG ===");
            console.log("Payload (will be sent):", payload);
            console.log("Payload JSON.stringify:", JSON.stringify(payload));

            const result = await createShowtimeWithCheck(payload);

            if (result && result.statusCode === 200) {
                alert("Tạo lịch chiếu thành công!");
                queryClient.invalidateQueries(["schedule"]);
                setFormData({
                    maPhim: "",
                    heThongRap: "",
                    maCumRap: "",
                    maRap: "",
                    ngayChieuGioChieu: "",
                    giaVe: ""
                });
                onClose();
            } else {
                throw new Error(result?.message || "Lỗi không xác định từ server");
            }
        } catch (error) {
            console.error("Lỗi tạo lịch chiếu (final):", error);
            setErrorMsg(error.message || "Có lỗi xảy ra khi tạo lịch chiếu");
        }
    };



    if (!isOpen) return null;

    const selectedMovie = movies?.find(m => String(m.maPhim) === String(formData.maPhim));
    const selectedCumRap = cinemas?.find(c => c.maCumRap === formData.maCumRap);
    const selectedCinema = selectedCumRap?.danhSachRap?.find(r => r.maRap === formData.maRap);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Thêm lịch chiếu</h2>

                {errorMsg && (
                    <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Chọn phim */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Phim *</label>
                        <select
                            name="maPhim"
                            value={formData.maPhim}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn phim</option>
                            {movies?.map(movie => (
                                <option key={movie.maPhim} value={movie.maPhim}>
                                    {movie.tenPhim}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hệ thống rạp */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Hệ thống rạp *</label>
                        <select
                            name="heThongRap"
                            value={formData.heThongRap}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn hệ thống rạp</option>
                            {theaters?.map(theater => (
                                <option key={theater.maHeThongRap} value={theater.maHeThongRap}>
                                    {theater.tenHeThongRap}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cụm rạp */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Cụm rạp *</label>
                        <select
                            name="maCumRap"
                            value={formData.maCumRap}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={!formData.heThongRap}
                        >
                            <option value="">Chọn cụm rạp</option>
                            {cinemas?.map(cinema => (
                                <option key={cinema.maCumRap} value={cinema.maCumRap}>
                                    {cinema.tenCumRap}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Phòng chiếu */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Phòng chiếu *</label>
                        <select
                            name="maRap"
                            value={formData.maRap}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={!formData.maCumRap}
                        >
                            <option value="">Chọn phòng chiếu</option>
                            {selectedCumRap?.danhSachRap?.map(rap => (
                                <option key={rap.maRap} value={rap.maRap}>
                                    {rap.tenRap}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ngày giờ chiếu */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày & giờ chiếu *</label>
                        <input
                            type="datetime-local"
                            name="ngayChieuGioChieu"
                            value={formData.ngayChieuGioChieu}
                            onChange={handleDateTimeChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min={dayjs().format("YYYY-MM-DDTHH:mm")}
                        />
                    </div>

                    {/* Giá vé */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá vé (VNĐ) *</label>
                        <input
                            type="number"
                            name="giaVe"
                            value={formData.giaVe}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="75000"
                            max="200000"
                            placeholder="Ví dụ: 85000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Giá vé từ 75,000 đến 200,000 VNĐ</p>
                    </div>

                    {/* Preview */}
                    {(selectedMovie || selectedCumRap || selectedCinema || formData.ngayChieuGioChieu || formData.giaVe) && (
                        <div className="border rounded p-3 bg-gray-50 space-y-2">
                            <h4 className="font-medium text-gray-700">Thông tin lịch chiếu:</h4>
                            {selectedMovie && (
                                <div className="flex items-center space-x-2">
                                    <Film size={16} className="text-blue-600" />
                                    <span className="font-medium">{selectedMovie.tenPhim}</span>
                                </div>
                            )}
                            {selectedCumRap && (
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-purple-600" />
                                    <span>{selectedCumRap.tenCumRap}</span>
                                </div>
                            )}
                            {selectedCinema && (
                                <div className="flex items-center space-x-2">
                                    <MapPin size={16} className="text-gray-600" />
                                    <span>{selectedCinema.tenRap}</span>
                                </div>
                            )}
                            {formData.ngayChieuGioChieu && (
                                <div className="flex items-center space-x-2">
                                    <Calendar size={16} className="text-green-600" />
                                    <span>{dayjs(formData.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm")}</span>
                                </div>
                            )}
                            {formData.giaVe && (
                                <div><strong>Giá vé:</strong> {Number(formData.giaVe).toLocaleString()} VNĐ</div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Tạo lịch chiếu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
