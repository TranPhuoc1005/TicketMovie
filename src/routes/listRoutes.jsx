import HomeTemplate from "../components/Layout/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";
import AboutPage from "../pages/HomeTemplate/AboutPage";
import LoginPage from "../pages/LoginPage";
import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
import MovieDetailsPage from "../pages/HomeTemplate/MovieDetailsPage";
import DashboardPage from "../pages/AdminTemplate/Dashboard";
import AdminRoute from "./AdminRoute";

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
        path: 'dashboard',
        element: (
            <AdminRoute>
                <DashboardPage />
            </AdminRoute>
        )
    }
];
export default listRoutes;