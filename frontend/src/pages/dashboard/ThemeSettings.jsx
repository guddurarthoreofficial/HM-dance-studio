import { useState } from 'react'
import './ThemeSettings.css'

const accents = [
  { id: 'gold', label: 'Marquee Gold', hex: '#f5b800' },
  { id: 'magenta', label: 'Offer Magenta', hex: '#e83f8f' },
  { id: 'violet', label: 'Stage Violet', hex: '#7b3ff2' },
]

export default function ThemeSettings() {
  const [accent, setAccent] = useState('gold')
  const [compact, setCompact] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div>
      <p className="eyebrow">Preferences</p>
      <h1 className="ts__title">Theme Settings</h1>
      <div className="stroke-divider" style={{ maxWidth: 160, margin: '8px 0 26px' }} />

      <div className="ts__grid">
        <div className="card ts__panel">
          <h3 className="ts__panel-title">Accent Color</h3>
          <p className="ts__panel-desc">Used for buttons, active tabs, and highlights across the portal.</p>
          <div className="ts__swatches">
            {accents.map((a) => (
              <button
                key={a.id}
                className={`ts__swatch ${accent === a.id ? 'is-active' : ''}`}
                style={{ '--swatch': a.hex }}
                onClick={() => setAccent(a.id)}
              >
                <span className="ts__swatch-dot" />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card ts__panel">
          <h3 className="ts__panel-title">Layout Density</h3>
          <p className="ts__panel-desc">Compact mode tightens spacing for smaller screens.</p>
          <label className="ts__toggle">
            <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
            <span className="ts__toggle-track"><span className="ts__toggle-thumb" /></span>
            Compact sidebar &amp; tables
          </label>
        </div>

        <div className="card ts__panel">
          <h3 className="ts__panel-title">Studio Details</h3>
          <div className="ts__field">
            <label htmlFor="studioName">Studio name</label>
            <input id="studioName" defaultValue="HM Dance Studio" />
          </div>
          <div className="ts__field">
            <label htmlFor="studioAddr">Address</label>
            <input id="studioAddr" defaultValue="Chandmari Glomber, Near Hanuman Mandir, Motihari" />
          </div>
          <div className="ts__field">
            <label htmlFor="studioPhone">Contact number</label>
            <input id="studioPhone" defaultValue="7488806350" />
          </div>
        </div>
      </div>

      <button className="btn btn-primary ts__save" onClick={handleSave}>
        {saved ? 'Saved ✓' : 'Save Changes'}
      </button>
    </div>
  )
}
