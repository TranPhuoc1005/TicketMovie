import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const topOffset = el.getBoundingClientRect().top + window.scrollY - 50;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
    };
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
                        <NavLink to="/login/" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform hover:shadow-lg">
                            Đăng nhập
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}
