import { Link } from "react-router-dom";
import Movie from "./Movie";

export default function ListMovies(props) {
    const {data} = props;
    const renderMovies = () => {
        if(data?.items?.length > 0) {
            return data.items.map((movie) => {
                return <Movie 
                    key={movie.maPhim}
                    movie={movie}
                />
            });
        }
    }
    return (
        <div className="xl:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Phim mới nhất</h3>
                <Link
                    to="/admin/products/"
                    className="text-blue-800 text-sm font-medium"
                >
                    Xem tất cả
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                Tên phim
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                Đánh giá
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderMovies()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
