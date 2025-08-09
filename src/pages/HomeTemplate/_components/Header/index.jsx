import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../../../../store/auth.slice';
import Alert from '../../../../components/Alert/Alert';

export default function Header() {
    const user = useSelector((state) => state.authSlice.user);
    const dispatch = useDispatch();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showTicketsModal, setShowTicketsModal] = useState(false);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const topOffset = el.getBoundingClientRect().top + window.scrollY - 50;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        Alert.logoutSuccess();
        localStorage.clear();
        dispatch(clearUser());
        setShowUserDropdown(false);
        setShowTicketsModal(false);
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setShowUserDropdown(false);
        }

        if(showUserDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showUserDropdown]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6M9 8h6m-6 4h6m-6 4h3"></path>
                            </svg>
                        </div>
                        <NavLink to='/'>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                CinemaX
                            </h1>
                        </NavLink>
                    </div>
                    
                    <nav className="hidden lg:flex items-center space-x-8">
                        <NavLink to='/' className="text-slate-300 hover:text-purple-400 transition-colors font-medium hover:scale-105 transform">Trang chủ</NavLink>
                        <button onClick={() => scrollToSection('movies')} className="text-slate-300 hover:text-purple-400 transition-colors font-medium hover:scale-105 transform">Phim</button>
                        <button onClick={() => scrollToSection('theaters')} className="text-slate-300 hover:text-purple-400 transition-colors font-medium hover:scale-105 transform">Rạp</button>
                        <button onClick={() => scrollToSection('promotions')} className="text-slate-300 hover:text-purple-400 transition-colors font-medium hover:scale-105 transform">Khuyến mãi</button>
                        <button onClick={() => scrollToSection('contact')} className="text-slate-300 hover:text-purple-400 transition-colors font-medium hover:scale-105 transform">Liên hệ</button>
                    </nav>
                    
                    <div className="flex items-center space-x-4">
                        <button className="text-slate-300 hover:text-white transition-colors hidden sm:block">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                        
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowUserDropdown((prev) => !prev);
                                    }}
                                    className="cursor-pointer w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                {showUserDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-xl shadow-xl z-50 py-2">
                                        <div className="px-4 py-2 border-b">
                                            <p className="font-semibold">{user.hoTen || user.taiKhoan}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>

                                        {user.maLoaiNguoiDung === "QuanTri" && (
                                            <Link
                                                to="/admin/"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                Quản trị hệ thống
                                            </Link>
                                        )}

                                        {user.maLoaiNguoiDung === "KhachHang" && (
                                            <>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() => {
                                                        setShowTicketsModal(true);
                                                        setShowUserDropdown(false);
                                                    }}
                                                >
                                                    Vé đã đặt
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() => {
                                                        alert("Modal thông tin người dùng – TODO: Hiện modal hoặc chuyển trang.");
                                                        setShowUserDropdown(false);
                                                    }}
                                                >
                                                    Thông tin tài khoản
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                            ) : (
                            <NavLink to="/login/" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform hover:shadow-lg">
                                Đăng nhập
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>

            {/* Tickets Modal */}
            {showTicketsModal && (
                <div className="h-screen fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-effect rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700/50">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Vé đã đặt</h2>
                                    <p className="text-slate-400">Danh sách các vé bạn đã đặt</p>
                                </div>
                                <button 
                                    onClick={() => setShowTicketsModal(false)}
                                    className="text-slate-400 hover:text-white text-3xl font-bold w-12 h-12 rounded-full hover:bg-slate-700/50 transition-all cursor-pointer pb-[5px] pl-[2px]"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Mock tickets data - replace with real data from your store */}
                            <div className="space-y-4">
                                {/* Ticket Item */}
                                <div className="glass-effect rounded-2xl p-6 border border-slate-600/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">Avatar: The Way of Water</h3>
                                                <p className="text-slate-400">CGV Vincom Landmark 81</p>
                                                <p className="text-slate-400 text-sm">Phòng: A1 - Ghế: D5, D6</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end space-y-2">
                                            <div className="text-right">
                                                <p className="text-white font-semibold">15/12/2024 - 19:30</p>
                                                <p className="text-green-400 font-bold">450,000đ</p>
                                            </div>
                                            <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                                Đã thanh toán
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Another Ticket */}
                                <div className="glass-effect rounded-2xl p-6 border border-slate-600/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">Spider-Man: No Way Home</h3>
                                                <p className="text-slate-400">Lotte Cinema Diamond Plaza</p>
                                                <p className="text-slate-400 text-sm">Phòng: B2 - Ghế: F8</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end space-y-2">
                                            <div className="text-right">
                                                <p className="text-white font-semibold">20/12/2024 - 21:00</p>
                                                <p className="text-green-400 font-bold">225,000đ</p>
                                            </div>
                                            <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                                                Chờ xác nhận
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Empty state if no tickets */}
                                {/* Uncomment this and remove mock data when implementing real data
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                    </svg>
                                    <p className="text-slate-400 text-lg mb-2">Chưa có vé nào</p>
                                    <p className="text-slate-500">Hãy đặt vé để xem phim yêu thích của bạn!</p>
                                </div>
                                */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}