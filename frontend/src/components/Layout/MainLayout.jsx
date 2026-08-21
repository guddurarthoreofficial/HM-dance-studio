import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import '../Navbar.css'
import '../Footer.css'

export default function MainLayout() {
  return (
    <div className="site">
      <Navbar />
      <main className="page-fade">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
