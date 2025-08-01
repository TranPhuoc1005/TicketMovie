import React from 'react'

export default function Banner() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center glass-effect rounded-2xl p-6 hover-lift">
                        <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
                        <div className="text-slate-300">Phim đã chiếu</div>
                    </div>
                    <div className="text-center glass-effect rounded-2xl p-6 hover-lift">
                        <div className="text-4xl font-bold text-pink-400 mb-2">50+</div>
                        <div className="text-slate-300">Rạp chiếu</div>
                    </div>
                    <div className="text-center glass-effect rounded-2xl p-6 hover-lift">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">1M+</div>
                        <div className="text-slate-300">Khách hàng</div>
                    </div>
                    <div className="text-center glass-effect rounded-2xl p-6 hover-lift">
                        <div className="text-4xl font-bold text-green-400 mb-2">4.9★</div>
                        <div className="text-slate-300">Đánh giá</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
