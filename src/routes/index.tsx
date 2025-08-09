import { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { RouteObject } from "react-router-dom";
// import HomeTemplate from "../components/Layout/HomeTemplate";
// import HomePage from "../pages/HomeTemplate/HomePage";
// import AboutPage from "../pages/HomeTemplate/AboutPage";
// import LoginPage from "../pages/LoginPage";
// import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
// import MovieDetailsPage from "../pages/HomeTemplate/MovieDetailsPage";
// import DashboardPage from "../pages/AdminTemplate/Dashboard";
// import AdminTemplate from "../components/Layout/AdminTemplate";
// import ProductsPage from "../pages/AdminTemplate/Products";
// import FlashSalePage from "../pages/AdminTemplate/FlashSale";
import ProtectedRoute from "./ProtectedRoute";
import LoadingUI from "../components/Loading";
// import UsersPage from "../pages/AdminTemplate/Users";
// import TheatersPage from "../pages/AdminTemplate/Theaters";
// import Bookings from "../pages/AdminTemplate/Bookings";
// import ShowtimesPage from "../pages/AdminTemplate/Showtimes";

const HomeTemplate = lazy(() => import('../components/Layout/HomeTemplate'))
const HomePage = lazy(() => import('../pages/HomeTemplate/HomePage'))
const AboutPage = lazy(() => import('../pages/HomeTemplate/AboutPage'))
const ListMoviePage = lazy(() => import('../pages/HomeTemplate/ListMoviePage'))
const MovieDetailsPage = lazy(() => import('../pages/HomeTemplate/MovieDetailsPage'))
const DashboardPage = lazy(() => import('../pages/AdminTemplate/Dashboard'))
const AdminTemplate = lazy(() => import('../components/Layout/AdminTemplate'))
const ProductsPage = lazy(() => import('../pages/AdminTemplate/Products'))
const FlashSalePage = lazy(() => import('../pages/AdminTemplate/FlashSale'))
const UsersPage = lazy(() => import('../pages/AdminTemplate/Users'))
const TheatersPage = lazy(() => import('../pages/AdminTemplate/Theaters'))
const Bookings = lazy(() => import('../pages/AdminTemplate/Bookings'))
const ShowtimesPage = lazy(() => import('../pages/AdminTemplate/Showtimes'))
const LoginPage = lazy(() => import('../pages/LoginPage'))

const withSuspense = (Component: LazyExoticComponent<FC>) => {
    return  <Suspense fallback={<LoadingUI />}><Component /></Suspense>
}

export const routes: RouteObject[] = [
        {
        path: '',
        element: withSuspense(HomeTemplate),
        children: [
            {
                path: '',
                element: withSuspense(HomePage)
            },
            {
                path: 'about',
                element: withSuspense(AboutPage)
            },
            {
                path: 'list-movie',
                element: withSuspense(ListMoviePage)
            },
            {
                path: 'movie-details/:movieId',
                element: withSuspense(MovieDetailsPage)
            },
        ]
    },
    {
        path:'login',
        element: <LoginPage />
    },
    {
        path: 'admin',
        element: (
            <ProtectedRoute requiredRole="QuanTri">
                <AdminTemplate />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '',
                element: withSuspense(DashboardPage),
            },
            {
                path: 'products',
                element: withSuspense(ProductsPage),
            },
            {
                path: 'flash-sale',
                element: withSuspense(FlashSalePage),
            },
            {
                path: 'users',
                element: withSuspense(UsersPage),
            },
            {
                path: 'theaters',
                element: withSuspense(TheatersPage),
            },
            {
                path: 'showtimes',
                element: withSuspense(ShowtimesPage),
            },
            {
                path: 'bookings',
                element: withSuspense(Bookings),
            },
        ],
    },
]