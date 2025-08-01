import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({children}) {
    const {user} = useSelector((state) => state.auth);
    if(!user || user.maLoaiNguoiDung !== "QuanTri") {
        return <Navigate to='/' replace />;
    }
    return children;
}