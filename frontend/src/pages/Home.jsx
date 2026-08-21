import { Link } from 'react-router-dom'
import './Home.css'

const styles = [
  { name: 'Hip Hop', icon: '🕺' },
  { name: 'Bollywood', icon: '🎬' },
  { name: 'Contemporary', icon: '🤸' },
  { name: 'Free Style', icon: '🧢' },
  { name: 'Wedding Choreography', icon: '💃' },
]

const classes = [
  {
    name: 'Singing Class',
    tag: 'Find your voice',
    desc: 'Breath control, pitch, and stage confidence — express your soul, one note at a time.',
  },
  {
    name: 'Guitar Class',
    tag: 'Strum today, play forever',
    desc: 'Chords to fingerstyle, taught from the ground up for absolute beginners and hobbyists.',
  },
  {
    name: 'Dance Classes',
    tag: 'Hip Hop · Bollywood · Contemporary',
    desc: 'Technique-first training that builds toward real choreography and real performances.',
  },
  {
    name: 'Stunt Class',
    tag: 'Learn. Practice. Perform fearlessly.',
    desc: 'Floor tricks, flips, and stage acrobatics taught with proper spotting and progressions.',
  },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="eyebrow">Motihari · Chandmari Glomber · Near Hanuman Mandir</p>
          <h1 className="hero__title">
            Dance nothing
            <br />
            without <span className="hero__title-accent">passion.</span>
          </h1>
          <div className="stroke-divider" style={{ maxWidth: 420 }} />
          <p className="hero__sub">
            HM Dance Studio trains dancers, singers, and guitarists of every level —
            from your first step on the floor to your first show on stage.
          </p>

          <div className="hero__actions">
            <Link to="/register" className="btn btn-primary">Book a Free Trial</Link>
            <Link to="/rentals" className="btn btn-ghost">See Classes &amp; Pricing</Link>
          </div>

          <div className="hero__offer">
            <span className="tag tag-magenta">Offer</span>
            <p className="hero__offer-text">
              <strong>Admission free</strong> on package &nbsp;+&nbsp; <strong className="hero__offer-pct">25% OFF</strong>
            </p>
          </div>
        </div>
      </section>

      {/* STYLES STRIP */}
      <section className="container styles-strip">
        {styles.map((s) => (
          <div className="styles-strip__item" key={s.name}>
            <span className="styles-strip__icon">{s.icon}</span>
            {s.name}
          </div>
        ))}
      </section>

      {/* CLASSES */}
      <section className="container section">
        <p className="eyebrow">What we teach</p>
        <h2 className="section__title">Four ways to find your stage.</h2>
        <div className="stroke-divider" style={{ maxWidth: 220, margin: '10px 0 34px' }} />

        <div className="classes-grid">
          {classes.map((c) => (
            <div className="class-card card" key={c.name}>
              <p className="class-card__tag">{c.tag}</p>
              <h3 className="class-card__name">{c.name}</h3>
              <p className="class-card__desc">{c.desc}</p>
              <Link to="/contact" className="class-card__link">Enquire →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="container">
        <div className="cta-band">
          <div>
            <h2 className="cta-band__title">Come, dance with us &amp;<br />discover the dancer in you.</h2>
          </div>
          <div className="cta-band__actions">
            <a href="tel:7488806350" className="btn btn-primary">Call 7488806350</a>
            <a href="tel:9006002329" className="btn btn-ghost">Call 9006002329</a>
          </div>
        </div>
      </section>
    </div>
  )
}
