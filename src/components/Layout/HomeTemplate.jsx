import Header from '../../pages/HomeTemplate/_components/Header'
import Footer from '../../pages/HomeTemplate/_components/Footer'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { getBookingHistoryApi } from '../../services/users.api';
import { useSelector } from 'react-redux';

export default function HomeTemplate() {
    const user = useSelector((state) => state.authSlice.user);

    const { data: bookingHistory, refetch: refetchBookingHistory } = useQuery({
        queryKey: ['booking-history', user?.taiKhoan],
        queryFn: () => getBookingHistoryApi(user.taiKhoan),
        enabled: !!user?.taiKhoan,
    });
    return (
        <div className='wrapper'>
            <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
                <Header 
                    bookingHistory={bookingHistory} 
                    refetchBookingHistory={refetchBookingHistory} 
                />
                <Outlet context={{refetchBookingHistory}} />
                <Footer />
            </div>
        </div>
    )
}
