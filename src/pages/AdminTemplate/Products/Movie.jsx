import { format } from "date-fns";
import { Edit, Eye, Star, Trash2 } from "lucide-react";

export default function Movie(props) {
    const { movie, onEdit, onDelete, onView } = props;
    
    return (
        <tr
            key={movie.maPhim}
            className="border-b border-gray-100 hover:bg-gray-50"
        >
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="mx-auto w-12 h-16 bg-gray-300 rounded overflow-hidden">
                    <img 
                        src={movie.hinhAnh} 
                        className="w-full h-full object-cover" 
                        alt={movie.tenPhim}
                        onError={(e) => {
                            e.target.src = '/placeholder-movie.jpg';
                        }}
                    />
                </div>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="font-medium text-gray-800">
                    {movie.tenPhim}
                </div>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="flex items-center justify-center">
                    <Star
                        size={16}
                        className="text-yellow-500 mr-1"
                    />
                    <span className="text-sm font-medium">
                        {movie.danhGia}
                    </span>
                </div>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 text-center">
                {movie.ngayKhoiChieu ? format(new Date(movie.ngayKhoiChieu), 'dd/MM/yyyy') : ''}
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6 text-center">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        movie.dangChieu === true
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    {movie.dangChieu === true ? 'Đang chiếu' : 'Sắp chiếu'}
                </span>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="flex items-center justify-center space-x-2">
                    <button 
                        onClick={() => onView?.(movie)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button 
                        onClick={() => onEdit?.(movie)}
                        className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete?.(movie.maPhim)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}