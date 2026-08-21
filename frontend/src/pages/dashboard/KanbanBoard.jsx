import { useState } from 'react'
import './KanbanBoard.css'

const initialColumns = [
  {
    id: 'trial',
    title: 'Trial Booked',
    cards: [
      { id: 'c1', name: 'Aditi Sharma', note: 'Contemporary · walked in Sat' },
      { id: 'c2', name: 'Rohit Kumar', note: 'Hip Hop · referred by Coach Rahul' },
    ],
  },
  {
    id: 'enrolled',
    title: 'Enrolled',
    cards: [
      { id: 'c3', name: 'Simran Kaur', note: 'Bollywood monthly package' },
      { id: 'c4', name: 'Aman Verma', note: 'Guitar + Singing combo' },
    ],
  },
  {
    id: 'active',
    title: 'Active Batch',
    cards: [
      { id: 'c5', name: 'Priya Singh', note: 'Free Style · Batch B' },
      { id: 'c6', name: 'Karan Mehta', note: 'Stunt Class · 2nd month' },
      { id: 'c7', name: 'Neha Gupta', note: 'Hip Hop · Batch A' },
    ],
  },
  {
    id: 'completed',
    title: 'Completed',
    cards: [
      { id: 'c8', name: 'Vikash Jha', note: 'Wedding choreography — done' },
    ],
  },
]

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns)
  const [dragCard, setDragCard] = useState(null)

  function handleDrop(colId) {
    if (!dragCard) return
    setColumns((prev) => {
      const next = prev.map((c) => ({ ...c, cards: c.cards.filter((cd) => cd.id !== dragCard.cardId) }))
      const target = next.find((c) => c.id === colId)
      const source = prev.find((c) => c.id === dragCard.fromCol)
      const card = source.cards.find((cd) => cd.id === dragCard.cardId)
      if (card) target.cards.push(card)
      return next
    })
    setDragCard(null)
  }

  return (
    <div>
      <p className="eyebrow">Enrollment pipeline</p>
      <h1 className="kanban__title">Enrollment Board</h1>
      <div className="stroke-divider" style={{ maxWidth: 160, margin: '8px 0 26px' }} />
      <p className="kanban__hint">Drag a student card between stages as they move through admission.</p>

      <div className="kanban__board">
        {columns.map((col) => (
          <div
            className="kanban__col"
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
          >
            <div className="kanban__col-head">
              <span>{col.title}</span>
              <span className="kanban__count">{col.cards.length}</span>
            </div>
            <div className="kanban__cards">
              {col.cards.map((card) => (
                <div
                  className="card kanban__card"
                  key={card.id}
                  draggable
                  onDragStart={() => setDragCard({ cardId: card.id, fromCol: col.id })}
                >
                  <p className="kanban__card-name">{card.name}</p>
                  <p className="kanban__card-note">{card.note}</p>
                </div>
              ))}
              {col.cards.length === 0 && <div className="kanban__empty">Drop a card here</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
