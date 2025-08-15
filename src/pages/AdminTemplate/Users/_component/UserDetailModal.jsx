import { X } from 'lucide-react';
import React from 'react'

export default function UserDetailModal(props) {
    const {  } = props;
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsDetailModalOpen(false)}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px] transform transition-all duration-300 scale-100">
                    <div className="flex items-center justify-between p-5 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">👤 Thông tin người dùng</h3>
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X size={22} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Tài khoản</label>
                            <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">{userDetail.taiKhoan}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Họ tên</label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{userDetail.hoTen}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{userDetail.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{userDetail.soDT}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Loại tài khoản</label>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${userDetail.maLoaiNguoiDung === "QuanTri"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                    }`}
                            >
                                {userDetail.maLoaiNguoiDung === "QuanTri" ? "Quản trị" : "Khách hàng"}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Mã nhóm</label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{userDetail.maNhom}</p>
                        </div>
                    </div>

                    <div className="p-5 border-t border-gray-200">
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
