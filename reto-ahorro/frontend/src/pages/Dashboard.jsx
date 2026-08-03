import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { goalsService } from '../api/goalsService.js'
import GoalCard from '../components/GoalCard.jsx'

export default function Dashboard() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    goalsService
      .getAll()
      .then(({ data }) => setGoals(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Mis metas</h1>
        <Link
          to="/goals/new"
          className="inline-block text-center px-4 py-2 rounded-lg bg-jade text-white text-sm font-medium hover:bg-jade-dark transition-colors"
        >
          + Crear meta
        </Link>
      </div>

      {loading && <p className="text-ink/50">Cargando metas...</p>}

      {!loading && goals.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-jade/10">
          <p className="text-ink/60 mb-4">Todavía no tienes ninguna meta de ahorro.</p>
          <Link to="/goals/new" className="text-jade-dark font-medium hover:underline">
            Crea la primera
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </main>
  )
}
