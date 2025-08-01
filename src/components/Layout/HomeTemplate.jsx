import Header from '../../pages/HomeTemplate/_components/Header'
import Footer from '../../pages/HomeTemplate/_components/Footer'
import { Outlet } from 'react-router-dom'

export default function HomeTemplate() {
  return (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
  )
}
