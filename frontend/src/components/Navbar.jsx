import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rentals', label: 'Studio & Rentals' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__brand-hm">HM</span>
          <span className="navbar__brand-rest">DANCE STUDIO</span>
        </Link>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/login" className="btn btn-ghost navbar__login" onClick={() => setOpen(false)}>
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary navbar__cta" onClick={() => setOpen(false)}>
            Join a Class
          </Link>
        </nav>

        <button
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
