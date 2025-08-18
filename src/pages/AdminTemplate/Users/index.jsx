import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Search, Edit, Trash2, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import { getListUsersApi, getListUsersPaginationApi } from "../../../services/users.api";
import { addUserApi, updateUserApi, deleteUserApi, getUserDetailApi } from "../../../store/users.slice";
import Pagination from "../../../components/Pagination";
import UserModal from "./_component/UserModal";
import UserDetailModal from "./_component/UserDetailModal";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPendingScroll, setIsPendingScroll] = useState(false);

    const itemsPerPage = 10;
    const hasClickedPagination = useRef(false);
    const searchTimeoutRef = useRef(null);
    const queryClient = useQueryClient();

    // debounce search
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            setSearchQuery(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchTerm]);

    // query khi không search
    const { data: paginatedData, isLoading: isPaginatedLoading, refetch } = useQuery({
        queryKey: ["users-paginated", "GP01", currentPage, itemsPerPage],
        queryFn: () => getListUsersPaginationApi("GP01", currentPage, itemsPerPage),
        keepPreviousData: true,
        enabled: !searchQuery,
    });

    // query khi search
    const { data: allUsersData, isLoading: isAllUsersLoading } = useQuery({
        queryKey: ["users-all", "GP01"],
        queryFn: () => getListUsersApi("GP01"),
        enabled: !!searchQuery,
        keepPreviousData: true,
    });

    const isLoading = searchQuery ? isAllUsersLoading : isPaginatedLoading;
    const allUsers = searchQuery ? (allUsersData || []) : [];

    // filter khi search
    const filteredUsers = searchQuery
        ? allUsers.filter((user) => {
            const safe = (val) => (val || "").toString().toLowerCase();
            const s = searchQuery.toLowerCase();
            const matchesSearch =
                safe(user.hoTen).includes(s) ||
                safe(user.taiKhoan).includes(s) ||
                safe(user.email).includes(s) ||
                safe(user.soDT).includes(s);
            const matchesType = !typeFilter || user.maLoaiNguoiDung === typeFilter;
            return matchesSearch && matchesType;
        })
        : (paginatedData?.items || []).filter((user) =>
            !typeFilter || user.maLoaiNguoiDung === typeFilter
        );

    const totalFilteredItems = searchQuery ? filteredUsers.length : (paginatedData?.totalCount || 0);
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

    const getPaginatedUsers = () => {
        if (searchQuery) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredUsers.slice(startIndex, endIndex);
        }
        return filteredUsers;
    };

    useEffect(() => {
        if (isPendingScroll && !isLoading && (paginatedData || allUsersData)) {
            const section = document.getElementById("users");
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setIsPendingScroll(false);
            hasClickedPagination.current = false;
        }
    }, [isLoading, paginatedData, allUsersData, isPendingScroll]);

    const handlePageChange = (page) => {
        hasClickedPagination.current = true;
        setIsPendingScroll(true);
        setCurrentPage(page);
    };

    // mutations
    const addUserMutation = useMutation({
        mutationFn: addUserApi,
        onSuccess: () => {
            toast.success("Thêm người dùng thành công!");
            setIsModalOpen(false);
            queryClient.invalidateQueries();
        },
        onError: (error) => toast.error(error.content || "Có lỗi khi thêm người dùng!"),
    });

    const updateUserMutation = useMutation({
        mutationFn: updateUserApi,
        onSuccess: () => {
            toast.success("Cập nhật người dùng thành công!");
            setIsModalOpen(false);
            queryClient.invalidateQueries();
        },
        onError: (error) => toast.error(error.content || "Có lỗi khi cập nhật người dùng!"),
    });

    const deleteUserMutation = useMutation({
        mutationFn: deleteUserApi,
        onSuccess: () => {
            toast.success("Xóa người dùng thành công!");
            queryClient.invalidateQueries();
        },
        onError: (error) => toast.error(error.content || "Có lỗi khi xóa người dùng!"),
    });

    const getUserDetailMutation = useMutation({
        mutationFn: getUserDetailApi,
        onSuccess: (data) => {
            setUserDetail(data.content);
            setIsDetailModalOpen(true);
        },
        onError: (error) => toast.error(error.content || "Có lỗi khi lấy thông tin!"),
    });

    const handleAddUser = () => { setSelectedUser(null); setIsModalOpen(true); };
    const handleEditUser = (user) => {
        if (user.maLoaiNguoiDung !== "KhachHang") return toast.warning("Chỉ sửa khách hàng!");
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    const handleDeleteUser = (user) => {
        if (user.maLoaiNguoiDung !== "KhachHang") return toast.warning("Chỉ xóa khách hàng!");
        if (window.confirm(`Bạn có chắc muốn xóa "${user.hoTen}"?`)) {
            deleteUserMutation.mutate(user.taiKhoan);
        }
    };
    const handleViewDetail = (user) => getUserDetailMutation.mutate(user.taiKhoan);
    const handleSubmitUser = (data) => selectedUser ? updateUserMutation.mutate(data) : addUserMutation.mutate(data);
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedUser(null); };
    const handleClearSearch = () => { setSearchTerm(""); setSearchQuery(""); setCurrentPage(1); };

    if (isLoading) {
        return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <div id="users" className="px-4 py-4 sm:px-6 sm:py-6">
            {/* header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                    <button
                        onClick={handleAddUser}
                        className="bg-gradient-to-r from-sky-300 to-blue-300  text-white px-4 py-2 rounded-lg font-bold text-1xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2 cursor-pointer">
                        <PlusCircle size={20} className="mr-2" /> Thêm người dùng
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3">
                    <div className="relative w-full sm:max-w-md">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border rounded-lg"
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="KhachHang">Khách hàng</option>
                        <option value="QuanTri">Quản trị</option>
                    </select>
                </div>
            </div>

            {/* table */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Tên</th>
                                <th className="text-left p-3">Tài khoản</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">SĐT</th>
                                <th className="text-left p-3">Loại</th>
                                <th className="text-left p-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedUsers().map((user) => (
                                <tr key={user.taiKhoan} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{user.hoTen}</td>
                                    <td className="p-3">{user.taiKhoan}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.soDT}</td>
                                    <td className="p-3">{user.maLoaiNguoiDung}</td>
                                    <td className="p-3 flex gap-2">
                                        <button onClick={() => handleViewDetail(user)} className="text-blue-600"><Eye size={16} /></button>
                                        <button onClick={() => handleEditUser(user)} className={`p-1 rounded transition ${user.maLoaiNguoiDung === "KhachHang" ? "text-yellow-600 hover:bg-yellow-50" : 'opacity-20'}`}><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteUser(user)} className={`text-red-600 ${user.maLoaiNguoiDung === "KhachHang" ? "text-yellow-600 hover:bg-yellow-50" : 'opacity-20'} `}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {getPaginatedUsers().length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : "Không có người dùng nào."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 border-t">
                    <p className="text-sm text-gray-600 text-center">
                        Hiển thị {Math.min(itemsPerPage, getPaginatedUsers().length)} người dùng mỗi trang – Tổng cộng {totalFilteredItems} người dùng
                    </p>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            classNameBtn="px-3 py-1 border rounded hover:bg-gray-50"
                            prevText="Trước"
                            nextText="Sau"
                        />
                    )}
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitUser}
                user={selectedUser}
                isLoading={addUserMutation.isPending || updateUserMutation.isPending}
            />

            {isDetailModalOpen && userDetail && (
                <UserDetailModal 
                    setIsDetailModalOpen={setIsDetailModalOpen}
                    userDetail={userDetail}
                />
            )}

        </div>
    );
}
