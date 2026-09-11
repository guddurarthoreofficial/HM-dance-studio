import { useState } from 'react'

// ---- Config: change these two things and the whole site updates ----
const SOCIAL = {
  instagram: 'https://instagram.com/hmdancestudio', // change to your real handle
  facebook: 'https://facebook.com/hmdancestudio',   // change to your real page
}
const REGISTER_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdh3O9bcm18y7ZiPqCA7fYanD7jKLHdoNc9EMPKrKGqaHiHFw/viewform?usp=header'
const WHATSAPP_NUMBER = '918969664247' // Piyush Sir
const PHONE_NUMBERS = ['+91 74888 06350', '+91 90060 02329']
const MAP_QUERY = 'Chandmari Golamber, Near Hanuman Mandir, Motihari, Bihar'

const PROGRAMS = [
  { name: 'Hip Hop', mark: 'HH', desc: 'Breaks, grooves and freestyle power — build rhythm before you build tricks.' },
  { name: 'Bollywood', mark: 'BW', desc: 'High-energy film choreography, expression and stage presence.' },
  { name: 'Contemporary', mark: 'CN', desc: 'Fluid, emotive movement rooted in control and storytelling.' },
  { name: 'Semi Classical', mark: 'SC', desc: 'Traditional footwork and mudras blended with modern staging.' },
  { name: 'Free Style', mark: 'FS', desc: 'No set steps — find your own vocabulary and battle-ready confidence.' },
  { name: 'Kids Dance', mark: 'KD', desc: 'Coordination, discipline and confidence, taught through play.' },
  { name: 'Yoga', mark: 'YG', desc: 'Breath, flexibility and strength — the foundation every dancer needs.' },
  { name: 'Exercise', mark: 'EX', desc: 'Conditioning and fitness training built around a dancer\'s body.' },
]

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 1.8c2.15 0 4.17.84 5.69 2.36a7.99 7.99 0 0 1 2.35 5.68c0 4.44-3.61 8.05-8.05 8.05a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.14.82.84-3.06-.19-.31a8.03 8.03 0 0 1-1.23-4.28c0-4.44 3.62-8.05 8.06-8.05h.06zm-4.4 4.6c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35 1 2.51c.12.17 1.7 2.72 4.22 3.71 2.08.83 2.5.66 2.96.62.46-.04 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.37-.78-1.87-.2-.49-.42-.42-.56-.43z"/>
    </svg>
  )
}
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.1h2.7l.4-3.15h-3.1V7.79c0-.91.25-1.53 1.56-1.53h1.66V3.44C15.94 3.31 15 3.24 13.93 3.24c-2.34 0-3.94 1.43-3.94 4.05v2.5H7.28v3.15h2.71V21h3.51z" />
    </svg>
  )
}
function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  )
}
function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M4 4h4l1.5 4.5-2 1.5a13 13 0 0 0 6 6l1.5-2L19 15.5V19.5c0 .8-.7 1.3-1.5 1.2C9.4 19.9 4 14.5 4 5.5 4 4.7 3.9 4 4 4z" />
    </svg>
  )
}

function Navbar({ onRegister }) {
  const [open, setOpen] = useState(false)
  const links = [
    ['Home', '#top'],
    ['Programs', '#programs'],
    ['About', '#about'],
    ['Location', '#location'],
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-stage-line bg-stage-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-wide text-gold">HM</span>
          <span className="font-body text-sm font-semibold tracking-wide text-ivory">Dance Studio</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="font-body text-sm text-muted transition-colors hover:text-ivory">
              {label}
            </a>
          ))}
          <button
            onClick={onRegister}
            className="rounded-sm bg-gold px-5 py-2 font-body text-sm font-semibold text-stage-black transition-colors hover:bg-gold-soft"
          >
            Register
          </button>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-ivory transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ivory transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-ivory transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-stage-line bg-stage-black px-5 pb-5 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="font-body text-base text-ivory">
                {label}
              </a>
            ))}
            <button
              onClick={onRegister}
              className="mt-1 rounded-sm bg-gold px-5 py-2.5 text-center font-body text-sm font-semibold text-stage-black"
            >
              Register
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

function Hero({ onRegister }) {
  const styles = ['Hip Hop', 'Bollywood', 'Contemporary', 'Semi Classical', 'Free Style', 'Kids Dance', 'Yoga']
  return (
    <section id="top" className="spotlight relative overflow-hidden border-b border-stage-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <p className="font-body text-sm font-medium text-crimson">Motihari, Bihar</p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] text-ivory sm:text-6xl">
            Dance Nothing
            <br />
            Without <span className="text-gold">Passion</span>
          </h1>
          <p className="mt-5 max-w-md font-body text-base leading-relaxed text-muted">
            HM Dance Studio trains dancers of every age in Hip Hop, Bollywood, Contemporary, Semi
            Classical and Free Style — plus Yoga and Exercise to build the body that carries it
            all. Taught by Piyush Sir.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {styles.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-stage-line px-3 py-1.5 font-body text-xs text-ivory/80"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onRegister}
              className="rounded-sm bg-gold px-7 py-3 font-body text-sm font-semibold text-stage-black transition-colors hover:bg-gold-soft"
            >
              Register for a class
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-body text-sm font-semibold text-ivory transition-colors hover:text-crimson"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/25 via-crimson/10 to-transparent blur-2xl" />
            <div className="absolute inset-6 rounded-full border border-stage-line" />
            <div className="absolute inset-16 rounded-full border border-gold/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-8xl text-ivory/90">HM</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-sm bg-crimson px-5 py-2 font-body text-xs font-bold uppercase tracking-wide text-ivory shadow-lg shadow-crimson/30">
              Admission Free · 25% off on package
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = PROGRAMS.map((p) => p.name)
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-b border-stage-line bg-gold py-3">
      <div className="animate-marquee flex w-max gap-10">
        {row.map((item, i) => (
          <span key={i} className="font-display text-lg text-stage-black">
            {item} <span className="mx-2 text-stage-black/40">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Programs() {
  return (
    <section id="programs" className="border-b border-stage-line bg-stage-black">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl text-ivory sm:text-5xl">What you can train in</h2>
          <p className="mt-4 font-body text-muted">
            Eight programs, one studio. Pick a style, or move between them as your training grows.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-stage-line bg-stage-line sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="group bg-stage-raised p-6 transition-colors hover:bg-stage-black">
              <span className="font-display text-sm text-crimson">{p.mark}</span>
              <h3 className="mt-3 font-body text-lg font-semibold text-ivory">{p.name}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About({ onRegister }) {
  return (
    <section id="about" className="border-b border-stage-line bg-stage-raised">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm border border-stage-line bg-gradient-to-br from-stage-black via-stage-raised to-stage-black">
          <div className="absolute inset-0 spotlight" />
          <div className="absolute inset-0 flex items-end p-5">
            <div>
              <p className="font-display text-3xl text-ivory">Piyush Sir</p>
              <p className="font-body text-sm text-muted">Founder &amp; Lead Instructor</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl text-ivory sm:text-5xl">Taught with discipline, danced with soul</h2>
          <p className="mt-5 max-w-xl font-body leading-relaxed text-muted">
            Piyush Sir has built HM Dance Studio around one idea — technique and expression grow
            together, not one after the other. Classes run in small, focused batches across Hip
            Hop, Bollywood, Contemporary, Semi Classical, Free Style and Kids Dance, with Yoga and
            Exercise sessions to keep every dancer's body strong and injury-free.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={onRegister}
              className="rounded-sm border border-gold px-6 py-3 font-body text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-stage-black"
            >
              Join a batch
            </button>
            <a
              href={`tel:${PHONE_NUMBERS[0].replace(/\s/g, '')}`}
              className="flex items-center gap-2 font-body text-sm font-semibold text-ivory transition-colors hover:text-crimson"
            >
              <PhoneIcon className="h-4 w-4" />
              {PHONE_NUMBERS[0]}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`
  return (
    <section id="location" className="border-b border-stage-line bg-stage-black">
      <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-sm border border-stage-line md:grid-cols-2">
        <div className="bg-stage-raised p-8 sm:p-12">
          <h2 className="font-display text-4xl text-ivory">Find the studio</h2>
          <div className="mt-6 flex items-start gap-3">
            <PinIcon className="mt-1 h-5 w-5 flex-shrink-0 text-gold" />
            <p className="font-body text-muted">
              Chandmari Golamber, Near Hanuman Mandir
              <br />
              Motihari, Bihar
            </p>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <PhoneIcon className="mt-1 h-5 w-5 flex-shrink-0 text-gold" />
            <div className="font-body text-muted">
              {PHONE_NUMBERS.map((n) => (
                <a key={n} href={`tel:${n.replace(/\s/g, '')}`} className="block hover:text-ivory">
                  {n}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-8 font-body text-sm text-muted">
            Open daily for scheduled batches. Message on WhatsApp to confirm class timings before
            your first visit.
          </p>
        </div>
        <iframe
          title="HM Dance Studio location"
          src={mapSrc}
          className="min-h-[320px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}

function CTA({ onRegister }) {
  return (
    <section className="border-b border-stage-line bg-gradient-to-br from-stage-raised to-stage-black">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="font-display text-4xl text-ivory sm:text-5xl">
          Come, dance with us &amp; discover the dancer in you
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-muted">
          Admission is free right now, with 25% off on package fees. Seats in each batch are
          limited — fill the registration form to hold yours.
        </p>
        <button
          onClick={onRegister}
          className="mt-8 rounded-sm bg-gold px-8 py-3.5 font-body text-sm font-semibold text-stage-black transition-colors hover:bg-gold-soft"
        >
          Fill registration form
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-stage-black">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="font-display text-2xl text-gold">HM</span>{' '}
            <span className="font-body text-sm font-semibold text-ivory">Dance Studio</span>
            <p className="mt-2 max-w-xs font-body text-sm text-muted">
              Dance · Express · Inspire — where passion meets perfection.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-stage-line text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-stage-line text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-stage-line text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-stage-line pt-6 font-body text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HM Dance Studio, Motihari. All rights reserved.</p>
          <p>Chandmari Golamber, Near Hanuman Mandir, Motihari, Bihar</p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with HM Dance Studio on WhatsApp"
      className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-105"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  )
}

export default function App() {
  const handleRegister = () => window.open(REGISTER_URL, '_blank', 'noreferrer')

  return (
    <div className="min-h-screen bg-stage-black font-body text-ivory">
      <Navbar onRegister={handleRegister} />
      <main>
        <Hero onRegister={handleRegister} />
        <Marquee />
        <Programs />
        <About onRegister={handleRegister} />
        <Location />
        <CTA onRegister={handleRegister} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
