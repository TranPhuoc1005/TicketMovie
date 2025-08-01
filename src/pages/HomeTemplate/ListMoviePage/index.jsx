import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchListMovie } from './slice';
import Movie from './Movie';

export default function ListMoviePage(props) {
    const {setIsModalOpen, setSelectedMovie} = props;
    const {data, loading} = useSelector((state) => state.listMovieSlice);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchListMovie());
    }, []);


    if(loading) return <p>Loading...</p>;

    const renderMovies = () => {
        if(data) {
            return data.map((movie) => {
                return <Movie 
                    key={movie.maPhim} 
                    movie={movie} 
                    cinemaDetail={data}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedMovie={setSelectedMovie}
                />
            })
        }
    }
    return (
        <section id="movies" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        🎬 Phim đang chiếu
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Khám phá những bộ phim blockbuster mới nhất với chất lượng hình ảnh và âm thanh tuyệt vời
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {renderMovies()}
                </div>
                <div className="text-center mt-12">
                    <button className="glass-effect hover:bg-purple-600/20 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 border border-purple-500/50 cursor-pointer">
                        Xem thêm phim
                    </button>
                </div>
            </div>
        </section>
    )
}
