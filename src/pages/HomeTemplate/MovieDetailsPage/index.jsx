import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../services/api';
import BookingModal from '../_components/BookingModal/BookingModal';

export default function MovieDetailsPage() {
    const { movieId } = useParams();
    const [ movie, setMovie ] = useState(null);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ cinemaDetail, setCinemaDetail ] = useState(null);
    useEffect(() => {
        const getMovieDetail = async() => {
            try {
                const response = await api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${movieId}`);
                setMovie(response.data.content);

                const resSchedule = await api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`);
                setCinemaDetail(resSchedule.data.content);
            }catch(error) {
                console.log(error);
            }
        }
        getMovieDetail();
    }, [movieId]);
    const priceTicket = cinemaDetail?.heThongRapChieu?.[0]?.cumRapChieu?.[0]?.lichChieuPhim?.[0]?.giaVe;
    const durationFilm = cinemaDetail?.heThongRapChieu?.[0]?.cumRapChieu?.[0]?.lichChieuPhim?.[0]?.thoiLuong;
    const convertToEmbedUrl = (url) => {
        let videoId = null;
        try {
            const urlObj = new URL(url);
            if (url.includes('youtube.com') || url.includes('www.youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            } else if (url.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
            return url;
            
        } catch (error) {
            return url;
        }
    };

    return (
        <div className=" bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-[66px] min-h-[100vh]">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={movie?.hinhAnh} 
                        alt={movie?.tenPhim}
                        className="w-full h-full object-cover opacity-20 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                            {/* Movie Poster */}
                            <div className="lg:col-span-1">
                                <div className="group relative">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                                        <img 
                                            src={movie?.hinhAnh} 
                                            alt={movie?.tenPhim}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    
                                    {/* Rating */}
                                    <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1">
                                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                        <span className="text-yellow-400 font-bold text-lg">{movie?.danhGia}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                        {movie?.tenPhim}
                                    </h1>

                                    {/* Movie Stats */}
                                    <div className="flex flex-wrap items-center gap-6 mb-6">
                                        <div className="flex items-center space-x-2 text-purple-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="font-medium">{durationFilm} Phút</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white">Nội dung phim</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        {movie?.moTa ? movie?.moTa : 'Đang cập nhật'}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 cursor-pointer"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                        <span>Đặt vé ngay</span>
                                    </button>
                                    
                                    <button className="glass-effect hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 border border-slate-700/50 flex items-center justify-center space-x-3 cursor-pointer">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                        <span>Yêu thích</span>
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="glass-effect rounded-2xl p-6 border border-slate-700/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm uppercase tracking-wider">Giá vé</p>
                                            <p className="text-3xl font-bold text-green-400">{priceTicket ? `${priceTicket.toLocaleString()}đ` : 'Chưa có' }</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-sm uppercase tracking-wider">Trạng thái</p>
                                            <p className="text-lg font-semibold text-purple-300">{movie?.dangChieu === true ? "Đang chiếu" : "Sắp chiếu"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {movie?.trailer ?
                <div className="trailer relative z-10 mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center mb-10">
                        🎬 TRAILER
                    </h2>
                    <iframe
                        width="560"
                        height="315"
                        src={convertToEmbedUrl(movie.trailer)}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-[750px] h-[500px] mx-auto"
                    ></iframe>
                </div>
                : ''}
            </div>
            {/* Booking Modal */}
            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                movie={movie}
                cinemaDetail={cinemaDetail}
            />
        </div>
    )
}
