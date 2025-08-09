import { Star } from "lucide-react";
import React from "react";

export default function Movie(props) {
    const { movie } = props;
    return (
        <tr
            key={movie.id}
            className="border-b border-gray-100 hover:bg-gray-50"
        >
            <td className="py-3 px-4">
                <div className="font-medium text-gray-800">{movie.tenPhim}</div>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{movie.danhGia}</span>
                </div>
            </td>
            <td className="py-3 px-4">
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
        </tr>
    );
}
