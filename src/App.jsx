import './App.css'
import { BrowserRouter, Routes } from 'react-router-dom'
import generateRoutes from './routes'
import ScrollToTop from './components/ScrollToTop'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUserFromStorage } from './store/auth'

function App() {
    // Redux store không giữ được user sau khi reload F5 loadUserFromStorage() giúp khôi phục lại state.auth.user ngay khi app load.
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {generateRoutes()}
            </Routes>
        </BrowserRouter>
    )
}
export default App
