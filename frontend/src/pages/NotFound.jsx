import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div
      className="page-fade"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: 'clamp(50px, 10vw, 100px)', color: 'var(--gold)', margin: '10px 0' }}>
        Off Beat.
      </h1>
      <p style={{ color: 'var(--mute)', maxWidth: 380, marginBottom: 28 }}>
        This page missed its cue. The step you're looking for isn't in this routine.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )
}
