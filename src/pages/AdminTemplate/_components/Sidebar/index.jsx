import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMobile, faTicket, faFire, faClose, faCartPlus, faFilm, faUser, faTheaterMasks, faCalendarDays, faBars, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "../../_scss/styles.scss";

library.add(faHome, faMobile, faTicket, faFire, faClose, faCartPlus, faBars);

export default function Sidebar(props) {
    const {isToggle, onToggleSidebar} = props;
    const sidebarNavItems = [
        {
            display: "Bảng điều khiển",
            icon: (
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
            ),
            to: "/admin",
            section: "",
        },
        {
            display: "Quản lý phim",
            icon: (
                <FontAwesomeIcon icon={faFilm} className="text-white text-xl" />
            ),
            to: "/admin/products",
            section: "products",
        },
        {
            display: "Danh sách rạp",
            icon: (
                <FontAwesomeIcon
                    icon={faTheaterMasks}
                    className="text-white text-xl"
                />
            ),
            to: "/admin/theaters",
            section: "theaters",
        },
        {
            display: "Lịch chiếu",
            icon: (
                <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="text-white text-xl"
                />
            ),
            to: "/admin/showtimes",
            section: "showtimes",
        },
        {
            display: "Quản lý đặt vé",
            icon: (
                <FontAwesomeIcon
                    icon={faTicket}
                    className="text-white text-xl"
                />
            ),
            to: "/admin/bookings",
            section: "bookings",
        },
        {
            display: "Bán chạy",
            icon: (
                <FontAwesomeIcon icon={faFire} className="text-white text-xl" />
            ),
            to: "/admin/flash-sale",
            section: "flash-sale",
        },
        {
            display: "Người dùng",
            icon: (
                <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
            ),
            to: "/admin/users",
            section: "users",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);

    const sidebarRef = useRef(null);
    const indicatorRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                const width = window.innerWidth;
                if (width <= 1160 && isToggle) {
                    onToggleSidebar();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isToggle, onToggleSidebar]);

    useEffect(() => {
        const sidebarItem =
            sidebarRef.current?.querySelector(".sidebar__menu li");
        if (sidebarItem) {
            setStepHeight(sidebarItem.clientHeight);
            if (indicatorRef.current) {
                indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            }
        }
    }, []);

    useEffect(() => {
        const currentPath = location.pathname.split("/")[2];
        const activeItemIndex = sidebarNavItems.findIndex(
            (item) => item.section === (currentPath || "")
        );
        setActiveIndex(activeItemIndex !== -1 ? activeItemIndex : 0);
    }, [location]);


    const handleLinkClick = () => {
        if (window.innerWidth <= 1160 && isToggle) {
            onToggleSidebar();
        }
    };

    return (
        <>
            <aside ref={sidebarRef} className={`sidebar bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out delay-200 ${isToggle ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
                <div className="sidebar__logo mr-[0.625em]">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011-1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6M9 8h6m-6 4h6m-6 4h3"
                                />
                            </svg>
                        </div>
                        <a
                            aria-current="page"
                            className="active"
                            href="/"
                            data-discover="true"
                        >
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                CinemaX
                            </h1>
                        </a>
                        <span onClick={onToggleSidebar} className="sidebar__close sp"><FontAwesomeIcon icon={faTimesCircle} className="text-3xl text-white" /></span>
                    </div>
                </div>

                <div className="sidebar__content">
                    <div className="sidebar__menu">
                        <ul>
                            <div
                                ref={indicatorRef}
                                className="sidebar__menu--indicator"
                                style={{
                                    transform: `translateY(${
                                        activeIndex * stepHeight
                                    }px)`,
                                }}
                            >
                                <span className="circle"></span>
                            </div>

                            {sidebarNavItems.map((item, index) => (
                                <li
                                    key={index}
                                    className={activeIndex === index ? "active" : ""}
                                >
                                    <Link
                                        to={item.to}
                                        onClick={handleLinkClick}
                                    >
                                        <span className="icon">
                                            {item.icon}
                                        </span>
                                        <span className="txt">
                                            {item.display}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
}
