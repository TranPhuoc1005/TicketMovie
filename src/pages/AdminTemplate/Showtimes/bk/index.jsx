// ShowtimesPage.jsx
import { Calendar, Clock, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getListTheatersApi } from '../../../services/cinema.api';
import { getScheduleTicket, getTicketApi } from '../../../services/ticket.api';

// Flow sẽ như vầy 
// * Cần maLichChieu
// 1: Lấy thông tin hệ thống rạp -> API QuanLyRap/LayThongTinHeThongRap -> sẽ có [maHeThongRap]
// 2: Sau đó sử dụng [maHeThongRap] để lấy thông tin lịch chiếu của hệ thống rạp


export default function ShowtimesPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');

    //============================== Lấy danh sách hệ thống rạp
    const { data: theaterSystems } = useQuery({
        queryKey: ['list-theaters'],
        queryFn: () => getListTheatersApi()
    });

    //============================== Lấy tất cả lịch chiếu từ hệ thống rạp API : QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom="GP01"
    const { data: allScheduleData, isLoading, error } = useQuery({
        queryKey: ['all-schedule-tickets', 'GP01'],
        queryFn: () => getScheduleTicket('GP01'),
        staleTime: 2 * 60 * 1000, // Cache 2 phút
        onError: (error) => {
            console.log(error);
        }
    });
    
    const transformedShowtimes = useMemo(() => {
        if (!allScheduleData || !Array.isArray(allScheduleData)) return [];
        const showtimes = [];
        let showtimeId = 1;

        //============================== API trả về danh sách của hệ thống rạp
        allScheduleData.forEach(theaterSystem => {
            if (!theaterSystem?.lstCumRap || !Array.isArray(theaterSystem.lstCumRap)) return;
            //============================== Từ danh sách hệ thống rạp lấy danh sách cụm 
            theaterSystem.lstCumRap.forEach(cinemaCluster => {
                if (!cinemaCluster?.danhSachPhim || !Array.isArray(cinemaCluster.danhSachPhim)) return;
                //============================== Từ danh sách cụm lấy danh sách phim có chiếu trong cụm đó
                cinemaCluster.danhSachPhim.forEach(movie => {
                    if (!movie?.lstLichChieuTheoPhim || !Array.isArray(movie.lstLichChieuTheoPhim)) return;
                    //============================== Từ danh sách phim trong cụm đó sẽ lấy được mã phim API : QuanLyRap/LayThongTinLichChieuPhim
                    movie.lstLichChieuTheoPhim.forEach(schedule => {
                        try {
                            if (!schedule?.ngayChieuGioChieu || !schedule?.maLichChieu) return;
                            
                            // format data lịch trong api : "2025-01-18T14:30:00"
                            let scheduleDate;
                            let displayTime = '00:00';
                            if (schedule.ngayChieuGioChieu.includes('T')) {
                                scheduleDate = new Date(schedule.ngayChieuGioChieu);
                                const timeStr = schedule.ngayChieuGioChieu.split('T')[1] || '00:00:00';
                                const [hours, minutes] = timeStr.split(':');
                                displayTime = `${hours || '00'}:${minutes || '00'}`;
                            } else {
                                const [day, month, year] = schedule.ngayChieuGioChieu.split('/');
                                if (!day || !month || !year) return;
                                scheduleDate = new Date(year, month - 1, day);
                            }
                            
                            // Lọc theo ngày được chọn
                            const selectedDateStr = selectedDate.toISOString().split('T')[0];
                            const scheduleDateStr = scheduleDate.toISOString().split('T')[0];

                            
                            if (scheduleDateStr === selectedDateStr) {
                                showtimes.push({
                                    id: showtimeId++,
                                    movie: movie.tenPhim || 'Chưa có tên phim',
                                    movieId: movie.maPhim || 0,
                                    movieImage: movie.hinhAnh || '',
                                    theater: `${theaterSystem.tenHeThongRap || 'Chưa có tên rạp'} - ${cinemaCluster.tenCumRap || 'Chưa có tên cụm'}`,
                                    theaterSystem: theaterSystem.tenHeThongRap || 'Chưa có tên hệ thống',
                                    theaterCluster: cinemaCluster.tenCumRap || 'Chưa có tên cụm',
                                    theaterAddress: cinemaCluster.diaChi || '',
                                    room: schedule.tenRap || 'Chưa có tên phòng',
                                    date: scheduleDateStr,
                                    time: displayTime,
                                    scheduleId: schedule.maLichChieu,
                                    price: 'Đang tải...',
                                    availableSeats: 'Đang tải...',
                                    totalSeats: 'Đang tải...',
                                    isLoadingDetails: true
                                });
                            }
                        } catch (error) {
                            console.log('Error processing schedule:', error, schedule);
                        }
                    });
                });
            });
        });

        return showtimes;
    }, [allScheduleData, selectedDate]);

    // Lấy thông tin chi tiết ghế cho từng suất chiếu
    const { data: detailedShowtimes } = useQuery({
        queryKey: ['detailed-showtimes', transformedShowtimes.map(s => s.scheduleId).slice(0, 15)],
        queryFn: async () => {
            // Giới hạn 15 requests đầu tiên để tránh quá tải
            const limitedShowtimes = transformedShowtimes.slice(0, 15);
            
            const detailPromises = limitedShowtimes.map(async (showtime) => {
                try {
                    const ticketInfo = await getTicketApi(showtime.scheduleId);
                    
                    if (ticketInfo?.danhSachGhe) {
                        const totalSeats = ticketInfo.danhSachGhe.length;
                        const availableSeats = ticketInfo.danhSachGhe.filter(seat => !seat.daDat).length;
                        const sampleSeat = ticketInfo.danhSachGhe[0];
                        
                        return {
                            ...showtime,
                            price: sampleSeat?.giaVe || 75000,
                            availableSeats,
                            totalSeats,
                            isLoadingDetails: false,
                            // Thông tin thêm từ API
                            movieFromSchedule: ticketInfo.thongTinPhim?.tenPhim,
                            theaterFromSchedule: ticketInfo.thongTinPhim?.tenCumRap,
                            roomFromSchedule: ticketInfo.thongTinPhim?.tenRap,
                        };
                    }
                    
                    return {
                        ...showtime,
                        price: 75000, // Default
                        availableSeats: 0,
                        totalSeats: 0,
                        isLoadingDetails: false
                    };
                } catch (error) {
                    console.log(`Error fetching details for schedule ${showtime.scheduleId}:`, error);
                    return {
                        ...showtime,
                        price: 75000,
                        availableSeats: 0,
                        totalSeats: 120,
                        isLoadingDetails: false
                    };
                }
            });

            return Promise.all(detailPromises);
        },
        enabled: transformedShowtimes.length > 0,
        staleTime: 3 * 60 * 1000,
    });

    const finalShowtimes = useMemo(() => {
        if (!detailedShowtimes) return transformedShowtimes;
        
        return transformedShowtimes.map(showtime => {
            const detailedShowtime = detailedShowtimes.find(d => d.scheduleId === showtime.scheduleId);
            return detailedShowtime || showtime;
        });
    }, [transformedShowtimes, detailedShowtimes]);


    // Lọc theo theater và movie
    const filteredShowtimes = useMemo(() => {
        return finalShowtimes.filter(showtime => {
            const matchTheater = !selectedTheater || showtime.theaterSystem.includes(
                theaterSystems?.find(t => t.maHeThongRap === selectedTheater)?.tenHeThongRap
            );
            const matchMovie = !selectedMovie || showtime.movie.toLowerCase().includes(selectedMovie.toLowerCase());
            
            return matchTheater && matchMovie;
        });
    }, [finalShowtimes, selectedTheater, selectedMovie, theaterSystems]);


    //============================== Lấy danh sách unique movies để làm filter
    const uniqueMovies = useMemo(() => {
        const movies = new Set(finalShowtimes.map(s => s.movie));
        return Array.from(movies).sort();
    }, [finalShowtimes]);

    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý lịch chiếu
                    </h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                        <PlusCircle size={20} className="mr-2" />
                        Thêm lịch chiếu
                    </button>
                </div>

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
                        value={selectedTheater}
                        onChange={(e) => setSelectedTheater(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả rạp</option>
                        {theaterSystems?.map(theater => (
                            <option key={theater.maHeThongRap} value={theater.maHeThongRap}>
                                {theater.tenHeThongRap}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={selectedMovie}
                        onChange={(e) => setSelectedMovie(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả phim</option>
                        {uniqueMovies.map(movie => (
                            <option key={movie} value={movie}>
                                {movie}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Tìm thấy <strong>{filteredShowtimes.length}</strong> suất chiếu
                    {isLoading && <span className="ml-2">- Đang tải...</span>}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Phim","Rạp chiếu", "Phòng","Ngày/Giờ","Giá vé","Ghế trống","Thao tác"].map((title) => (
                                    <th key={title} className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShowtimes.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        Không có suất chiếu nào cho ngày đã chọn
                                    </td>
                                </tr>
                            ) : (
                                filteredShowtimes.map((showtime) => (
                                    <tr
                                        key={showtime.id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                                            <div className="flex items-center">
                                                {showtime.movieImage && (
                                                    <img 
                                                        src={showtime.movieImage} 
                                                        alt={showtime.movie}
                                                        className="w-12 h-16 object-cover rounded mr-3"
                                                    />
                                                )}
                                                <div className="font-medium text-gray-800">
                                                    {showtime.movie}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                                            <div className="text-sm">
                                                <div className="font-medium">{showtime.theaterSystem}</div>
                                                <div className="text-gray-500">{showtime.theaterCluster}</div>
                                                {showtime.theaterAddress && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {showtime.theaterAddress}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                                            {showtime.room}
                                        </td>
                                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                                            <div className="text-gray-800">
                                                <div className="font-medium">
                                                    {new Date(showtime.date).toLocaleDateString('vi-VN')}
                                                </div>
                                                <div className="text-sm text-gray-600 flex items-center">
                                                    <Clock size={14} className="mr-1" />
                                                    {showtime.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 font-medium">
                                            {showtime.isLoadingDetails ? (
                                                <span className="text-gray-400">Đang tải...</span>
                                            ) : (
                                                `${typeof showtime.price === 'number' 
                                                    ? showtime.price.toLocaleString() 
                                                    : showtime.price
                                                }₫`
                                            )}
                                        </td>
                                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                                            <div className="text-sm">
                                                {showtime.isLoadingDetails ? (
                                                    <span className="text-gray-400">Đang tải...</span>
                                                ) : (
                                                    <>
                                                        <span
                                                            className={`font-medium ${
                                                                showtime.availableSeats < 20
                                                                    ? "text-red-600"
                                                                    : "text-green-600"
                                                            }`}
                                                        >
                                                            {showtime.availableSeats}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            /{showtime.totalSeats}
                                                        </span>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    showtime.availableSeats < 20
                                                                        ? "bg-red-500"
                                                                        : "bg-green-500"
                                                                }`}
                                                                style={{
                                                                    width: showtime.totalSeats > 0 ? `${
                                                                        (showtime.availableSeats /
                                                                            showtime.totalSeats) *
                                                                        100
                                                                    }%` : '0%',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 sm:py-4 sm:px-6">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
                                                    title={`Xem chi tiết - Mã lịch chiếu: ${showtime.scheduleId}`}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded cursor-pointer"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}