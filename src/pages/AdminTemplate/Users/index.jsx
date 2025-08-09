import { PlusCircle, Search, Edit, Trash2, Eye } from 'lucide-react';

export default function UsersPage() {
    const mockUsers = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            email: "nguyenvana@email.com",
            phone: "0901234567",
            type: "KhachHang",
            status: "Active",
        },
        {
            id: 2,
            name: "Trần Thị B",
            email: "tranthib@email.com",
            phone: "0907654321",
            type: "KhachHang",
            status: "Active",
        },
        {
            id: 3,
            name: "Admin User",
            email: "admin@cinema.com",
            phone: "0909999999",
            type: "QuanTri",
            status: "Active",
        },
    ];
    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý người dùng
                    </h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                        <PlusCircle size={20} className="mr-2" />
                        Thêm người dùng
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Tất cả loại</option>
                        <option value="KhachHang">Khách hàng</option>
                        <option value="QuanTri">Quản trị</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Tên
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Email
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Số điện thoại
                                </th>
                                <th className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-gray-600">
                                    Loại tài khoản
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
                            {mockUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-sm font-medium">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-800">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                                        {user.phone}
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.type === "QuanTri"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1 text-red-600 hover:bg-red-100 rounded">
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
