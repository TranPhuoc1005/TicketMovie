import { useQuery } from '@tanstack/react-query';
import { getDetailTheatersApi } from '../../../services/cinema.api';
import { useMemo, useState } from 'react';
import TheaterDetailModal from './TheaterDetailModal';

export default function Theater(props) {
    const { theater } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: theaterDetail, isLoading } = useQuery({
        queryKey: ['theater-detail', theater.maHeThongRap],
        queryFn: () => getDetailTheatersApi(theater.maHeThongRap)
    })


    // Tính tổng số phòng bằng useMemo để tránh re-calculate
    const totalRooms = useMemo(() => {
        if (!theaterDetail) return 0;
        return theaterDetail.reduce((sum, cinemaCluster) => {
            return sum + (cinemaCluster.danhSachRap?.length || 0);
        }, 0);
    }, [theaterDetail]);


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
                                className="flex ml-auto mr-auto mt-5 bg-gradient-to-r from-rose-200 to-orange-200 bg-clip-text text-transparent text-[14px] font-medium ml-6 hover:underline"
                            >
                                Xem thêm {theaterDetail.length - 2} cụm rạp
                            </button>
                        )}
                    </div>
                    <div className="mt-auto">
                        <p className="text-sm text-gray-600">
                            <strong>{totalRooms}</strong> phòng chiếu
                        </p>
                    </div>
                </div>

                <div className="flex sm:flex-row sm:items-center gap-2 mt-auto">
                    <button
                        onClick={handleOpenModal}
                        className="flex-1 bg-gradient-to-r from-sky-300 to-blue-300 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
                        Chi tiết
                    </button>
                </div>
            </div>

            {isModalOpen ? <TheaterDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                theater={theater}
                theaterDetail={theaterDetail}
            /> : ''}

        </>
    )
}
