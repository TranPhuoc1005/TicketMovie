
import { Calendar, Clock, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useState } from 'react';

export default function ShowtimesPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const mockShowtimes = [
        {
            id: 1,
            movie: "Avatar: The Way of Water",
            theater: "CGV Vincom Center",
            room: "Phòng 1",
            date: "2024-08-02",
            time: "14:30",
            price: 85000,
            availableSeats: 45,
            totalSeats: 120,
        },
        {
            id: 2,
            movie: "Black Panther: Wakanda Forever",
            theater: "Lotte Cinema",
            room: "Phòng 3",
            date: "2024-08-02",
            time: "16:00",
            price: 95000,
            availableSeats: 78,
            totalSeats: 150,
        },
        {
            id: 3,
            movie: "Top Gun: Maverick",
            theater: "Galaxy Cinema",
            room: "Phòng 2",
            date: "2024-08-02",
            time: "19:30",
            price: 90000,
            availableSeats: 12,
            totalSeats: 100,
        },
    ];
    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý lịch chiếu
                    </h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                        <PlusCircle size={20} className="mr-2" />
                        Thêm lịch chiếu
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            locale={vi}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholderText="Chọn ngày"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Tất cả rạp</option>
                        <option value="cgv">CGV Vincom Center</option>
                        <option value="lotte">Lotte Cinema</option>
                        <option value="galaxy">Galaxy Cinema</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Tất cả phim</option>
                        <option value="avatar">Avatar: The Way of Water</option>
                        <option value="blackpanther">Black Panther</option>
                        <option value="topgun">Top Gun: Maverick</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Phim",
                                    "Rạp chiếu",
                                    "Phòng",
                                    "Ngày/Giờ",
                                    "Giá vé",
                                    "Ghế trống",
                                    "Thao tác",
                                ].map((title) => (
                                    <th
                                        key={title}
                                        className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600"
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockShowtimes.map((showtime) => (
                                <tr
                                    key={showtime.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="font-medium text-gray-800">
                                            {showtime.movie}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                                        {showtime.theater}
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                                        {showtime.room}
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="text-gray-800">
                                            <div className="font-medium">
                                                {showtime.date}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <Clock
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {showtime.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 font-medium">
                                        {showtime.price.toLocaleString()}₫
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="text-sm">
                                            <span
                                                className={`font-medium ${
                                                    showtime.availableSeats < 20
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {showtime.availableSeats}
                                            </span>
                                            <span className="text-gray-500">
                                                /{showtime.totalSeats}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    showtime.availableSeats < 20
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                }`}
                                                style={{
                                                    width: `${
                                                        (showtime.availableSeats /
                                                            showtime.totalSeats) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded cursor-pointer">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded cursor-pointer">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
