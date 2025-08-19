import { useState, useEffect, useMemo } from 'react';
import { BarChart3, Search, Eye, Users, Calendar, MapPin, Clock, ArrowLeft, PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { getListTheatersApi, getListScheduleTheaterApi } from '../../../services/cinema.api';
import { getSeatListApi } from '../../../services/schedule.api';
import ShowtimeModal from './ShowtimeModal';
import AddShowtimeModal from './AddShowtimeModal';

export default function ShowtimesPage() {
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [seatData, setSeatData] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    // Lấy lịch chiếu của tất cả rạp
    const { data: allScheduleData, isLoading: scheduleLoading, error } = useQuery({
        queryKey: ['allSchedules', groupCode],
        queryFn: async () => {
            if (!theaters?.length) return [];
            
            const promises = theaters.map(theater => 
                getListScheduleTheaterApi(theater.maHeThongRap, groupCode)
                    .catch(error => {
                        console.error(`Error fetching schedule for ${theater.tenHeThongRap}:`, error);
                        return [];
                    })
            );
            
            const results = await Promise.all(promises);
            return results.flat();
        },
        enabled: !!theaters?.length,
        staleTime: 1000 * 60 * 5
    });

    // Lấy thông tin ghế khi chọn lịch chiếu
    const { data: seatInfo, isLoading: seatLoading } = useQuery({
        queryKey: ['seats', selectedSchedule],
        queryFn: () => getSeatListApi(selectedSchedule),
        enabled: !!selectedSchedule,
    });

    // Cập nhật seatData khi có dữ liệu mới
    useEffect(() => {
        if (seatInfo) {
            setSeatData(seatInfo);
        }
    }, [seatInfo]);

    // Xử lý dữ liệu lịch chiếu theo ngày
    const showtimesByDate = useMemo(() => {
        if (!allScheduleData?.length) return [];
        const selectedDateString = selectedDate.toDateString();

        return allScheduleData.flatMap(theater =>
            theater.lstCumRap?.flatMap(cinema =>
                cinema.danhSachPhim?.flatMap(movie =>
                    movie.lstLichChieuTheoPhim
                        ?.filter(showtime => {
                            const showtimeDate = new Date(showtime.ngayChieuGioChieu).toDateString();
                            return showtimeDate === selectedDateString;
                        })
                        .map(showtime => ({
                            maLichChieu: showtime.maLichChieu,
                            tenPhim: movie.tenPhim,
                            hinhAnh: movie.hinhAnh,
                            tenHeThongRap: theater.tenHeThongRap,
                            tenCumRap: cinema.tenCumRap,
                            diaChi: cinema.diaChi,
                            tenRap: showtime.tenRap || 'Không xác định',
                            ngayChieu: new Date(showtime.ngayChieuGioChieu).toLocaleDateString('vi-VN'),
                            gioChieu: new Date(showtime.ngayChieuGioChieu).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            giaVe: showtime.giaVe,
                            maPhim: movie.maPhim,
                            maHeThongRap: theater.maHeThongRap,
                            ngayChieuGioChieu: showtime.ngayChieuGioChieu,
                            maRap: showtime.maRap
                        })) || []
                ) || []
            ) || []
        );
    }, [allScheduleData, selectedDate]);

    // Lọc phim unique
    const uniqueMovies = useMemo(() => {
        const map = new Map();
        showtimesByDate.forEach(item => {
            if (!map.has(item.maPhim)) {
                map.set(item.maPhim, { maPhim: item.maPhim, tenPhim: item.tenPhim });
            }
        });
        return Array.from(map.values());
    }, [showtimesByDate]);

    // Lọc lịch chiếu theo các tiêu chí
    const filteredSchedules = useMemo(() => {
        let filtered = showtimesByDate;

        // Lọc theo rạp được chọn
        if (selectedTheater) {
            filtered = filtered.filter(item => item.maHeThongRap === selectedTheater);
        }

        // Lọc theo phim được chọn
        if (selectedMovie) {
            filtered = filtered.filter(item => String(item.maPhim) === String(selectedMovie));
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                item.tenPhim.toLowerCase().includes(searchLower) ||
                item.tenCumRap.toLowerCase().includes(searchLower) ||
                item.tenHeThongRap.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    }, [showtimesByDate, selectedTheater, selectedMovie, searchTerm]);

    const handleViewSeats = async (scheduleId) => {
        setSelectedSchedule(scheduleId);
    };

    // Tính toán thống kê từ dữ liệu ghế
    const bookedSeats = seatData?.danhSachGhe?.filter(seat => seat.daDat) || [];
    const totalRevenue = bookedSeats.reduce((sum, seat) => sum + seat.giaVe, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency', 
            currency: 'VND'
        }).format(amount);
    };



    const isLoading = theatersLoading || scheduleLoading;

    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý lịch chiếu & đặt vé
                    </h1>
                    <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                            <BarChart3 size={20} className="mr-2" />
                            Xuất báo cáo
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-sky-300 to-blue-300  text-white px-4 py-2 rounded-lg font-bold text-1xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2 cursor-pointer"
                        >
                            <PlusCircle size={20} className="mr-2" />
                            Thêm lịch chiếu
                        </button>
                       
                    </div>
                </div>

                {/* Filters */}
                {!selectedSchedule && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                        <div className="relative flex-1">
                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Tìm theo tên phim, rạp chiếu..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
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
                            <option value="">Tất cả rạp</option>
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
                            disabled={!filteredSchedules.length}
                        >
                            <option value="">Tất cả phim</option>
                            {uniqueMovies.map(movie => (
                                <option key={movie.maPhim} value={movie.maPhim}>
                                    {movie.tenPhim}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Danh sách lịch chiếu</h2>
                    <p className="text-gray-600 mt-1">Chọn lịch chiếu để xem thông tin đặt vé</p>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Phim</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Rạp chiếu</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Ngày/Giờ chiếu</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Địa chỉ</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Giá vé</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchedules.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            {isLoading ? 'Đang tải dữ liệu...' : 
                                                filteredSchedules.length === 0 && showtimesByDate.length > 0 ? 'Không tìm thấy lịch chiếu phù hợp với bộ lọc' :
                                                'Không có lịch chiếu nào trong ngày được chọn'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSchedules.map((schedule) => (
                                        <tr key={schedule.maLichChieu} className="hover:bg-gray-50 border-b border-gray-100">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <img 
                                                        src={schedule.hinhAnh} 
                                                        alt={schedule.tenPhim}
                                                        className="w-12 h-16 object-cover rounded-lg"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{schedule.tenPhim}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-medium text-gray-800">{schedule.tenCumRap}</p>
                                                    <p className="text-sm text-gray-500">{schedule.tenRap}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <Calendar size={16} />
                                                    <span>{schedule.ngayChieu}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                                    <Clock size={16} />
                                                    <span>{schedule.gioChieu}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{schedule.diaChi}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-600">
                                                {formatCurrency(schedule.giaVe)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => openModal(schedule)}
                                                    className="bg-gradient-to-r from-sky-300 to-blue-300 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-nowrap"
                                                >
                                                    <Eye size={16} className="mr-2" />
                                                    Xem ghế
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