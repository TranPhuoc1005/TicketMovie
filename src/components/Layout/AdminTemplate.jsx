
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../../pages/AdminTemplate/_components/Sidebar'
import Header from '../../pages/AdminTemplate/_components/Header';
import { useEffect, useState } from 'react';

export default function AdminTemplate() {
    const [ isToggle, setIsToggle ] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.maLoaiNguoiDung !== 'QuanTri') {
        return <Navigate to="/login" replace />;
    }
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1160) {
                setIsToggle(false);
            } else {
                setIsToggle(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="wrapper">
            <div className={`wrapper__content ${isToggle ? 'openSidebar' : 'closeSidebar'}`}>
                <div className="wrapper__sidebar">
                    <Sidebar 
                        isToggle={isToggle}
                        onToggleSidebar={() => setIsToggle(prev => !prev)} 
                    />
                </div>
                <div className="wrapper__main">
                    <Header 
                        isToggle={isToggle} 
                        onToggleSidebar={() => setIsToggle(prev => !prev)} 
                    />
                    <main>
                        <div className="content bg-white rounded-xl p-8 m-8 shadow-sm border border-gray-200">
                            <Outlet />
                        </div>
                    </main>
                    <footer id="footer">

                    </footer>
                </div>
            </div>
        </div>
    )
}
