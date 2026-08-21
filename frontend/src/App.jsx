import { Route, Routes } from 'react-router-dom'
import './App.css'

import MainLayout from './components/Layout/MainLayout'
import DashboardLayout from './components/Layout/DashboardLayout'

import Home from './pages/Home'
import About from './pages/About'
import Rentals from './pages/Rentals'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import DashboardHome from './pages/dashboard/DashboardHome'
import CalendarPage from './pages/dashboard/CalendarPage'
import ThemeSettings from './pages/dashboard/ThemeSettings'
import KanbanBoard from './pages/dashboard/KanbanBoard'

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth (no chrome) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* Studio admin portal */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="kanban" element={<KanbanBoard />} />
        <Route path="settings" element={<ThemeSettings />} />
      </Route>



      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
