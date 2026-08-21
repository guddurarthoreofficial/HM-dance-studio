import './StaticPage.css'

const values = [
  { title: 'Discipline first', desc: 'Every style we teach is built on fundamentals, not shortcuts.' },
  { title: 'Every level welcome', desc: 'From your first class to your first show, we train where you are.' },
  { title: 'Real stage time', desc: 'Students perform — recitals, events, and wedding choreography aren\u2019t optional extras.' },
]

export default function About() {
  return (
    <div className="static-page container page-fade">
      <p className="eyebrow">About the studio</p>
      <h1 className="static-page__title">Built in Motihari, for dancers who mean it.</h1>
      <div className="stroke-divider" style={{ maxWidth: 220 }} />

      <p className="static-page__lead">
        HM Dance Studio started with one idea: Motihari deserved a proper training ground —
        not just a hobby class, but a place to actually get good. Today we train hip hop,
        Bollywood, contemporary, and free style dancers alongside singers and guitarists,
        all under one roof at Chandmari Glomber, near Hanuman Mandir.
      </p>

      <div className="static-page__grid">
        {values.map((v) => (
          <div className="card static-page__value" key={v.title}>
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="static-page__band card">
        <h2>Learn. Practice. Perform fearlessly.</h2>
        <p>
          Our stunt class teaches floor tricks and stage acrobatics with proper spotting and
          progressions — the same philosophy runs through every class we teach.
        </p>
      </div>
    </div>
  )
}
