import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteMovieApi, getListMovieApi, getMoviesApi } from "../../../services/movie.api";
import Pagination from "../../../components/Pagination";
import Movie from "./Movie";
import AddMovieModal from "./_components/AddMovieModal";
import swalHelper from "../../../components/Alert/Swal";
import { Search, X } from "lucide-react";
import DetailMovieModal from "./_components/DetailMovieModal";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isPendingScroll, setIsPendingScroll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [editData, setEditData] = useState(null);
    const hasClickedPagination = useRef(false);
    const searchTimeoutRef = useRef(null);
    const itemsPerPage = 10;

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            setSearchQuery(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const { data: paginatedData, isLoading: isPaginatedLoading, refetch } = useQuery({
        queryKey: ["list-movie", currentPage, itemsPerPage],
        queryFn: () => getListMovieApi("GP01", currentPage, itemsPerPage),
        keepPreviousData: true,
        enabled: !searchQuery,
    });

    const { data: allMoviesData, isLoading: isAllMoviesLoading } = useQuery({
        queryKey: ["all-movies"],
        queryFn: () => getMoviesApi("GP01"),
        keepPreviousData: true,
        enabled: !!searchQuery,
    });

    const isLoading = searchQuery ? isAllMoviesLoading : isPaginatedLoading;
    const allMovies = searchQuery ? (allMoviesData || []) : [];

    const filteredMovies = searchQuery 
        ? allMovies.filter(movie => 
            movie.tenPhim.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const totalFilteredItems = searchQuery ? filteredMovies.length : (paginatedData?.totalCount || 0);
    const totalPages = searchQuery ? Math.ceil(filteredMovies.length / itemsPerPage) : Math.ceil((paginatedData?.totalCount || 0) / itemsPerPage);

    const getPaginatedMovies = () => {
        if (searchQuery) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredMovies.slice(startIndex, endIndex);
        }
        return paginatedData?.items || [];
    };

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        if (isPendingScroll && !isLoading && (paginatedData || allMoviesData)) {
            const moviesSection = document.getElementById("movies");
            if (moviesSection) {
                moviesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
            setIsPendingScroll(false);
            hasClickedPagination.current = false;
        }
    }, [isLoading, paginatedData, allMoviesData, isPendingScroll]);

    const handlePageChange = (page) => {
        hasClickedPagination.current = true;
        setIsPendingScroll(true);
        setCurrentPage(page);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditData(null);
    };

    const handleOpenDetailModal = (movie) => {
        setSelectedMovie(movie);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedMovie(null);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleDeleteMovie = async (maPhim) => {
        const result = await swalHelper.confirm("Phim này sẽ bị xóa vĩnh viễn", "Bạn chắc chắn muốn xóa ?", "Xóa", "Hủy" )
        if (result.isConfirmed) {
            try {
                await deleteMovieApi(maPhim);
                await swalHelper.success("Phim đã được xóa thành công.", "Đã xóa!");
                refetch();
            } catch (error) {
                swalHelper.error("Có lỗi xày ra khi xóa phim.", "Thất bại");
                console.log(error)
            }
        }
    };

    const renderMovies = () => {
        if (isLoading) return null;
        
        const moviesToRender = getPaginatedMovies();
        
        if (moviesToRender.length > 0) {
            return moviesToRender.map((movie) => (
                <Movie
                    key={movie.maPhim}
                    movie={movie}
                    onDelete={handleDeleteMovie}
                    onEdit={(movie) => {
                        setEditData(movie);
                        setIsModalOpen(true);
                    }}
                    onView={handleOpenDetailModal}
                />
            ));
        } else {
            return (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                        {searchQuery ? (
                            <div className="space-y-2">
                                <p>Không tìm thấy phim nào với từ khóa "{searchQuery}"</p>
                                <button
                                    onClick={handleClearSearch}
                                    className="bg-gradient-to-r from-rose-200 to-orange-200 bg-clip-text text-transparent underline"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            "Không có phim nào ở trang này."
                        )}
                    </td>
                </tr>
            );
        }
    };

    return (
        <div id="movies" className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý phim
                    </h1>
                    <button
                        onClick={handleOpenModal}
                        className="bg-gradient-to-r from-sky-300 to-blue-300  text-white px-4 py-2 rounded-lg font-bold text-1xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2 cursor-pointer"
                    >
                        Thêm phim mới
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                    <div className="relative w-full sm:max-w-md">
                        <Search 
                            size={20} 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phim theo tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <div className="text-sm text-gray-600">
                            Tìm thấy {totalFilteredItems} kết quả cho "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-center py-3 px-4 font-medium text-gray-600">
                                    Poster
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">
                                    Tên phim
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600">
                                    Đánh giá
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600">
                                    Ngày phát hành
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600">
                                    Trạng thái
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-600">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>{renderMovies()}</tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                        Hiển thị {Math.min(itemsPerPage, getPaginatedMovies().length)} phim mỗi trang – Tổng cộng{" "}
                        {totalFilteredItems} phim{searchQuery ? " (đã lọc)" : ""}
                    </p>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            classNameBtn="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                            prevText="Trước"
                            nextText="Sau"
                        />
                    )}
                </div>
            </div>

            {isPendingScroll && (
                <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <AddMovieModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                editData={editData} 
                setEditData={setEditData} 
            />
            
            <DetailMovieModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                movie={selectedMovie}
            />
        </div>
    );
}