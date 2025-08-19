import './App.css'
import { BrowserRouter, Routes, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import ScrollToTop from './components/ScrollToTop'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setUser } from './store/auth.slice'
import { ToastContainer } from 'react-toastify'

function App() {
    const routerElements = useRoutes(routes)
    const dispatch = useDispatch();

    useEffect(() => {
        const userLocal = localStorage.getItem('user');
        if(userLocal) {
            dispatch(setUser(JSON.parse(userLocal)));
        }
    }, [dispatch]);
    return (
        <>
            <ScrollToTop />
            {routerElements}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
export default App
