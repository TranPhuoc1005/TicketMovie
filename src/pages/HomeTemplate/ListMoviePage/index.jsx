import Movie from './Movie';
import { useQuery } from '@tanstack/react-query';
import { getListMovieApi } from '../../../services/movie.api';
import { useState } from 'react';
import Pagination from '../../../components/Pagination';

export default function ListMoviePage(props) {
    const {setIsModalOpen, setSelectedMovie} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['list-movie', currentPage, itemsPerPage],
        queryFn: () => {
            return getListMovieApi('GP01', currentPage , itemsPerPage);
        }
    });
    if(isLoading) return <p>Loading...</p>;

    if(isError) return <div><p>Đã có lỗi xày ra vui lòng thử lại !</p><button onClick={handleRefetch()} className="p3 text-sm rounded-sm bg-blue-600 text-white">Thử lại</button></div>

    const renderMovies = () => {
        if(data.items) {
            return data.items.map((movie) => {
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

    const totalPages = data?.totalPages || Math.ceil((data?.totalCount || 0) / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const moviesSection = document.getElementById('movies');
        if (moviesSection) {
            moviesSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
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
                    <div className="pagination">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            color="text-white"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
