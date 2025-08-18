import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-xl border-t border-slate-700/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                <div className="col-span-1 lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-sky-300 to-blue-300 p-2 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6M9 8h6m-6 4h6m-6 4h3"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-200 to-orange-200 bg-clip-text text-transparent">
                            THP Cinema
                        </h3>
                    </div>
                    <p className="text-white mb-6 max-w-md">
                        Mang đến trải nghiệm điện ảnh tuyệt vời với công nghệ hiện đại và dịch vụ chuyên nghiệp.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white hover:scale-110 transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                        </a>
                        <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white hover:scale-110 transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                            </svg>
                        </a>
                        <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white hover:scale-110 transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                                <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/>
                            </svg>
                        </a>
                        <a href="#" className="glass-effect w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white hover:scale-110 transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.44.64C13.07 0 14.1.17 14.82.58l-.04-.02c-.14-.06-.3-.1-.48-.1-.9 0-1.64.73-1.64 1.64v.9c-2.9.34-5.15 2.8-5.15 5.79 0 3.26 2.64 5.9 5.9 5.9s5.9-2.64 5.9-5.9c0-2.99-2.25-5.45-5.15-5.79v-.9c0-.91-.74-1.64-1.64-1.64-.18 0-.34.04-.48.1z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                
            </div>

            <div className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
                <p className="text-white text-sm">
                    © 2025 THP Cinema. Tất cả quyền được bảo lưu.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <div className="flex items-center space-x-2 text-white text-sm">
                        <span>Hotline:</span>
                        <span className="text-sky-300 font-semibold">0934 100 597</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}
