import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="auth page-fade">
      <div className="auth__glow" aria-hidden="true" />
      <div className="auth__card card auth__card--wide">
        <Link to="/" className="navbar__brand" style={{ marginBottom: 26 }}>
          <span className="navbar__brand-hm">HM</span>
          <span className="navbar__brand-rest">DANCE STUDIO</span>
        </Link>

        <span className="tag tag-magenta" style={{ marginBottom: 12 }}>Admission free · 25% off on package</span>
        <h1 className="auth__title">Join a class.</h1>

        <form onSubmit={handleSubmit} className="auth__form auth__form--grid">
          <div>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" placeholder="Enter your name" required />
          </div>
          <div>
            <label htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" placeholder="10-digit mobile number" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="style">Class interested in</label>
            <select id="style" name="style" defaultValue="">
              <option value="" disabled>Select a class</option>
              <option>Hip Hop</option>
              <option>Bollywood</option>
              <option>Contemporary</option>
              <option>Free Style</option>
              <option>Wedding Choreography</option>
              <option>Singing Class</option>
              <option>Guitar Class</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="password">Create password</label>
            <input id="password" type="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary auth__submit" style={{ gridColumn: '1 / -1' }}>
            Create Account
          </button>
        </form>

        <p className="auth__switch">
          Already training with us? <Link to="/login">Log in</Link>
        </p>
        <Link to="/" className="auth__back">← Back to site</Link>
      </div>
    </div>
  )
}
