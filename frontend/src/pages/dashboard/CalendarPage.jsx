import { useState, Fragment } from 'react'
import './CalendarPage.css'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const times = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

const seedClasses = {
  'Mon-5:00 PM': { name: 'Hip Hop A', tone: 'gold' },
  'Mon-7:00 PM': { name: 'Guitar', tone: 'violet' },
  'Tue-6:00 PM': { name: 'Bollywood', tone: 'magenta' },
  'Wed-5:00 PM': { name: 'Hip Hop A', tone: 'gold' },
  'Wed-8:00 PM': { name: 'Stunt Class', tone: 'violet' },
  'Thu-6:00 PM': { name: 'Contemporary', tone: 'magenta' },
  'Fri-5:00 PM': { name: 'Free Style', tone: 'gold' },
  'Fri-7:00 PM': { name: 'Singing', tone: 'violet' },
  'Sat-4:00 PM': { name: 'Wedding Choreo', tone: 'magenta' },
  'Sat-6:00 PM': { name: 'Hip Hop A', tone: 'gold' },
}

export default function CalendarPage() {
  const [classes] = useState(seedClasses)

  return (
    <div>
      <p className="eyebrow">Schedule</p>
      <h1 className="cal__title">Class Calendar</h1>
      <div className="stroke-divider" style={{ maxWidth: 160, margin: '8px 0 26px' }} />

      <div className="card cal__wrap">
        <div className="cal__grid">
          <div className="cal__corner" />
          {days.map((d) => <div className="cal__head" key={d}>{d}</div>)}

          {times.map((t) => (
            <Fragment key={t}>
              <div className="cal__time">{t}</div>
              {days.map((d) => {
                const cls = classes[`${d}-${t}`]
                return (
                  <div className="cal__cell" key={`${d}-${t}`}>
                    {cls && <div className={`cal__pill tone-${cls.tone}-bg`}>{cls.name}</div>}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
