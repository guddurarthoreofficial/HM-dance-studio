import { Link } from 'react-router-dom'
import './StaticPage.css'
import './Rentals.css'

const packages = [
  {
    name: 'Hip Hop / Bollywood / Contemporary',
    price: '₹1,999',
    period: '/ month',
    features: ['3 classes a week', 'Beginner to advanced batches', 'Recital performance slot'],
  },
  {
    name: 'Singing + Guitar Combo',
    price: '₹2,499',
    period: '/ month',
    features: ['2 instrument sessions a week', 'Personal practice sheet', 'Small-batch coaching'],
    featured: true,
  },
  {
    name: 'Wedding Choreography',
    price: 'Custom',
    period: 'per event',
    features: ['Couple or group routines', 'Flexible rehearsal scheduling', 'On-site run-through'],
  },
]

const hourly = [
  { name: 'Studio Floor (per hour)', price: '₹499' },
  { name: 'Sound System + Mic Setup', price: '₹799' },
  { name: 'Full Studio — Private Event', price: '₹3,499 / half-day' },
]

export default function Rentals() {
  return (
    <div className="static-page container page-fade">
      <p className="eyebrow">Studio &amp; rentals</p>
      <h1 className="static-page__title">Class packages, and studio space when you need it.</h1>
      <div className="stroke-divider" style={{ maxWidth: 220 }} />
      <p className="static-page__lead">
        Join a batch, or book the floor by the hour for rehearsal, auditions, or a private shoot.
        Every new package currently gets <strong style={{ color: 'var(--gold)' }}>free admission</strong>{' '}
        and <strong style={{ color: 'var(--gold)' }}>25% off</strong>.
      </p>

      <div className="pkg-grid">
        {packages.map((p) => (
          <div className={`card pkg-card ${p.featured ? 'is-featured' : ''}`} key={p.name}>
            {p.featured && <span className="tag tag-gold pkg-card__badge">Most Popular</span>}
            <h3 className="pkg-card__name">{p.name}</h3>
            <p className="pkg-card__price">{p.price} <span>{p.period}</span></p>
            <ul className="pkg-card__features">
              {p.features.map((f) => <li key={f}>✓ {f}</li>)}
            </ul>
            <Link to="/register" className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} pkg-card__cta`}>
              Choose Plan
            </Link>
          </div>
        ))}
      </div>

      <h2 className="rentals__sub-title">Rent the studio</h2>
      <div className="stroke-divider" style={{ maxWidth: 160, margin: '8px 0 24px' }} />
      <div className="card rentals__table">
        {hourly.map((h) => (
          <div className="rentals__row" key={h.name}>
            <span>{h.name}</span>
            <span className="rentals__row-price">{h.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
