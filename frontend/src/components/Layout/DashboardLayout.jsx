import { NavLink, Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import './DashboardLayout.css'

const navItems = [
  { to: '/dashboard', label: 'Overview', end: true, icon: '◆' },
  { to: '/dashboard/calendar', label: 'Class Calendar', icon: '▤' },
  { to: '/dashboard/kanban', label: 'Enrollment Board', icon: '▥' },
  { to: '/dashboard/settings', label: 'Theme Settings', icon: '●' },
]

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="dash">
      <aside className={`dash__sidebar ${open ? 'is-open' : ''}`}>
        <Link to="/" className="dash__brand">
          <span className="navbar__brand-hm">HM</span>
          <span className="dash__brand-sub">Studio Portal</span>
        </Link>

        <nav className="dash__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dash__navlink ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="dash__navicon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dash__sidebar-foot">
          <p className="eyebrow">HM Dance Studio</p>
          <p className="dash__foot-text">Chandmari Glomber, Motihari</p>
        </div>
      </aside>

      <div className="dash__body">
        <header className="dash__topbar">
          <button className="dash__menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <p className="dash__topbar-title">Studio Dashboard</p>
          <div className="dash__topbar-user">
            <div className="dash__avatar">HM</div>
          </div>
        </header>
        <main className="dash__content page-fade">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
