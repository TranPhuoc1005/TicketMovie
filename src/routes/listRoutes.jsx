import HomeTemplate from "../components/Layout/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";
import AboutPage from "../pages/HomeTemplate/AboutPage";
import LoginPage from "../pages/LoginPage";
import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
import MovieDetailsPage from "../pages/HomeTemplate/MovieDetailsPage";
import DashboardPage from "../pages/AdminTemplate/Dashboard";
import AdminTemplate from "../components/Layout/AdminTemplate";
import ProductsPage from "../pages/AdminTemplate/Products";
import FlashSalePage from "../pages/AdminTemplate/FlashSale";
import ProtectedRoute from "./ProtectedRoute";
import UsersPage from "../pages/AdminTemplate/Users";
import TheatersPage from "../pages/AdminTemplate/Theaters";
import Bookings from "../pages/AdminTemplate/Bookings";
import ShowtimesPage from "../pages/AdminTemplate/Showtimes";

const listRoutes = [
    {
        path: '',
        element: HomeTemplate,
        nested: [
            {
                path: '',
                element: HomePage
            },
            {
                path: 'about',
                element: AboutPage
            },
            {
                path: 'list-movie',
                element: ListMoviePage
            },
            {
                path: 'movie-details/:movieId',
                element: MovieDetailsPage
            },
        ]
    },
    {
        path:'login',
        element: <LoginPage />
    },
    {
        path: 'admin',
        element: () => (
            <ProtectedRoute requiredRole="QuanTri">
                <AdminTemplate />
            </ProtectedRoute>
        ),
        nested: [
            {
                path: '',
                element: DashboardPage,
            },
            {
                path: 'products',
                element: ProductsPage,
            },
            {
                path: 'flash-sale',
                element: FlashSalePage,
            },
            {
                path: 'users',
                element: UsersPage,
            },
            {
                path: 'theaters',
                element: TheatersPage,
            },
            {
                path: 'showtimes',
                element: ShowtimesPage,
            },
            {
                path: 'bookings',
                element: Bookings,
            },
        ],
    },
];
export default listRoutes;