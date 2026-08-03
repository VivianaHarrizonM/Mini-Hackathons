import { useState } from 'react'

function inicial(nombre) {
  return nombre?.charAt(0).toUpperCase() || '?'
}

export default function ParticipantsPanel({ participantes, onInvite, loading }) {
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!correo.trim()) return
    try {
      await onInvite(correo.trim())
      setCorreo('')
    } catch (err) {
      setError(
        err.response?.data?.mensaje || 'No se pudo agregar. Verifica que ya tenga cuenta.'
      )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-jade/10 p-4 sm:p-5">
      <h3 className="font-display text-lg font-semibold text-ink mb-3">Participantes</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {participantes.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-jade/10 text-sm text-jade-dark"
            title={p.correo}
          >
            <span className="w-6 h-6 rounded-full bg-jade text-white text-xs flex items-center justify-center font-medium">
              {inicial(p.nombre)}
            </span>
            {p.nombre}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo de la persona a invitar"
          className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jade/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-jade text-jade-dark text-sm font-medium hover:bg-jade/5 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Agregando...' : 'Invitar'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <p className="text-xs text-ink/45 mt-2">
        La persona debe tener cuenta creada en Reto de Ahorro para poder agregarla.
      </p>
    </div>
  )
}