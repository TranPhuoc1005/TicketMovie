import React from 'react';
import { X, Star, Calendar, Clock, Play, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function DetailMovieModal({ isOpen, onClose, movie }) {
    if (!isOpen || !movie) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleOverlayClick}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết phim</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Poster */}
                            <div className="lg:col-span-1">
                                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src={movie.hinhAnh}
                                        alt={movie.tenPhim}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-movie.jpg';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title and Rating */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {movie.tenPhim}
                                    </h1>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <Star className="text-yellow-500 mr-1" size={20} />
                                            <span className="text-lg font-semibold text-gray-700">
                                                {movie.danhGia}/10
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${movie.dangChieu
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {movie.dangChieu ? 'Đang chiếu' : 'Sắp chiếu'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Movie Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="text-gray-500" size={18} />
                                        <div>
                                            <span className="text-sm text-gray-500">Ngày khởi chiếu:</span>
                                            <p className="font-medium text-gray-800">
                                                {movie.ngayKhoiChieu
                                                    ? format(new Date(movie.ngayKhoiChieu), 'dd/MM/yyyy')
                                                    : 'Chưa xác định'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Users className="text-gray-500" size={18} />
                                        <div>
                                            <span className="text-sm text-gray-500">Mã phim:</span>
                                            <p className="font-medium text-gray-800">{movie.maPhim}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {movie.moTa || 'Chưa có mô tả cho phim này.'}
                                    </p>
                                </div>

                                {/* Trailer */}
                                {movie.trailer && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Trailer</h3>
                                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                            <iframe
                                                src={movie.trailer.replace('watch?v=', 'embed/')}
                                                title="Movie Trailer"
                                                className="w-full h-full"
                                                frameBorder="0"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Additional Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin thêm</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <span className="text-sm text-gray-500">Trạng thái chiếu:</span>
                                            <p className="font-medium text-gray-800">
                                                {movie.dangChieu ? 'Đang chiếu tại rạp' : 'Sắp ra mắt'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Đánh giá:</span>
                                            <p className="font-medium text-gray-800">
                                                {movie.danhGia >= 8 ? 'Xuất sắc' :
                                                    movie.danhGia >= 6 ? 'Tốt' :
                                                        movie.danhGia >= 4 ? 'Trung bình' : 'Kém'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Đóng
                        </button>
                        {movie.trailer && (
                            <a
                                href={movie.trailer}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                            >
                                <Play size={16} />
                                <span>Xem Trailer</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}