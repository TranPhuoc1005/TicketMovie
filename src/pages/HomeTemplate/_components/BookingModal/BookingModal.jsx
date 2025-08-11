import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { loginApi } from '../../../../services/auth.api.js';
import { clearUser, setUser } from '../../../../store/auth.slice.js';
import { getTicketApi } from '../../../../services/ticket.api.js';


export default function BookingModal(props) {
    const [selectedComplex, setSelectedComplex] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [values, setValues] = useState({
        taiKhoan: '',
        matKhau: ''
    })

    const { isOpen, onClose, cinemaDetail } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            }
        }
    }, [isOpen]);

    const user = useSelector((state) => state.authSlice.user);
    const { mutate: handleLogin, isPending } = useMutation({
        mutationFn: (valuesHandleLogin) => loginApi(valuesHandleLogin),
        onSuccess: (user) => {
            if (!user) return;
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(setUser(user));
        }
    });

    const { data: ticketRoom } = useQuery({
        queryKey: ['ticket-room', selectedSchedule?.maLichChieu],
        queryFn: () => getTicketApi(selectedSchedule.maLichChieu),
        enabled: !!selectedSchedule?.maLichChieu,
    });

    const handleLogout = () => {
        localStorage.clear();
        dispatch(clearUser());
    }

    const handleCloseModal = () => {
        document.body.style.overflow = '';
        onClose();
    }

    //============================== RENDER DANH SÁCH HỆ THỐNG RẠP CHIẾU
    const renderCinemas = () => {
        if (!cinemaDetail?.heThongRapChieu) return null;
        return cinemaDetail.heThongRapChieu.map((cinema) => (
            <div key={cinema.maHeThongRap} className="flex flex-col gap-4">
                {cinema.cumRapChieu.map((complex) => {
                    const isActive = selectedComplex?.maCumRap === complex.maCumRap;
                    return (
                        <div
                            key={complex.maCumRap}
                            onClick={() => setSelectedComplex(complex)}
                            className={`glass-effect rounded-xl p-4 border cursor-pointer transition-all hover-lift ${isActive ? "border-purple-500 bg-purple-600/20" : "border-purple-500/50"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <p><img src={cinema.logo} className='w-[40px]' alt={cinema.tenHeThongRap} /></p>
                                    <div>
                                        <h4 className="text-white font-semibold">{complex.tenCumRap}</h4>
                                        <p className="text-slate-400 text-sm">{complex.diaChi}</p>
                                    </div>
                                </div>
                                <div
                                    className={`w-5 h-5 border-2 rounded-full transition-colors ${isActive ? "bg-purple-500 border-purple-500" : "border-purple-500"
                                        }`}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ));
    };
    //============================== END RENDER DANH SÁCH HỆ THỐNG RẠP CHIẾU


    //============================== RENDER DANH DANH LỊCH CHIẾU PHIM
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    {/* CHỌN NGÀY*/ }
    const renderShowtime = () => {
        if (!selectedComplex) return <p className="text-slate-400">Chọn một rạp để xem lịch chiếu.</p>;
        const uniqueDays = Array.from(
            new Set(
                selectedComplex.lichChieuPhim.map(schedule =>
                    schedule.ngayChieuGioChieu.slice(0, 10)
                )
            )
        );
        return (
            <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
                {uniqueDays.map((dayStr) => {
                    const dateObj = new Date(dayStr);
                    const day = daysShort[dateObj.getDay()];
                    const date = dateObj.getDate();
                    const month = monthsShort[dateObj.getMonth()];
                    const isActive = selectedDay === dayStr;

                    return (
                        <div
                            key={dayStr}
                            onClick={() => {
                                if (isActive) {
                                    setSelectedDay(null);
                                    setSelectedTime(null);
                                    setSelectedSchedule(null);
                                } else {
                                    setSelectedDay(dayStr);
                                    setSelectedTime(null);
                                    setSelectedSchedule(null);
                                }
                            }}
                            className={`flex-shrink-0 p-3 rounded-xl text-center cursor-pointer min-w-[80px] transition-all border ${isActive
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none"
                                    : "glass-effect text-white border-purple-500/50 hover:from-purple-600 hover:to-pink-600 hover:bg-gradient-to-r hover:text-white hover:border-none"
                                }`}
                        >
                            <div className="text-sm font-medium">{day}</div>
                            <div className="text-lg font-bold">{date}</div>
                            <div className="text-xs">{month}</div>
                        </div>
                    );
                })}
            </div>
        );
    };
    {/* CHỌN GIỜ */ }
    const renderTimeSlots = () => {
        if (!selectedComplex || !selectedDay) return null;
        const showtimes = selectedComplex.lichChieuPhim.filter((item) =>
            item.ngayChieuGioChieu.startsWith(selectedDay)
        );
        return showtimes.map((item) => {
            const d = new Date(item.ngayChieuGioChieu);
            const hhmm = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
            const isActive = selectedSchedule?.maLichChieu === item.maLichChieu;
            return (
                <button
                    key={item.maLichChieu}
                    onClick={() => {
                        const d = new Date(item.ngayChieuGioChieu);
                        const hhmm = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
                        setSelectedTime(hhmm);
                        setSelectedSchedule(item);
                    }}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer ${isActive ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105" : "glass-effect text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:scale-105"}`}
                >
                    {hhmm}
                </button>
            );
        });
    };
    //============================== END RENDER DANH DANH LỊCH CHIẾU PHIM


    //============================== RENDER DANH SÁCH GHÊ
    const listSeats = (seats, size = 20) => {
        const result = [];
        for (let i = 0; i < seats.length; i += size) {
            result.push(seats.slice(i, i + size));
        }
        return result;
    };
    const renderSeats = () => {
        if (!ticketRoom?.danhSachGhe) return null;

        const toggleSeat = (seat) => {
            setSelectedSeats((prev) => {
                const isSelected = prev.some((s) => s.maGhe === seat.maGhe);
                return isSelected ? prev.filter((s) => s.maGhe !== seat.maGhe) : [...prev, seat];
            });
        }
        const rows = listSeats(ticketRoom.danhSachGhe, 20);
        return rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2 mb-2">
                {row.map((seat) => {
                    return (
                        <div
                            key={seat.maGhe}
                            onClick={() => !seat.daDat && toggleSeat(seat)}
                            className={`w-10 h-10 text-xs font-semibold rounded-lg flex items-center justify-center cursor-pointer transition-all
                    ${seat.daDat ? "bg-slate-600 cursor-not-allowed" : selectedSeats.some((s) => s.maGhe === seat.maGhe) ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-slate-700 hover:bg-purple-500"}`}
                        >
                            {seat.tenGhe}
                        </div>
                    );
                })}
            </div>
        ));
    };
    //============================== END RENDER DANH SÁCH GHÊ

    const totalPrice = selectedSeats.length * (selectedSchedule?.giaVe || 0);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin(values);
    }
    if (!isOpen && !props.children) return null;
    return (
        <section id="bookingModal" className="fixed flex inset-0 bg-black/60 backdrop-blur-sm z-50 items-center justify-center p-4">
            <div className="mx-auto glass-effect rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-slate-700/50">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {cinemaDetail?.tenPhim}
                            </h2>
                        </div>
                        <button onClick={handleCloseModal} className="text-slate-400 hover:text-white text-3xl font-bold w-12 h-12 rounded-full hover:bg-slate-700/50 transition-all cursor-pointer pb-[5px] pl-[2px]">
                            ×
                        </button>
                    </div>
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className={`w-10 h-10 ${currentStep === 1 ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-slate-700 text-slate-400"} rounded-full flex items-center justify-center font-semibold text-sm`}>
                                    1
                                </div>
                                <span className="ml-3 text-white font-medium">Chọn rạp & suất</span>
                            </div>
                            <div className={`w-16 h-1 ${currentStep === 1 ? "bg-gradient-to-r from-purple-600 to-pink-600 rounded" : "bg-slate-700"}`}></div>


                            <div className="flex items-center">
                                <div className={`w-10 h-10 ${currentStep === 2 ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-slate-700 text-slate-400"} rounded-full flex items-center justify-center font-semibold text-sm`}>
                                    2
                                </div>
                                <span className="ml-3 text-slate-400 font-medium">Chọn ghế</span>
                            </div>
                            <div className={`w-16 h-1 ${currentStep === 2 ? "bg-gradient-to-r from-purple-600 to-pink-600 rounded" : "bg-slate-700"}`}></div>


                            <div className="flex items-center">
                                <div className={`w-10 h-10 ${currentStep === 3 ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-slate-700 text-slate-400"} rounded-full flex items-center justify-center font-semibold text-sm`}>
                                    3
                                </div>
                                <span className="ml-3 text-slate-400 font-medium">Thanh toán</span>
                            </div>
                        </div>
                    </div>
                    {/* Chọn rạp */}
                    <div className={`booking-step ${currentStep === 1 ? '' : 'hidden'}`} id="step1">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    Chọn rạp chiếu
                                </h3>
                                <div className="space-y-3 max-h-[400px] overflow-auto">
                                    {renderCinemas()}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    Chọn ngày & giờ
                                </h3>
                                <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
                                    {renderShowtime()}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {renderTimeSlots()}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!selectedSchedule) return;
                                setCurrentStep(2);
                            }}
                            disabled={!selectedSchedule}
                            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${selectedTime ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-[1.02] hover:shadow-lg cursor-pointer' : 'glass-effect text-slate-500 cursor-not-allowed border border-slate-700/50'}`}
                        >
                            Tiếp tục chọn ghế
                        </button>
                    </div>
                    <div className={`booking-step ${currentStep === 2 ? '' : 'hidden'}`} id="step2">
                        <div className="mb-8">
                            <div className="w-full flex items-center justify-center mb-8">
                                <div className="w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white px-12 py-3 rounded-full text-sm font-semibold shadow-lg">
                                    🎬 MÀN HÌNH
                                </div>
                            </div>
                            <div className="glass-effect rounded-2xl p-6 mb-6">
                                <div className="grid grid-cols-1 gap-2 mb-6" id="seatGrid">
                                    {renderSeats()}
                                </div>
                                <div className="flex items-center justify-center space-x-8 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-white rounded"></div>
                                        <span className="text-slate-300">Trống</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
                                        <span className="text-slate-300">Đã chọn</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                                        <span className="text-slate-300">Đã đặt</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30 mb-6">
                                <div className="flex items-center justify-between text-white">
                                    <div>
                                        <p className="font-semibold mb-1">Ghế đã chọn: {selectedSeats.map((s) => s.tenGhe).join(', ') || 'Chưa chọn'}</p>
                                        <p className="text-slate-300">Số lượng: {selectedSeats.length} ghế</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-green-400 mb-1">{totalPrice.toLocaleString()}đ</p>
                                        <p className="text-slate-300">Tổng tiền</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="flex-1 glass-effect text-white py-4 rounded-xl font-semibold transition-all hover:bg-slate-700/50 border border-slate-600/50 cursor-pointer"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setCurrentStep(3)}
                                className={`flex-1 ${selectedSeats.length !== 0 ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-[1.02] hover:shadow-lg cursor-pointer' : 'glass-effect text-slate-500 cursor-not-allowed border border-slate-700/50'} py-4 rounded-xl font-semibold transition-all`}
                                disabled={selectedSeats.length === 0}
                            >
                                Nhập thông tin
                            </button>
                        </div>
                    </div>
                    <div className={`booking-step ${currentStep === 3 ? '' : 'hidden'}`} id="step3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Thông tin khách hàng
                                </h3>
                                {!user ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-white">Tài khoản</label>
                                            <input
                                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-white"
                                                value={values.taiKhoan}
                                                name='taiKhoan'
                                                onChange={e => setValues({ ...values, taiKhoan: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white">Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-white"
                                                value={values.matKhau}
                                                name='matKhau'
                                                onChange={e => setValues({ ...values, matKhau: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded"
                                        >
                                            {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-white space-y-2">
                                        <p><strong>Tài khoản:</strong> {user.taiKhoan}</p>
                                        <p><strong>Họ tên:</strong> {user.hoTen}</p>
                                        <p className='mb-5'><strong>Email:</strong> {user.email}</p>
                                        <button
                                            onClick={handleLogout}
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded cursor-pointer"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="glass-effect rounded-2xl p-6 border border-slate-600 h-fit">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Thông tin đặt vé
                                </h3>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phim:</span>
                                        <span className="text-white font-medium">{cinemaDetail?.tenPhim}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Rạp:</span>
                                        <span className="text-white">{selectedComplex?.tenCumRap}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Ngày:</span>
                                        <span className="text-white">{selectedDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Suất chiếu:</span>
                                        <span className="text-white">{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Ghế:</span>
                                        <span className="text-white">{selectedSeats.map(s => s.tenGhe).join(', ')}</span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-lg font-bold border-t border-slate-600 pt-2 mt-2">
                                            <span className="text-white">Tổng cộng:</span>
                                            <span className="text-green-400">{totalPrice.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 glass-effect text-white py-4 rounded-xl font-semibold transition-all hover:bg-slate-700/50 border border-slate-600/50 cursor-pointer"
                            >
                                Quay lại
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                                <span>Thanh toán</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
