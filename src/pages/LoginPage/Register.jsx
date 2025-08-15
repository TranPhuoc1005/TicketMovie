import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerApi } from '../../services/auth.api.js';
import Alert from '../../components/Alert/Alert.jsx';

export default function RegisterPage() {
    const [values, setValues] = useState({
        taiKhoan: '',
        matKhau: '',
        email: '',
        soDt: '',
        maNhom: 'GP01',
        hoTen: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: (valuesHandleRegister) => registerApi(valuesHandleRegister),
        onSuccess: () => {
            Alert.registerSuccess();
            navigate('/login');
        },
        onError: (error) => {
            console.error('Register error:', error);
            if (error.response?.data?.content) {
                Alert.registerError(error.response.data.content);
            } else {
                Alert.networkError();
            }
        }
    })

    const handleOnChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Validate form
        if (!values.taiKhoan || !values.matKhau || !values.email || !values.soDt || !values.hoTen) {
            Alert.registerError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (values.matKhau !== confirmPassword) {
            Alert.registerError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (values.matKhau.length < 6) {
            Alert.registerError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values.email)) {
            Alert.registerError('Email không hợp lệ');
            return;
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(values.soDt)) {
            Alert.registerError('Số điện thoại phải có 10-11 chữ số');
            return;
        }

        handleRegister(values);
    }

    return (
        <section className="register_page h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
            <div className="absolute inset-0 overflow-hidden">
                <div className="floating absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                <div className="floating absolute top-60 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full" style={{ animationDelay: "2s" }}></div>
                <div className="floating absolute bottom-20 left-20 w-16 h-16 bg-white bg-opacity-10 rounded-full" style={{animationDelay: "4s"}}></div>
                <div className="floating absolute bottom-40 right-32 w-24 h-24 bg-white bg-opacity-10 rounded-full" style={{animationDelay: "1s"}}></div>
            </div>

            <div className="glass-effect rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                    <div className="pulse-glow inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Đăng Ký</h1>
                    <p className="text-gray-200 text-sm">Tạo tài khoản mới cho hệ thống</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input 
                            onChange={handleOnChange}
                            value={values.hoTen}
                            type="text" 
                            name="hoTen"
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Họ và tên"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input 
                            onChange={handleOnChange}
                            value={values.taiKhoan}
                            type="text" 
                            name="taiKhoan"
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                        </div>
                        <input 
                            onChange={handleOnChange}
                            value={values.email}
                            type="email" 
                            name="email"
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                        </div>
                        <input 
                            onChange={handleOnChange}
                            value={values.soDt}
                            type="tel" 
                            name="soDt"
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Số điện thoại"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input 
                            onChange={handleOnChange}
                            value={values.matKhau}
                            type="password" 
                            name="matKhau"
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input 
                            onChange={handleConfirmPasswordChange}
                            value={confirmPassword}
                            type="password" 
                            name="confirmPassword"
                            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center justify-center">
                            {isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng ký...
                                </>
                            ) : (
                                <>
                                    <span className="ml-5">Đăng ký</span>
                                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
                                    </svg>
                                </>
                            )}
                        </span>
                    </button>

                    <button 
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full bg-transparent border border-white border-opacity-30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white hover:bg-opacity-10 hover:text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                            </svg>
                            <span>Đã có tài khoản? Đăng nhập</span>
                        </span>
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-300">
                        © 2025 Cinema Management System. Bảo mật cao.
                    </p>
                </div>
            </div>
        </section>
    )
}