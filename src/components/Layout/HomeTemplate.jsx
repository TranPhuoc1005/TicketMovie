import Header from '../../pages/HomeTemplate/_components/Header'
import Footer from '../../pages/HomeTemplate/_components/Footer'
import { Outlet } from 'react-router-dom'

export default function HomeTemplate() {
  return (
    <div className='wrapper'>
      <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
          <Header />
          <Outlet />
          <Footer />
      </div>
    </div>
  )
}
