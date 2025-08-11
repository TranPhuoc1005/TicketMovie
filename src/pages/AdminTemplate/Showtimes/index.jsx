import { Calendar, Clock, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ShowtimeModal from './ShowtimeModal';
import { getListScheduleTheaterApi, getListTheatersApi } from '../../../services/cinema.api';
import AddShowtimeModal from './AddShowtimeModal';

export default function ShowtimesPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const groupCode = 'GP01';

    const openModal = (showtime) => {
        setSelectedShowtime(showtime);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedShowtime(null);
    };

    // Lấy danh sách hệ thống rạp
    const { data: theaters, isLoading: theatersLoading } = useQuery({
        queryKey: ['theaters'],
        queryFn: getListTheatersApi,
        staleTime: 1000 * 60 * 10 
    });

    // Lấy lịch chiếu theo rạp và group code
    const { data: scheduleData, isLoading: scheduleLoading, error } = useQuery({
        queryKey: ['schedule', selectedTheater, groupCode],
        queryFn: () => getListScheduleTheaterApi(selectedTheater, groupCode),
        enabled: !!selectedTheater, 
        staleTime: 1000 * 60 * 5 
    });

    const showtimesByDate = useMemo(() => {
        if (!scheduleData) return [];
        const selectedDateString = selectedDate.toDateString();

        return scheduleData.flatMap(theater =>
            theater.lstCumRap?.flatMap(cinema =>
                cinema.danhSachPhim?.flatMap(movie =>
                    movie.lstLichChieuTheoPhim
                        ?.filter(showtime => {
                            const showtimeDate = new Date(showtime.ngayChieuGioChieu).toDateString();
                            return showtimeDate === selectedDateString;
                        })
                        .map(showtime => ({
                            id: showtime.maLichChieu,
                            movie: movie.tenPhim,
                            theater: theater.tenHeThongRap,
                            cinema: cinema.tenCumRap,
                            room: showtime.tenRap || 'Không xác định',
                            date: new Date(showtime.ngayChieuGioChieu).toLocaleDateString('vi-VN'),
                            time: new Date(showtime.ngayChieuGioChieu).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            price: showtime.giaVe,
                            movieCode: movie.maPhim,
                            theaterCode: theater.maHeThongRap,
                            ngayChieuGioChieu: showtime.ngayChieuGioChieu,
                            maRap: showtime.maRap
                        })) || []
                ) || []
            ) || []
        );
    }, [scheduleData, selectedDate]);

    const uniqueMovies = useMemo(() => {
        const map = new Map();
        showtimesByDate.forEach(item => {
            if (!map.has(item.movieCode)) {
                map.set(item.movieCode, { code: item.movieCode, name: item.movie });
            }
        });
        return Array.from(map.values());
    }, [showtimesByDate]);

    const filteredShowtimes = useMemo(() => {
        if (!selectedMovie) return showtimesByDate;
        return showtimesByDate.filter(item => String(item.movieCode) === String(selectedMovie));
    }, [showtimesByDate, selectedMovie]);

    const isLoading = theatersLoading || scheduleLoading;

    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý lịch chiếu</h1>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer"
                    >
                        <PlusCircle size={20} className="mr-2" />
                        Thêm lịch chiếu
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            locale={vi}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholderText="Chọn ngày"
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={selectedTheater}
                        onChange={(e) => setSelectedTheater(e.target.value)}
                        disabled={theatersLoading}
                    >
                        <option value="">Chọn rạp</option>
                        {theaters?.map(theater => (
                            <option key={theater.maHeThongRap} value={theater.maHeThongRap}>
                                {theater.tenHeThongRap}
                            </option>
                        ))}
                    </select>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={selectedMovie}
                        onChange={(e) => setSelectedMovie(e.target.value)}
                        disabled={!filteredShowtimes.length}
                    >
                        <option value="">Tất cả phim</option>
                        {uniqueMovies.map(movie => (
                            <option key={movie.code} value={movie.code}>
                                {movie.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Phim", "Hệ thống rạp", "Cụm rạp", "Phòng chiếu", "Ngày/Giờ", "Giá vé", "Thao tác"].map(title => (
                                        <th key={title} className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">{title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShowtimes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            {selectedTheater ? 'Không có lịch chiếu nào trong ngày được chọn' : 'Vui lòng chọn rạp để xem lịch chiếu'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredShowtimes.map(showtime => (
                                        <tr key={showtime.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-800">{showtime.movie}</td>
                                            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">{showtime.theater}</td>
                                            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">{showtime.cinema}</td>
                                            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">{showtime.room}</td>
                                            <td className="py-3 px-4 sm:py-4 sm:px-6">
                                                <div className="font-medium">{showtime.date}</div>
                                                <div className="text-sm text-gray-600 flex items-center">
                                                    <Clock size={14} className="mr-1" />{showtime.time}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">{showtime.price?.toLocaleString()}₫</td>
                                            <td className="py-3 px-4 sm:py-4 sm:px-6">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
                                                    onClick={() => openModal(showtime)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded cursor-pointer">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ShowtimeModal
                showtime={selectedShowtime}
                isOpen={showModal}
                onClose={closeModal}
            />
            <AddShowtimeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
