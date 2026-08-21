import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="auth page-fade">
      <div className="auth__glow" aria-hidden="true" />
      <div className="auth__card card">
        <Link to="/" className="navbar__brand" style={{ marginBottom: 26 }}>
          <span className="navbar__brand-hm">HM</span>
          <span className="navbar__brand-rest">DANCE STUDIO</span>
        </Link>

        <p className="eyebrow">Studio login</p>
        <h1 className="auth__title">Welcome back.</h1>

        <form onSubmit={handleSubmit} className="auth__form">
          <div>
            <label htmlFor="email">Email or phone</label>
            <input id="email" name="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary auth__submit">Log In</button>
        </form>

        <p className="auth__switch">
          New to HM Dance Studio? <Link to="/register">Create an account</Link>
        </p>
        <Link to="/" className="auth__back">← Back to site</Link>
      </div>
    </div>
  )
}
