import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMoviesApi } from '../../../services/movie.api';

export default function Mainvisual(props) {
    const {setIsModalOpen} = props;
    const [currentSlide, setCurrentSlide] = useState(0);

    // Sử dụng useQuery để fetch movies
    const { data: movieList, isLoading, error } = useQuery({
        queryKey: ['movies', 'GP01'],
        queryFn: () => getMoviesApi("GP01"),
        staleTime: 5 * 60 * 1000, // 5 phút
    });

    // 
    const latestMovies = movieList
        ?.sort((a, b) => new Date(b.ngayKhoiChieu) - new Date(a.ngayKhoiChieu))
        ?.slice(0, 5) || [];

    // Auto slide every 6 seconds
    useEffect(() => {
        if (latestMovies.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % latestMovies.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [latestMovies.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % latestMovies.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + latestMovies.length) % latestMovies.length);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleWatchTrailer = () => {
        const currentMovie = latestMovies[currentSlide];
        if (currentMovie?.trailer) {
            window.open(currentMovie.trailer, '_blank');
        }
    };

    if (isLoading) {
        return (
            <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <span className="text-white text-xl">Đang tải phim mới nhất...</span>
                </div>
            </section>
        );
    }

    if (error || latestMovies.length === 0) {
        return (
            <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Không thể tải phim</h2>
                    <p className="text-slate-300">Vui lòng thử lại sau.</p>
                </div>
            </section>
        );
    }

    const currentMovie = latestMovies[currentSlide];

    return (
        <section id="home" className="relative min-h-screen overflow-hidden">
            {/* Background Image với Overlay */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out transform scale-110"
                    style={{
                        backgroundImage: `url(${currentMovie?.hinhAnh})`,
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-5">
                <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/30 rounded-full blur-xl animate-bounce"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-pink-500/30 rounded-full blur-xl animate-bounce delay-75"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-500/30 rounded-full blur-lg animate-pulse delay-150"></div>
                <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-blue-500/30 rounded-full blur-lg animate-bounce delay-300"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-left space-y-8 animate-fade-in-left">
                            {/* Movie Badge */}
                            <div className="inline-flex items-center space-x-2 bg-rose-200/20 backdrop-blur-sm border border-rose-200/20 rounded-full px-4 py-2 text-white font-semibold">
                                <Star className="w-4 h-4 fill-current" />
                                <span>PHIM MỚI NHẤT</span>
                            </div>

                            {/* Movie Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-rose-200 to-orange-200 to-yellow-400 bg-clip-text text-transparent">
                                    {currentMovie?.tenPhim}
                                </span>
                            </h1>

                            {/* Movie Info */}
                            <div className="flex flex-wrap items-center gap-6 text-slate-300">
                                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <Calendar className="w-4 h-4 text-rose-200" />
                                    <span className="text-sm font-medium">{formatDate(currentMovie?.ngayKhoiChieu)}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">{currentMovie?.danhGia}/10</span>
                                </div>
                            </div>

                            {/* Movie Description */}
                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                                {currentMovie?.moTa?.length > 150 
                                    ? currentMovie.moTa.substring(0, 150) + "..." 
                                    : currentMovie?.moTa}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <button 
                                    onClick={handleWatchTrailer}
                                    className="group bg-gradient-to-r from-sky-300 to-blue-300  text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3"
                                >
                                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>Xem Trailer</span>
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="border-2 border-rose-200 text-rose-200 hover:bg-rose-200/10 hover:border-rose-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                                >
                                    Đặt vé ngay
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Movie Poster */}
                        <div className="relative animate-fade-in-right">
                            <div className="relative group">
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-sky-300 to-blue-300 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                
                                {/* Movie Poster */}
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
                                    <img 
                                        src={currentMovie?.hinhAnh} 
                                        alt={currentMovie?.tenPhim}
                                        className="w-full h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                    
                                    {/* Rating Badge */}
                                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-white font-bold">{currentMovie?.danhGia}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center space-x-4">
                    {/* Previous Button */}
                    <button 
                        onClick={prevSlide}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/20"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex space-x-3">
                        {latestMovies.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'bg-gradient-to-r from-rose-200 to-orange-200 scale-125' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Next Button */}
                    <button 
                        onClick={nextSlide}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/20"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Side Thumbnails */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden xl:flex flex-col space-y-4">
                {latestMovies.map((movie, index) => (
                    <button
                        key={movie.maPhim}
                        onClick={() => setCurrentSlide(index)}
                        className={`relative group transition-all duration-300 ${
                            index === currentSlide ? 'scale-110' : 'scale-90 opacity-60 hover:opacity-100'
                        }`}
                    >
                        <div className="w-20 h-28 rounded-lg overflow-hidden border-2 border-white/20 hover:border-rose-200/50">
                            <img 
                                src={movie.hinhAnh} 
                                alt={movie.tenPhim}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {index === currentSlide && (
                            <div className="absolute inset-0 border-2 border-rose-300 rounded-lg"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-6000 ease-linear"
                    style={{ width: `${((currentSlide + 1) / latestMovies.length) * 100}%` }}
                />
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fade-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fade-in-left {
                    animation: fade-in-left 1s ease-out;
                }
                
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out;
                }
            `}</style>
        </section>
    );


}
