import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import * as capsulaService from '../api/capsulaService'
import CountdownTimer from '../components/CountdownTimer'
import ParticipantsPanel from '../components/ParticipantsPanel'
import RecuerdoForm from '../components/RecuerdoForm'
import RecuerdoTimeline from '../components/RecuerdoTimeline'

export default function CapsulaDetail() {
  const { id } = useParams()
  const [capsula, setCapsula] = useState(null)
  const [participantes, setParticipantes] = useState([])
  const [recuerdos, setRecuerdos] = useState([])
  const [loading, setLoading] = useState(true)
  const [invitando, setInvitando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    const [c, p, r] = await Promise.all([
      capsulaService.getCapsula(id),
      capsulaService.getParticipantes(id),
      capsulaService.getRecuerdos(id),
    ])
    setCapsula(c)
    setParticipantes(p)
    setRecuerdos(r)
  }, [id])

  useEffect(() => {
    setLoading(true)
    cargar().finally(() => setLoading(false))
  }, [cargar])

  async function handleInvitar(email) {
    setInvitando(true)
    try {
      await capsulaService.invitarParticipante(id, email)
      const p = await capsulaService.getParticipantes(id)
      setParticipantes(p)
    } finally {
      setInvitando(false)
    }
  }

  async function handleAgregarRecuerdo(payload) {
    setGuardando(true)
    try {
      await capsulaService.agregarRecuerdo(id, payload)
      const c = await capsulaService.getCapsula(id)
      setCapsula(c)
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return <main className="max-w-3xl mx-auto px-4 py-8 text-ink/60 text-sm">Cargando…</main>
  }

  if (!capsula) {
    return <main className="max-w-3xl mx-auto px-4 py-8 text-ink/60 text-sm">No se encontró la cápsula.</main>
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{capsula.titulo}</h1>
        {capsula.descripcion && <p className="text-ink/60 mt-1">{capsula.descripcion}</p>}
      </div>

      {!capsula.abierta ? (
        <div className="bg-capsule-bg rounded-2xl p-5 sm:p-8 text-center">
          <p className="text-capsule-cream/80 text-sm mb-4">
            🔒 Sellada hasta el {new Date(capsula.fechaApertura + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <CountdownTimer fechaApertura={capsula.fechaApertura} />
          <p className="text-capsule-cream/60 text-xs mt-4">
            {capsula.totalRecuerdos} recuerdo{capsula.totalRecuerdos === 1 ? '' : 's'} guardado{capsula.totalRecuerdos === 1 ? '' : 's'} — nadie puede verlos todavía
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-green-800 text-sm font-medium">🎉 ¡Esta cápsula ya se abrió! Aquí está todo lo que guardaron.</p>
        </div>
      )}

      <ParticipantsPanel participantes={participantes} onInvite={handleInvitar} loading={invitando} />

      {!capsula.abierta && (
        <RecuerdoForm onSubmit={handleAgregarRecuerdo} loading={guardando} />
      )}

      {capsula.abierta && (
        <div>
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Línea del tiempo</h2>
          <RecuerdoTimeline recuerdos={recuerdos} />
        </div>
      )}
    </main>
  )
}
