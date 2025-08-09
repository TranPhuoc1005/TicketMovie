// ... các import phía trên
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteMovieApi, getListMovieApi } from "../../../services/movie.api";
import Pagination from "../../../components/Pagination";
import Movie from "./Movie";
import AddMovieModal from "./_components/AddMovieModal";
import Swal from "sweetalert2";
import swalHelper from "../../../components/Alert/Swal";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isPendingScroll, setIsPendingScroll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const hasClickedPagination = useRef(false);
    const itemsPerPage = 10;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["list-movie", currentPage, itemsPerPage],
        queryFn: () => getListMovieApi("GP01", currentPage, itemsPerPage),
        keepPreviousData: true,
    });

    const totalItems = data?.totalCount || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        if (isPendingScroll && !isLoading && data) {
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
    }, [isLoading, data, isPendingScroll]);

    const handlePageChange = (page) => {
        hasClickedPagination.current = true;
        setIsPendingScroll(true);
        setCurrentPage(page);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleDeleteMovie = async (maPhim) => {
        const result = await swalHelper.confirm("Phim này sẽ bị xóa vĩnh viễn", "Bạn chắc chắn muốn xóa ?", "Xóa", "Hủy" )
        if (result.isConfirmed) {
            try {
                await deleteMovieApi(maPhim);
                await swalHelper.success("Phim đã được xóa thành công.", "Đã xóa!");
                refetch();
            } catch (error) {
                swalHelper.error("Có lỗi xày ra khi xóa phim.", "Thất bại");
            }
        }
    };

    const renderMovies = () => {
        if (isLoading) return null;
        if (data?.items?.length > 0) {
            return data.items.map((movie) => (
                <Movie
                    key={movie.maPhim}
                    movie={movie}
                    onDelete={handleDeleteMovie}
                    onEdit={(movie) => {
                        setEditData(movie);
                        setIsModalOpen(true);
                    }}
                />
            ));
        } else {
            return (
                <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                        Không có phim nào ở trang này.
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
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-bold text-1xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2 cursor-pointer"
                    >
                        Thêm phim mới
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                    <input
                        type="text"
                        placeholder="Tìm kiếm phim..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                        Hiển thị {itemsPerPage} phim mỗi trang – Tổng cộng{" "}
                        {totalItems} phim
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        classNameBtn="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        prevText="Trước"
                        nextText="Sau"
                    />
                </div>
            </div>

            {isPendingScroll && (
                <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <AddMovieModal isOpen={isModalOpen} onClose={handleCloseModal} editData={editData} setEditData={setEditData} />
        </div>
    );
}
