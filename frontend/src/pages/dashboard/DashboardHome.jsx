import './DashboardHome.css'

const stats = [
  { label: 'Active Students', value: '186', delta: '+12 this month', tone: 'gold' },
  { label: 'Classes This Week', value: '24', delta: '5 styles running', tone: 'violet' },
  { label: 'Revenue (MTD)', value: '₹3.4L', delta: '+18% vs last month', tone: 'gold' },
  { label: 'Trial Requests', value: '9', delta: 'Awaiting follow-up', tone: 'magenta' },
]

const upcoming = [
  { time: '5:00 PM', name: 'Hip Hop — Batch A', teacher: 'Coach Rahul' },
  { time: '6:00 PM', name: 'Bollywood — Beginners', teacher: 'Coach Priya' },
  { time: '7:15 PM', name: 'Guitar Class', teacher: 'Coach Aman' },
  { time: '8:00 PM', name: 'Stunt Class', teacher: 'Coach Rahul' },
]

const activity = [
  'New trial booked — Contemporary, by Aditi S.',
  'Payment received — ₹1,999, Hip Hop monthly package.',
  'Wedding choreography enquiry received.',
  'Certificate issued — Bollywood, 3-month batch.',
]

export default function DashboardHome() {
  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="dash-home__title">Namaste, HM Studio 👋</h1>
      <div className="stroke-divider" style={{ maxWidth: 160, margin: '8px 0 30px' }} />

      <div className="dash-home__stats">
        {stats.map((s) => (
          <div className="card dash-home__stat" key={s.label}>
            <p className="eyebrow">{s.label}</p>
            <p className={`dash-home__stat-value tone-${s.tone}`}>{s.value}</p>
            <p className="dash-home__stat-delta">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="dash-home__grid">
        <div className="card dash-home__panel">
          <h3 className="dash-home__panel-title">Today's Schedule</h3>
          <ul className="dash-home__list">
            {upcoming.map((u) => (
              <li key={u.name} className="dash-home__schedule-row">
                <span className="dash-home__time">{u.time}</span>
                <span className="dash-home__class-name">{u.name}</span>
                <span className="dash-home__teacher">{u.teacher}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card dash-home__panel">
          <h3 className="dash-home__panel-title">Recent Activity</h3>
          <ul className="dash-home__list">
            {activity.map((a, i) => (
              <li key={i} className="dash-home__activity-row">
                <span className="dash-home__dot" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
