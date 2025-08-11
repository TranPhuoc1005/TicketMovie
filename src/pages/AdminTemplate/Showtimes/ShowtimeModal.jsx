import { X, MapPin, Film } from 'lucide-react';
import { useEffect } from 'react';
import { getSeatListApi } from '../../../services/schedule.api';
import { useQuery } from '@tanstack/react-query';

export default function ShowtimeModal({ showtime, isOpen, onClose }) {
    const { data: seatDetails, isLoading, isError, refetch } = useQuery({
        queryKey: ['list-seats', showtime?.id],
        queryFn: () => getSeatListApi(showtime.id),
        enabled: isOpen && !!showtime?.id,
    });

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !showtime) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleBackdropClick}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Chi tiết lịch chiếu</h2>
                            <p className="text-sm text-gray-600 mt-1">Mã lịch chiếu: #{showtime.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Thông tin cơ bản */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Film className="text-blue-600" size={20} />
                                        <h3 className="text-lg font-semibold text-gray-800">{showtime.movie}</h3>
                                    </div>
                                    <p><strong>Hệ thống rạp:</strong> {showtime.theater}</p>
                                    <p><strong>Cụm rạp:</strong> {showtime.cinema}</p>
                                    <p><strong>Phòng chiếu:</strong> {showtime.room}</p>
                                </div>
                                <div className="space-y-2">
                                    <p><strong>Ngày chiếu:</strong> {showtime.date}</p>
                                    <p><strong>Giờ chiếu:</strong> {showtime.time}</p>
                                    <p><strong>Giá vé:</strong> {showtime.price?.toLocaleString()}₫</p>
                                    <p><strong>Mã phòng:</strong> {showtime.maRap || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Loading state */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-gray-600">Đang tải thông tin ghế...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="text-red-500 mb-4">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-center mb-4">Không thể tải thông tin ghế. Vui lòng thử lại sau.</p>
                                <button
                                    onClick={() => refetch()}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {/* Seat details */}
                        {seatDetails && !isLoading && !isError && (
                            <div className="space-y-6">
                                {/* Thông tin phim từ API */}
                                {/* Thông tin phim từ API */}
                                {seatDetails.thongTinPhim && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                                            {seatDetails.thongTinPhim.hinhAnh && (
                                                <img
                                                    src={seatDetails.thongTinPhim.hinhAnh}
                                                    alt={seatDetails.thongTinPhim.tenPhim}
                                                    className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-lg shadow-lg"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <Film className="text-blue-600" size={20} />
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                                        {seatDetails.thongTinPhim.tenPhim}
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="text-gray-500 flex-shrink-0" size={16} />
                                                        <span className="text-gray-700">{seatDetails.thongTinPhim.tenCumRap}</span>
                                                    </div>
                                                    <div className="text-gray-700"><strong>Phòng:</strong> {seatDetails.thongTinPhim.tenRap}</div>
                                                    <div className="text-gray-700"><strong>Ngày chiếu:</strong> {seatDetails.thongTinPhim.ngayChieu}</div>
                                                    <div className="text-gray-700"><strong>Giờ chiếu:</strong> {seatDetails.thongTinPhim.gioChieu}</div>
                                                </div>
                                                {seatDetails.thongTinPhim.diaChi && (
                                                    <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                                                        <strong>Địa chỉ:</strong> {seatDetails.thongTinPhim.diaChi}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Thống kê ghế */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-gray-700">
                                            {seatDetails.danhSachGhe?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Tổng ghế</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {seatDetails.danhSachGhe?.filter(seat => !seat.daDat).length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Còn trống</div>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-red-600">
                                            {seatDetails.danhSachGhe?.filter(seat => seat.daDat).length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Đã đặt</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {seatDetails.danhSachGhe?.length > 0
                                                ? Math.round(((seatDetails.danhSachGhe.filter(seat => !seat.daDat).length) / seatDetails.danhSachGhe.length) * 100)
                                                : 0
                                            }%
                                        </div>
                                        <div className="text-sm text-gray-600">Tỷ lệ trống</div>
                                    </div>
                                </div>

                                {/* Sơ đồ ghế */}
                                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                    <h4 className="text-lg font-semibold mb-4 text-center">Sơ đồ ghế</h4>
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-2 rounded-t-2xl text-xs sm:text-sm font-semibold shadow-lg">
                                            MÀN HÌNH
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs sm:text-sm">
                                        <div className="flex items-center space-x-1"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div><span>Trống</span></div>
                                        <div className="flex items-center space-x-1"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div><span>Đã đặt</span></div>
                                        <div className="flex items-center space-x-1"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded"></div><span>VIP</span></div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <div
                                            className="grid gap-2"
                                            style={{
                                                gridTemplateColumns: `repeat(${20}, minmax(1.5rem, 1fr))`
                                            }}
                                        >
                                            {seatDetails.danhSachGhe?.map(seat => (
                                                <div
                                                    key={seat.maGhe}
                                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-[10px] sm:text-xs font-medium flex items-center justify-center cursor-pointer ${seat.daDat ? 'bg-red-500 text-white' : seat.loaiGhe === 'Vip' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                                                >
                                                    {seat.tenGhe}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bảng chi tiết ghế */}
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b">
                                        <h4 className="font-semibold text-gray-700">Danh sách ghế chi tiết ({seatDetails.danhSachGhe?.length || 0} ghế)</h4>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[500px] text-xs sm:text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-medium">Ghế</th>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-medium">Loại</th>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-medium">Giá</th>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-medium">Trạng thái</th>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-medium">Người đặt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {seatDetails.danhSachGhe?.map(seat => (
                                                    <tr key={seat.maGhe} className="border-b">
                                                        <td className="px-3 sm:px-4 py-2 font-medium">{seat.tenGhe}</td>
                                                        <td className="px-3 sm:px-4 py-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${seat.loaiGhe === 'Vip' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                {seat.loaiGhe === "Thuong" ? "Thường": "Vip"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 font-medium">{seat.giaVe?.toLocaleString()}₫</td>
                                                        <td className="px-3 sm:px-4 py-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${seat.daDat ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                                {seat.daDat ? 'Đã đặt' : 'Trống'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2 text-gray-600">
                                                            {seat.taiKhoanNguoiDat || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
