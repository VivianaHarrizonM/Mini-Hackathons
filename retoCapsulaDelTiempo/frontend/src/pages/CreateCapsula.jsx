import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as capsulaService from '../api/capsulaService'

export default function CreateCapsula() {
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaApertura, setFechaApertura] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const manana = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const c = await capsulaService.crearCapsula({ titulo, descripcion, fechaApertura })
      navigate(`/capsulas/${c.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la cápsula')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6 sm:py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Nueva cápsula del tiempo</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 sm:p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Título</label>
          <input type="text" placeholder="Nuestro primer año" value={titulo} onChange={(e) => setTitulo(e.target.value)}
            className="w-full mt-1 border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Descripción (opcional)</label>
          <textarea placeholder="¿Qué van a guardar aquí?" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full mt-1 border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Fecha en que se abre</label>
          <input type="date" min={manana} value={fechaApertura} onChange={(e) => setFechaApertura(e.target.value)}
            className="w-full mt-1 border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold" />
        </div>

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-capsule-bg text-capsule-cream font-semibold rounded-lg px-4 py-2.5 text-sm disabled:opacity-60">
          {loading ? 'Sellando…' : 'Sellar cápsula'}
        </button>
      </form>
    </main>
  )
}
