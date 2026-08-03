import { useState } from 'react'

const ATAJOS = [250, 500, 1000]

export default function ContributionForm({ onSubmit, loading }) {
  const [cantidad, setCantidad] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const valor = Number(cantidad)
    if (!valor || valor <= 0) return
    onSubmit(valor)
    setCantidad('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-jade/10 p-5">
      <h3 className="font-display text-lg font-semibold text-ink mb-3">Agregar aportación</h3>
      <div className="flex gap-2 mb-3 flex-wrap">
        {ATAJOS.map((monto) => (
          <button
            type="button"
            key={monto}
            onClick={() => setCantidad(String(monto))}
            className="px-3 py-1.5 rounded-full text-sm font-mono-nums border border-jade/20 text-jade-dark hover:bg-jade/5"
          >
            +{monto}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          min="1"
          step="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cantidad"
          className="flex-1 rounded-lg border border-ink/15 px-3 py-2 font-mono-nums focus:outline-none focus:ring-2 focus:ring-jade/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-jade text-white font-medium hover:bg-jade-dark transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Guardando...' : 'Aportar'}
        </button>
      </div>
    </form>
  )
}
