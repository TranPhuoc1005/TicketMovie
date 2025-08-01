import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const navigate = useNavigate();
    const historyBack = () => {
        navigate('/', { replace: true })
    }
    const {user, loading, error} = useSelector((state) => state.auth);
    useEffect(() => {
        if(user && user.maLoaiNguoiDung === "QuanTri") {
            navigate('/dashboard/');
        }else if(user) {
            navigate('/');
        }
    },[user, navigate]);
    return (
        <section className="login_page h-screen flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
                <div className="floating absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                <div className="floating absolute top-60 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full" style={{ animationDelay: "2s" }}></div>
                <div className="floating absolute bottom-20 left-20 w-16 h-16 bg-white bg-opacity-10 rounded-full" style={{animationDelay: "4s"}}></div>
                <div className="floating absolute bottom-40 right-32 w-24 h-24 bg-white bg-opacity-10 rounded-full" style={{animationDelay: "1s"}}></div>
            </div>

            <div className="glass-effect rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10">
                
                <div className="text-center mb-8">
                    <div className="pulse-glow inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4z"/>
                            <path fillRule="evenodd" d="M18 8.5H2V15a2 2 0 002 2h12a2 2 0 002-2V8.5zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Cinema Admin</h1>
                    <p className="text-gray-200 text-sm">Hệ thống quản lý rạp chiếu phim</p>
                </div>

                <form id="loginForm" className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="username"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Tên đăng nhập"
                            autoComplete="username"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            id="password"
                            required
                            className="w-full pl-10 pr-12 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Mật khẩu"
                            autoComplete="current-password"
                        />
                        <button 
                            type="button"
                            id="togglePassword"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                            autoComplete="off"
                        >
                            <svg id="eyeIcon" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-200 cursor-pointer">
                            <input type="checkbox" className="sr-only" />
                            <div className="relative w-4 h-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded transition-all duration-200 checkbox">
                                <svg className="w-3 h-3 text-purple-600 absolute top-0.5 left-0.5 hidden check-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <span className="ml-2">Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" className="text-sm text-purple-300 hover:text-purple-100 transition-colors duration-200">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                        autoComplete="off"
                    >
                        <span className="flex items-center justify-center">
                            <span id="loginText" className="ml-5">Đăng nhập</span>
                            <svg id="loginIcon" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM9.293 6.707a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L11.586 11H3a1 1 0 110-2h8.586L10.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                        </span>
                    </button>
                    <button 
                        type="submit"
                        onClick={historyBack}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                        autoComplete="off"
                    >
                        <span className="flex items-center justify-center">
                            <svg id="loginIcon" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span id="loginText" className="mr-5">Quay lại</span>
                        </span>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-300">
                        © 2025 Cinema Management System. Bảo mật cao.
                    </p>
                </div>
            </div>
        </section>
    )
}
