import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string | null;
}

const ProtectedRoute = ({ children, requiredRole = null }: ProtectedRouteProps) => {
    const userLocal:string | null = localStorage.getItem('user');
    const userParse:any = userLocal ? JSON.parse(userLocal) : null;
    if (!userParse) {
        return <Navigate to="/login" replace />;
    }
    if (requiredRole && userParse.maLoaiNguoiDung !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;