import { Film,  Users,  Ticket,  Star, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListMovieApi } from '../../../services/movie.api';
import { useState } from 'react';
import ListMovies from './ListMovies';
import { getListUsersApi } from '../../../services/users.api';

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['list-movie', currentPage, itemsPerPage],
        queryFn: () => {
            return getListMovieApi('GP01', currentPage, itemsPerPage);
        }
    });

    const { data: users } = useQuery({
        queryKey: ['list-users'],
        queryFn: () => {
            return getListUsersApi('GP01');
        }
    });

    const totalUsers = users?.filter((user) => user.maLoaiNguoiDung === "KhachHang").length || 0;

    const stats = [
        {
            title: "Tổng phim",
            value: data?.totalCount,
            icon: Film,
            color: "bg-blue-500",
            change: "0%",
        },
        {
            title: "Vé đã bán",
            value: "0",
            icon: Ticket,
            color: "bg-green-500",
            change: "0$",
        },
        {
            title: "Người dùng",
            value: totalUsers,
            icon: Users,
            color: "bg-purple-500",
            change: "0%",
        },
        {
            title: "Doanh thu",
            value: "0",
            icon: DollarSign,
            color: "bg-yellow-500",
            change: "0%",
        },
    ];

    const recentBookings = [
        {
            id: "BK001",
            movie: "Avatar",
            customer: "Nguyễn Văn A",
            amount: "180,000₫",
            time: "10 phút trước",
        },
        {
            id: "BK002",
            movie: "Black Panther",
            customer: "Trần Thị B",
            amount: "240,000₫",
            time: "15 phút trước",
        },
        {
            id: "BK003",
            movie: "Top Gun",
            customer: "Lê Văn C",
            amount: "160,000₫",
            time: "22 phút trước",
        },
        {
            id: "BK004",
            movie: "Avatar",
            customer: "Phạm Thị D",
            amount: "320,000₫",
            time: "1 giờ trước",
        },
    ];



    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Tổng quan
                </h1>
                <p className="text-gray-600">
                    Tổng quan hệ thống quản lý rạp chiếu phim
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-green-600 mt-1">
                                        {stat.change}
                                    </p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                                >
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Movies */}
                <ListMovies data={data} itemsPerPage={itemsPerPage} />

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">
                            Đặt vé gần đây
                        </h3>
                        <Link
                            to="/admin/bookings/"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                        #{booking.id}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {booking.movie}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {booking.customer}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-green-600">
                                        {booking.amount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {booking.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
