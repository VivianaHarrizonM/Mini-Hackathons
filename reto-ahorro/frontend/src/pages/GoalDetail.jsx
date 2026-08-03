import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { goalsService } from '../api/goalsService.js'
import ProgressBar from '../components/ProgressBar.jsx'
import ContributionForm from '../components/ContributionForm.jsx'
import ContributionHistory from '../components/ContributionHistory.jsx'
import ParticipantsPanel from '../components/ParticipantsPanel.jsx'
import StatsCharts from '../components/StatsCharts.jsx'

function diasRestantes(fechaLimite) {
  if (!fechaLimite) return null
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diff = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function GoalDetail() {
  const { id } = useParams()
  const [goal, setGoal] = useState(null)
  const [contribuciones, setContribuciones] = useState([])
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [invitando, setInvitando] = useState(false)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    const [goalRes, contribRes, participantesRes] = await Promise.all([
      goalsService.getById(id),
      goalsService.getContributions(id),
      goalsService.getParticipants(id),
    ])
    setGoal(goalRes.data)
    setContribuciones(contribRes.data)
    setParticipantes(participantesRes.data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const handleAportar = async (cantidad) => {
    setSaving(true)
    try {
      await goalsService.addContribution(id, { cantidad })
      await cargarDatos()
    } finally {
      setSaving(false)
    }
  }

  const handleInvitar = async (correo) => {
    setInvitando(true)
    try {
      await goalsService.addParticipant(id, { correo })
      await cargarDatos()
    } finally {
      setInvitando(false)
    }
  }

  if (loading || !goal) {
    return <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-ink/50">Cargando meta...</main>
  }

  const restante = Math.max(goal.objetivo - goal.montoActual, 0)
  const dias = diasRestantes(goal.fechaLimite)

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{goal.nombre}</h1>
        {goal.fechaLimite && <p className="text-ink/60 mt-1 text-sm sm:text-base">Fecha límite: {goal.fechaLimite}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-jade/10 p-4 sm:p-6">
        <ProgressBar actual={goal.montoActual} objetivo={goal.objetivo} />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white rounded-2xl border border-jade/10 p-3 sm:p-5 text-center">
          <p className="text-[11px] sm:text-sm text-ink/60">Total ahorrado</p>
          <p className="font-mono-nums text-base sm:text-2xl font-semibold text-jade-dark">
            ${goal.montoActual.toLocaleString('es-MX')}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-jade/10 p-3 sm:p-5 text-center">
          <p className="text-[11px] sm:text-sm text-ink/60">Faltan</p>
          <p className="font-mono-nums text-base sm:text-2xl font-semibold text-ink">
            ${restante.toLocaleString('es-MX')}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-jade/10 p-3 sm:p-5 text-center">
          <p className="text-[11px] sm:text-sm text-ink/60">Días restantes</p>
          <p className="font-mono-nums text-base sm:text-2xl font-semibold text-ink">{dias ?? '—'}</p>
        </div>
      </div>

      <StatsCharts contribuciones={contribuciones} objetivo={goal.objetivo} />

      <ParticipantsPanel participantes={participantes} onInvite={handleInvitar} loading={invitando} />

      <ContributionForm onSubmit={handleAportar} loading={saving} />

      <div>
        <h2 className="font-display text-lg font-semibold text-ink mb-3">Historial</h2>
        <ContributionHistory contribuciones={contribuciones} />
      </div>
    </main>
  )
}