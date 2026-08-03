import { useState } from 'react'

export default function ParticipantsPanel({ participantes, onInvite, loading }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return
    try {
      await onInvite(email.trim())
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo invitar')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold text-ink mb-3">Participantes</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {participantes.map((p) => (
          <div key={p.usuarioId} className="flex items-center gap-2 bg-capsule-cream border border-capsule-gold/40 rounded-full pl-1 pr-3 py-1">
            <span className="w-7 h-7 rounded-full bg-capsule-bg text-capsule-cream flex items-center justify-center text-xs font-semibold">
              {p.nombre.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm text-ink">{p.nombre}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Correo de la persona a invitar"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-capsule-bg text-capsule-cream text-sm font-semibold rounded-lg px-4 py-2 disabled:opacity-60"
        >
          {loading ? 'Invitando…' : 'Invitar'}
        </button>
      </form>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      <p className="text-xs text-ink/50 mt-2">La persona debe tener ya una cuenta creada.</p>
    </div>
  )
}
