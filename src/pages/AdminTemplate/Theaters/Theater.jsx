import { useQuery } from '@tanstack/react-query';
import { Edit, MapPin, Trash2 } from 'lucide-react';
import { getDetailTheatersApi } from '../../../services/cinema.api';
import { useEffect, useState } from 'react';
import TheaterDetailModal from './TheaterDetailModal';

export default function Theater(props) {
    const { theater } = props;
    const [showModal, setShowModal] = useState(false);
    const [totalRooms, setTotalRooms] = useState(0);

    const { data: theaterDetail, isLoading } = useQuery({
        queryKey: ['theater-detail', theater.maHeThongRap],
        queryFn: () => getDetailTheatersApi(theater.maHeThongRap)
    })
    useEffect(() => {
        if (theaterDetail && theaterDetail.length > 0) {
            const total = theaterDetail.reduce((sum, cumRap) => {
                return sum + (cumRap.danhSachRap?.length || 0);
            }, 0);
            setTotalRooms(total);
        }
    }, [theaterDetail])


    const renderGroupTheater = () => {
        if (theaterDetail) {
            return theaterDetail.slice(0, 2).map((item) => {
                return (
                    <p key={item.maCumRap} className="text-sm text-gray-600 flex flex-col gap-1 border-b-1 py-2">
                        <span className="flex">{item.tenCumRap}</span>
                        <span><strong className="flex-shrink-0">Địa chỉ: </strong> {item.diaChi}</span>
                        <span><strong>Phòng chiếu:</strong> {item.danhSachRap.length}</span>
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

    return (
        <>
            <div
                key={theater.maHeThongRap}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
            >
                <p className="text-center mb-2"><img className="mx-auto" src={theater.logo} width={60} height={60} alt={theater.tenHeThongRap} /></p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {theater.tenHeThongRap}
                    </h3>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${theater.status === "Hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {theater.status}
                    </span>
                </div>

                <div className="space-y-2 mb-4 h-full flex flex-col">
                    <div>
                        {renderGroupTheater()}
                        {theaterDetail && theaterDetail.length > 2 && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex ml-auto mr-auto mt-5 text-blue-600 hover:text-blue-800 text-xs font-medium ml-6 hover:underline"
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
                            <strong>{theater.seats}</strong> ghế ngồi
                        </p>
                    </div>
                </div>

                <div className="flex sm:flex-row sm:items-center gap-2 mt-auto">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
                        Chi tiết
                    </button>
                </div>
            </div>

            {showModal ? <TheaterDetailModal setShowModal={setShowModal} theater={theater} theaterDetail={theaterDetail} /> : ''}

        </>
    )
}
