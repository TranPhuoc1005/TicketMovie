import { BarChart3, X,Search,Edit,Eye } from 'lucide-react';

export default function Bookings() {
    const mockBookings = [
        {
            id: "BK001",
            customer: "Nguyễn Văn A",
            email: "nguyenvana@email.com",
            movie: "Avatar: The Way of Water",
            theater: "CGV Vincom Center",
            showtime: "2024-08-02 14:30",
            seats: ["A1", "A2"],
            totalAmount: 170000,
            bookingDate: "2024-08-01 10:30",
            status: "Đã thanh toán",
        },
        {
            id: "BK002",
            customer: "Trần Thị B",
            email: "tranthib@email.com",
            movie: "Black Panther: Wakanda Forever",
            theater: "Lotte Cinema",
            showtime: "2024-08-02 16:00",
            seats: ["B5", "B6", "B7"],
            totalAmount: 285000,
            bookingDate: "2024-08-01 14:20",
            status: "Chờ thanh toán",
        },
        {
            id: "BK003",
            customer: "Lê Văn C",
            email: "levanc@email.com",
            movie: "Top Gun: Maverick",
            theater: "Galaxy Cinema",
            showtime: "2024-08-02 19:30",
            seats: ["C10"],
            totalAmount: 90000,
            bookingDate: "2024-08-01 20:15",
            status: "Đã hủy",
        },
    ];
    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý đặt vé
                    </h1>
                    <div className="flex space-x-2 justify-center">
                        <button className="bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 flex items-center cursor-pointer">
                            <BarChart3 size={20} className="mr-2" />
                            Xuất báo cáo
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                            <Search size={20} className="mr-2" />
                            Tìm kiếm vé
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                    <div className="relative flex-1 w-full">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Tìm theo mã đặt vé, tên khách hàng..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Tất cả trạng thái</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="pending">Chờ thanh toán</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Mã đặt vé
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Khách hàng
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Phim
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Rạp/Suất chiếu
                                </th>
                                <th className="w-[150px] text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Ghế
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Tổng tiền
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Trạng thái
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockBookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="font-medium text-blue-600">
                                            #{booking.id}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {booking.bookingDate}
                                        </div>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="font-medium text-gray-800">
                                            {booking.customer}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {booking.email}
                                        </div>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="font-medium text-gray-800">
                                            {booking.movie}
                                        </div>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="text-gray-800">
                                            {booking.theater}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {booking.showtime}
                                        </div>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="flex flex-wrap gap-1">
                                            {booking.seats.map((seat) => (
                                                <span
                                                    key={seat}
                                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                                >
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="font-medium text-gray-800">
                                            {booking.totalAmount.toLocaleString()}
                                            ₫
                                        </div>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <span
                                            className={`px-2 py-1 block rounded text-xs font-medium text-center ${
                                                booking.status ===
                                                "Đã thanh toán"
                                                    ? "bg-green-100 text-green-800"
                                                    : booking.status ===
                                                      "Chờ thanh toán"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="text-left py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="flex items-center space-x-2 sm:space-x-0.5">
                                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                                                <Edit size={16} />
                                            </button>
                                            {booking.status ===
                                                "Chờ thanh toán" && (
                                                <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                        Hiển thị 1-10 của 156 đặt vé
                    </p>
                    <div className="flex space-x-2 justify-center">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                            Trước
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                            3
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
