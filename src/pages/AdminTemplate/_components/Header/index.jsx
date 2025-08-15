import { useEffect, useRef, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import { clearUser } from "../../../../store/auth.slice";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export default function Header(props) {
    const { isToggle, onToggleSidebar } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        Alert.logoutSuccess();
        localStorage.clear();
        sessionStorage.clear();
        dispatch(clearUser());
        navigate('/login', { replace: true });
    };
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center">
                    <button
                        onClick={onToggleSidebar}
                        className={`hamburger-alt ${isToggle ? '' : 'open'}`} id="hamburger-alt"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                        Cinema Management
                    </h2>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="2"
                            strokeLinecap="round"
                            strokeWidth="round"
                            className="lucide lucide-bell text-gray-600"
                        >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>
                    {/* Avatar + Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    A
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                Admin User
                            </span>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <ul className="py-1 text-sm text-gray-700">
                                    <li>
                                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            Thông tin tài khoản
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
