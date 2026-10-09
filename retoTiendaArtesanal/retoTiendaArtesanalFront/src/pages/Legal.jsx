import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { DOCUMENTOS_LEGALES, getDocumentoLegal } from '../data/api/legalService'

// El primer bloque es título + versión (ya los mostramos aparte).
// Cada bloque siguiente empieza con un encabezado numerado: "1. PLAZO".
function parsearContenido(texto) {
  return texto
    .split('\n\n')
    .slice(1)
    .map((bloque) => {
      const [primera, ...resto] = bloque.split('\n')
      if (/^\d+\.\s/.test(primera)) {
        return { encabezado: primera, cuerpo: resto.join('\n') }
      }
      return { encabezado: null, cuerpo: bloque }
    })
}

export default function Legal() {
  const { tipo } = useParams()
  const meta = DOCUMENTOS_LEGALES[tipo]

  const [documento, setDocumento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!DOCUMENTOS_LEGALES[tipo]) return
    let cancelado = false
    setLoading(true)
    setError('')
    getDocumentoLegal(tipo)
      .then((d) => { if (!cancelado) setDocumento(d) })
      .catch((e) => { if (!cancelado) setError(e.message || 'No se pudo cargar el documento') })
      .finally(() => { if (!cancelado) setLoading(false) })
    return () => { cancelado = true }
  }, [tipo])

  if (!meta) {
    return <Navigate to="/" replace />
  }

  const secciones = documento ? parsearContenido(documento.contenido) : []

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-1">{meta.titulo}</h1>
      {documento && (
        <p className="text-xs text-ink/50 mb-6">Versión vigente: {documento.version}</p>
      )}

      {loading && <p className="text-ink/50 text-sm">Cargando…</p>}
      {error && <p className="text-terra text-sm">{error}</p>}

      {documento && (
        <div className="bg-paper border border-stone rounded-sm p-5 sm:p-6 space-y-5">
          {secciones.map((s, i) => (
            <section key={i}>
              {s.encabezado && (
                <h2 className="font-display text-base text-ink mb-1">{s.encabezado}</h2>
              )}
              <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line">{s.cuerpo}</p>
            </section>
          ))}
        </div>
      )}

      <nav className="flex flex-wrap gap-4 mt-6 text-sm">
        {Object.entries(DOCUMENTOS_LEGALES)
          .filter(([clave]) => clave !== tipo)
          .map(([clave, d]) => (
            <Link key={clave} to={`/legal/${clave}`} className="text-forest font-semibold underline">
              {d.titulo}
            </Link>
          ))}
      </nav>
    </main>
  )
}