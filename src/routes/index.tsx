import { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoadingUI from "../components/Loading";

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
const RegisterPage = lazy(() => import('../pages/LoginPage/Register'))

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
        path: 'login',
        element: withSuspense(LoginPage) // Thêm Suspense cho LoginPage
    },
    {
        path: 'register', // Thêm route cho RegisterPage
        element: withSuspense(RegisterPage)
    },
    {
        path: 'admin',
        element: (
            <ProtectedRoute requiredRole="QuanTri">
                {withSuspense(AdminTemplate)}
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