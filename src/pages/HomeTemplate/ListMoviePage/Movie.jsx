import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCinemaApi} from '../../../services/cinema.api';

export default function Movie(props) {
    const { movie, setIsModalOpen, setSelectedMovie } = props;
    const navigate = useNavigate();
    const handleViewDetail = () => {
        navigate(`movie-details/${movie.maPhim}`);
    }
    const { data: cinemaDetail, isLoading, isError } = useQuery({
        queryKey: ['item-movie', movie.maPhim],
        queryFn: () => {
            return getCinemaApi(movie.maPhim);
        }
    })
    const handleBookTicket = () => {
        setSelectedMovie({
            ...movie,
            cinemaDetail,
        });
        setIsModalOpen(true);
    }
    const priceTicket = cinemaDetail?.heThongRapChieu?.[0]?.cumRapChieu?.[0]?.lichChieuPhim?.[0]?.giaVe;
    const durationFilm = cinemaDetail?.heThongRapChieu?.[0]?.cumRapChieu?.[0]?.lichChieuPhim?.[0]?.thoiLuong;
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden hover-lift border border-slate-700/50 hover:border-rose-300">
<<<<<<< HEAD
            <div className="relative p-6 flex flex-col h-full">
=======
            <div className="relative p-4 flex flex-col h-full">
>>>>>>> thanhlv
                <div onClick={handleViewDetail} className="mb-6 relative cursor-pointer">
                    <div className="aspect-[3/4] bg-gradient-to-r from-sky-300 to-blue-300 rounded-xl flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                        <img src={movie.hinhAnh} className="object-cover w-full h-full" alt={movie.tenPhim} />
                    </div>
                    <div className="absolute top-3 right-3 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-yellow-400 font-semibold text-sm">{movie.danhGia}</span>
                    </div>
                </div>
                <h3 onClick={handleViewDetail} className="text-xl font-bold text-black mb-2 transition-colors  cursor-pointer">
                    {movie.tenPhim}
                </h3>

                <div className="flex flex-col flex-wrap gap-1 mb-1">
                    <div className="flex items-center space-x-2 text-black">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">{durationFilm} Phút</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-black mb-4">
                    <span className="font-medium">{movie.dangChieu ? "Đang chiếu" : "Sắp chiếu"}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                    <p className="text-black text-sm line-clamp-2">{movie.moTa}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-green-400">
                        {priceTicket ? `${priceTicket.toLocaleString()}đ` : 'Chưa có' }
                    </div>
                    <button onClick={handleBookTicket} className={` ${movie.dangChieu ? 'bg-gradient-to-r from-sky-300 to-blue-300  hover:scale-105 hover:shadow-lg cursor-pointer ' : 'bg-stone-600 opacity-70 cursor-not-allowed' } text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300  flex items-center space-x-2 `} disabled={!movie.dangChieu ? true : false}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Đặt vé</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
