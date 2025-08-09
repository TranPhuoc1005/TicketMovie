import { useQuery } from '@tanstack/react-query';
import { Edit, MapPin, Trash2 } from 'lucide-react';
import { getDetailTheatersApi, getListScheduleTheaterApi } from '../../../services/cinema.api';
import { useEffect, useMemo, useState } from 'react';
import TheaterDetailModal from './TheaterDetailModal';
import { getScheduleApi } from '../../../services/schedule.api';

export default function Theater(props) {
    const { theater } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seatsByRoom, setSeatsByRoom] = useState({});

    const { data: theaterDetail, isLoading } = useQuery({
        queryKey: ['theater-detail', theater.maHeThongRap],
        queryFn: () => getDetailTheatersApi(theater.maHeThongRap)
    })
    const { data: scheduleTheaterList } = useQuery({
        queryKey: ['list-schedule-theater', theater.maHeThongRap, 'GP01'],
        queryFn: () => getListScheduleTheaterApi(theater.maHeThongRap, 'GP01')
    })

    // Tính tổng số phòng bằng useMemo để tránh re-calculate
    const totalRooms = useMemo(() => {
        if (!theaterDetail) return 0;
        return theaterDetail.reduce((sum, cinemaCluster) => {
            return sum + (cinemaCluster.danhSachRap?.length || 0);
        }, 0);
    }, [theaterDetail]);

    useEffect(() => {
        const fetchSeatsPerRoom = async () => {
            if (!scheduleTheaterList?.[0]?.lstCumRap) return;
            const roomShowtimeMap = new Map();
            for (const cinemaCluster of scheduleTheaterList[0].lstCumRap) {
                for (const movie of cinemaCluster.danhSachPhim) {
                    for (const showtime of movie.lstLichChieuTheoPhim) {
                        const roomName = showtime.tenRap;
                        if (!roomShowtimeMap.has(roomName)) {
                            roomShowtimeMap.set(roomName, showtime.maLichChieu);
                        }
                    }
                }
            }
            const MAX_CONCURRENT = 3; // Request đồng thời tối đa 3
            const showtimeIds = Array.from(roomShowtimeMap.values());
            const roomNames = Array.from(roomShowtimeMap.keys());
            const seatResults = {};
            for (let i = 0; i < showtimeIds.length; i += MAX_CONCURRENT) {
                const batchIds = showtimeIds.slice(i, i + MAX_CONCURRENT);
                const batchRooms = roomNames.slice(i, i + MAX_CONCURRENT);
                try {
                    const schedulePromises = batchIds.map(id => getScheduleApi(id).catch(() => null));
                    const scheduleResults = await Promise.all(schedulePromises);

                    scheduleResults.forEach((schedule, index) => {
                        if (schedule?.danhSachGhe) {
                            seatResults[batchRooms[index]] = schedule.danhSachGhe.length;
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            setSeatsByRoom(seatResults);
        };
        fetchSeatsPerRoom();
    }, [scheduleTheaterList]);


    const renderGroupTheater = () => {
        if (theaterDetail) {
            return theaterDetail.slice(0, 2).map((item) => {
                return (
                    <p key={item.maCumRap} className="text-sm text-gray-600 flex flex-col gap-1 border-b-1 py-2">
                        <span className="flex text-[18px] font-semibold">{item.tenCumRap}</span>
                        <span><strong className="flex-shrink-0">Địa chỉ: </strong> {item.diaChi}</span>
                        <span><strong>Phòng chiếu:</strong> {item.danhSachRap.length} phòng</span>
                    </p>
                )
            })
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const totalSeats = Object.values(seatsByRoom).reduce((sum, seats) => sum + seats, 0);
    const hasSeatsData = Object.keys(seatsByRoom).length > 0;
    return (
        <>
            <div
                key={theater.maHeThongRap}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
            >
                <p className="text-center mb-2"><img className="mx-auto" src={theater.logo} width={60} height={60} alt={theater.tenHeThongRap} /></p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">
                        {theater.tenHeThongRap}
                    </h3>
                </div>

                <div className="space-y-2 mb-4 h-full flex flex-col">
                    <div>
                        {renderGroupTheater()}
                        {theaterDetail && theaterDetail.length > 2 && (
                            <button
                                onClick={handleOpenModal}
                                className="flex ml-auto mr-auto mt-5 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-[14px] font-medium ml-6 hover:underline"
                            >
                                Xem thêm {theaterDetail.length - 2} cụm rạp
                            </button>
                        )}
                    </div>
                    <div className="mt-auto">
                        <p className="text-sm text-gray-600">
                            <strong>{totalRooms}</strong> phòng chiếu
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>{hasSeatsData ? (totalSeats * totalRooms / 10) : '...'}</strong> ghế ngồi
                            {!hasSeatsData &&
                                <span className="text-xs text-gray-400 ml-1">(đang tải...)</span>
                            }
                        </p>
                    </div>
                </div>

                <div className="flex sm:flex-row sm:items-center gap-2 mt-auto">
                    <button
                        onClick={handleOpenModal}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
                        Chi tiết
                    </button>
                </div>
            </div>

            {isModalOpen ? <TheaterDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                theater={theater}
                theaterDetail={theaterDetail}
                seatsByRoom={seatsByRoom}
            /> : ''}

        </>
    )
}
