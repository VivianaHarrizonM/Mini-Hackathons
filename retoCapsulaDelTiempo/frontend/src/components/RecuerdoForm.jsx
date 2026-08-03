import { useState } from 'react'

export default function RecuerdoForm({ onSubmit, loading }) {
  const [tipo, setTipo] = useState('texto')
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 4MB')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      setContenido(reader.result)
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!contenido.trim()) {
      setError(tipo === 'texto' ? 'Escribe algo primero' : 'Selecciona una foto')
      return
    }
    try {
      await onSubmit({ tipo, contenido, titulo: titulo.trim() || null })
      setTitulo('')
      setContenido('')
      setPreview(null)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar el recuerdo')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold text-ink mb-3">Agregar un recuerdo</h2>

      <div className="flex gap-2 mb-3">
        {['texto', 'foto'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTipo(t); setContenido(''); setPreview(null); setError('') }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              tipo === t ? 'bg-capsule-bg text-capsule-cream border-capsule-bg' : 'border-black/10 text-ink/70'
            }`}
          >
            {t === 'texto' ? '📝 Nota' : '📷 Foto'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Título (opcional)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold"
        />

        {tipo === 'texto' ? (
          <textarea
            placeholder="Escribe tu recuerdo, mensaje o deseo para el futuro…"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={4}
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold"
          />
        ) : (
          <div>
            <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
            {preview && (
              <img src={preview} alt="Vista previa" className="mt-3 max-h-48 rounded-lg border border-black/10 object-cover" />
            )}
          </div>
        )}

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-capsule-gold text-capsule-bg font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-60"
        >
          {loading ? 'Guardando…' : 'Sellar recuerdo en la cápsula'}
        </button>
      </form>
    </div>
  )
}
