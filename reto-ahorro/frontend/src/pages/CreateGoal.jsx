import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { goalsService } from '../api/goalsService.js'

export default function CreateGoal() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', objetivo: '', fechaLimite: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const hoy = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await goalsService.create({
        ...form,
        objetivo: Number(form.objetivo),
      })
      navigate(`/goals/${data.id}`)
    } catch (err) {
      const data = err.response?.data
      const mensaje = data?.mensaje || Object.values(data || {})[0]
      setError(mensaje || 'No se pudo crear la meta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Crear meta compartida</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-jade/10 p-6 space-y-4">
        <div>
          <label className="text-sm text-ink/70">Nombre de la meta</label>
          <input
            required
            placeholder="Viaje a Cancún"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full mt-1 rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jade/40"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Objetivo ($)</label>
          <input
            type="number"
            min="1"
            required
            placeholder="20000"
            value={form.objetivo}
            onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
            className="w-full mt-1 rounded-lg border border-ink/15 px-3 py-2 font-mono-nums focus:outline-none focus:ring-2 focus:ring-jade/40"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Fecha límite</label>
          <input
            type="date"
            required
            min={hoy}
            value={form.fechaLimite}
            onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
            className="w-full mt-1 rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jade/40"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-jade text-white font-medium hover:bg-jade-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear meta'}
        </button>
      </form>
    </main>
  )
}
