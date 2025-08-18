import { X, Film, Calendar, MapPin, DollarSign, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMoviesApi } from "../../../services/movie.api";
import { getDetailTheatersApi, getListTheatersApi } from "../../../services/cinema.api";
import { createShowtimeApi } from "../../../store/schedule.slice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const schema = z.object({
    maPhim: z.string().nonempty("Vui lòng chọn phim"),
    heThongRap: z.string().nonempty("Vui lòng chọn hệ thống rạp"),
    maCumRap: z.string().nonempty("Vui lòng chọn cụm rạp"),
    ngayChieuGioChieu: z.string()
        .refine(val => dayjs(val).isAfter(dayjs()), { message: "Ngày giờ chiếu phải lớn hơn hiện tại" }),
    giaVe: z.coerce.number()
        .min(75000, "Giá vé từ 75,000 đến 200,000")
        .max(200000, "Giá vé từ 75,000 đến 200,000"),
});

export default function AddShowtimeModal({ isOpen, onClose }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        mode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            maPhim: "",
            heThongRap: "",
            maCumRap: "",
            ngayChieuGioChieu: "",
            giaVe: ""
        }
    });

    const maPhim = watch("maPhim");
    const heThongRap = watch("heThongRap");
    const maCumRap = watch("maCumRap");
    const ngayChieuGioChieu = watch("ngayChieuGioChieu");
    const giaVe = watch("giaVe");

    // Lấy danh sách phim
    const { data: movies } = useQuery({
        queryKey: ["movies"],
        queryFn: () => getMoviesApi("GP01"),
        enabled: isOpen
    });

    // Lấy danh sách hệ thống rạp
    const { data: theaters } = useQuery({
        queryKey: ["theaters"],
        queryFn: getListTheatersApi,
        enabled: isOpen
    });

    // Lấy danh sách cụm rạp theo hệ thống
    const { data: cinemas } = useQuery({
        queryKey: ["cinemas", heThongRap],
        queryFn: () => getDetailTheatersApi(heThongRap),
        enabled: !!heThongRap
    });

    const selectedMovie = movies?.find(m => String(m.maPhim) === String(maPhim));
    const selectedTheater = theaters?.find(t => t.maHeThongRap === heThongRap);
    const selectedCumRap = cinemas?.find(c => c.maCumRap === maCumRap);

    const { mutate: addShowtime } = useMutation({
        mutationFn: createShowtimeApi,
        onSuccess: () => {
            toast.success("Tạo lịch chiếu thành công!");
            setIsSubmitting(false);
            queryClient.invalidateQueries(["schedule"]);
            handleClose();
        },
        onError: (error) => {
            toast.error("Tạo lịch chiếu thất bại!");
            setIsSubmitting(false);
            console.error(error);
        }
    });

    const onSubmitForm = (values) => {
        setIsSubmitting(true);
        const payload = {
            maPhim: Number(values.maPhim),
            ngayChieuGioChieu: dayjs(values.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss"),
            maRap: values.maCumRap, // dùng maCumRap làm maRap
            giaVe: Number(values.giaVe)
        };
        addShowtime(payload);
    };

    const handleClose = () => {
        reset();
        onClose();
    };
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                <Film size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Thêm lịch chiếu</h2>
                                <p className="text-sm text-gray-600">Điền thông tin để thêm lịch chiếu</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-white/50 rounded-lg">
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chọn phim */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Film size={16} className="mr-2 text-blue-500" /> Phim *
                                </label>
                                <select {...register("maPhim")} className={`w-full px-4 py-3 border rounded-xl ${errors.maPhim ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
                                    <option value="">Chọn phim</option>
                                    {movies?.map(movie => (
                                        <option key={movie.maPhim} value={movie.maPhim}>{movie.tenPhim}</option>
                                    ))}
                                </select>
                                {errors.maPhim && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.maPhim.message}</p>}
                            </div>

                            {/* Hệ thống rạp */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <MapPin size={16} className="mr-2 text-purple-500" /> Hệ thống rạp *
                                </label>
                                <select {...register("heThongRap")} className={`w-full px-4 py-3 border rounded-xl ${errors.heThongRap ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
                                    <option value="">Chọn hệ thống rạp</option>
                                    {theaters?.map(theater => (
                                        <option key={theater.maHeThongRap} value={theater.maHeThongRap}>{theater.tenHeThongRap}</option>
                                    ))}
                                </select>
                                {errors.heThongRap && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.heThongRap.message}</p>}
                            </div>

                            {/* Cụm rạp */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <MapPin size={16} className="mr-2 text-green-500" /> Cụm rạp *
                                </label>
                                <select {...register("maCumRap")} disabled={!heThongRap} className={`w-full px-4 py-3 border rounded-xl ${errors.maCumRap ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
                                    <option value="">Chọn cụm rạp</option>
                                    {cinemas?.map(cinema => (
                                        <option key={cinema.maCumRap} value={cinema.maCumRap}>{cinema.tenCumRap}</option>
                                    ))}
                                </select>
                                {errors.maCumRap && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.maCumRap.message}</p>}
                            </div>

                            {/* Ngày giờ chiếu */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="mr-2 text-orange-500" /> Ngày & giờ chiếu *
                                </label>
                                <input type="datetime-local" {...register("ngayChieuGioChieu")} min={dayjs().format("YYYY-MM-DDTHH:mm")} className={`w-full px-4 py-3 border rounded-xl ${errors.ngayChieuGioChieu ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
                                {errors.ngayChieuGioChieu && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.ngayChieuGioChieu.message}</p>}
                            </div>

                            {/* Giá vé */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign size={16} className="mr-2 text-yellow-500" /> Giá vé (VNĐ) *
                                </label>
                                <input type="number" {...register("giaVe")} placeholder="85000" className={`w-full px-4 py-3 border rounded-xl ${errors.giaVe ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
                                {errors.giaVe && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.giaVe.message}</p>}
                            </div>
                        </div>

                        {/* Preview */}
                        {(selectedMovie || selectedTheater || selectedCumRap || ngayChieuGioChieu || giaVe) && (
                            <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
                                <h4 className="font-medium text-gray-700">Thông tin lịch chiếu:</h4>
                                {selectedMovie && <div className="flex items-center gap-2"><Film size={16} className="text-blue-600" /> <span className="font-medium">{selectedMovie.tenPhim}</span></div>}
                                {selectedTheater && <div className="flex items-center gap-2"><MapPin size={16} className="text-purple-600" /> <span>{selectedTheater.tenHeThongRap}</span></div>}
                                {selectedCumRap && <div className="flex items-center gap-2"><MapPin size={16} className="text-green-600" /> <span>{selectedCumRap.tenCumRap}</span></div>}
                                {ngayChieuGioChieu && <div className="flex items-center gap-2"><Calendar size={16} className="text-orange-600" /> <span>{dayjs(ngayChieuGioChieu).format("DD/MM/YYYY HH:mm")}</span></div>}
                                {giaVe && <div><strong>Giá vé:</strong> {Number(giaVe).toLocaleString()} VNĐ</div>}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            <button type="button" onClick={handleClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50" disabled={isSubmitting}>Hủy</button>
                            <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-gradient-to-r from-sky-300 to-blue-300  text-white rounded-xl flex items-center gap-2">
                                {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {isSubmitting ? "Đang tạo..." : "Tạo lịch chiếu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
