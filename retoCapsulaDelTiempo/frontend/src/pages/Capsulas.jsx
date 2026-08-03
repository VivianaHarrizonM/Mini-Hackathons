import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as capsulaService from '../api/capsulaService'

export default function Capsulas() {
  const [capsulas, setCapsulas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    capsulaService.misCapsulas()
      .then(setCapsulas)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Mis cápsulas</h1>
        <Link to="/nueva" className="bg-capsule-bg text-capsule-cream text-sm font-semibold px-4 py-2 rounded-full">
          + Nueva
        </Link>
      </div>

      {loading && <p className="text-ink/60 text-sm">Cargando…</p>}

      {!loading && capsulas.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-black/5">
          <p className="text-4xl mb-3">⏳</p>
          <p className="text-ink/70 mb-4">Todavía no tienes ninguna cápsula del tiempo.</p>
          <Link to="/nueva" className="bg-capsule-gold text-capsule-bg font-semibold px-4 py-2 rounded-full text-sm">
            Crear la primera
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {capsulas.map((c) => (
          <Link key={c.id} to={`/capsulas/${c.id}`}
            className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-display text-lg font-semibold text-ink">{c.titulo}</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                c.abierta ? 'bg-green-100 text-green-700' : 'bg-capsule-cream text-capsule-bg border border-capsule-gold/40'
              }`}>
                {c.abierta ? 'Abierta' : 'Sellada'}
              </span>
            </div>
            {c.descripcion && <p className="text-sm text-ink/60 mb-3 line-clamp-2">{c.descripcion}</p>}
            <p className="text-xs text-ink/50">
              {c.abierta
                ? `${c.totalRecuerdos} recuerdo${c.totalRecuerdos === 1 ? '' : 's'} dentro`
                : `Se abre en ${c.diasRestantes} día${c.diasRestantes === 1 ? '' : 's'}`}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
