import React from 'react'

export default function Mainvisual() {
    return (
        <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-7xl mx-auto text-center">
                <div className="relative">
                    <div className="absolute -top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-bounce-slow"></div>
                    <div className="absolute -top-5 right-20 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-bounce-slow delay-75"></div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse-slow">
                            Trải nghiệm
                        </span>
                        <br />
                        <span className="text-white">điện ảnh</span>
                        <br />
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            đỉnh cao
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
                        Khám phá thế giới điện ảnh với chất lượng hình ảnh và âm thanh tuyệt vời. 
                        Đặt vé dễ dàng, trải nghiệm tuyệt vời.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span>Đặt vé ngay</span>
                        </button>
                        <button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            Xem trailer
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
