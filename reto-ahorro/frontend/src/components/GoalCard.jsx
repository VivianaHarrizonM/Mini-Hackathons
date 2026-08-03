import { Link } from 'react-router-dom'

export default function GoalCard({ goal }) {
  const porcentaje = goal.objetivo > 0
    ? Math.min((goal.montoActual / goal.objetivo) * 100, 100)
    : 0

  return (
    <Link
      to={`/goals/${goal.id}`}
      className="block bg-white rounded-2xl border border-jade/10 p-4 sm:p-5 hover:border-jade/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-lg font-semibold text-ink">{goal.nombre}</h3>
        <span className="font-mono-nums text-xs px-2 py-1 rounded-full bg-gold/15 text-gold-light text-ink/70">
          {porcentaje.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-jade/10 overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-jade to-gold"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <div className="flex justify-between text-sm font-mono-nums text-ink/70">
        <span>${goal.montoActual?.toLocaleString('es-MX')}</span>
        <span className="text-ink/40">de ${goal.objetivo?.toLocaleString('es-MX')}</span>
      </div>
      {goal.fechaLimite && (
        <p className="text-xs text-ink/50 mt-2">Meta: {goal.fechaLimite}</p>
      )}
    </Link>
  )
}
