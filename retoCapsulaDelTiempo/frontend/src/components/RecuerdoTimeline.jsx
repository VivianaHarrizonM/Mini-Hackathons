export default function RecuerdoTimeline({ recuerdos }) {
  if (recuerdos.length === 0) {
    return <p className="text-sm text-ink/60">Esta cápsula se abrió, pero nadie dejó recuerdos dentro. 😅</p>
  }

  function formatFecha(f) {
    return new Date(f).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="relative pl-6 sm:pl-8">
      <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-px bg-capsule-gold/40" />
      <div className="space-y-6">
        {recuerdos.map((r) => (
          <div key={r.id} className="relative">
            <div className="absolute -left-[19px] sm:-left-[23px] top-1 w-3 h-3 rounded-full bg-capsule-gold" />
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-capsule-bg bg-capsule-cream border border-capsule-gold/40 px-2 py-0.5 rounded-full">
                  {r.autorNombre}
                </span>
                <span className="text-xs text-ink/50">{formatFecha(r.fechaCreacion)}</span>
              </div>
              {r.titulo && <h3 className="font-display font-semibold text-ink mb-1">{r.titulo}</h3>}
              {r.tipo === 'texto' ? (
                <p className="text-sm text-ink/80 whitespace-pre-wrap">{r.contenido}</p>
              ) : (
                <img src={r.contenido} alt={r.titulo || 'Recuerdo'} className="rounded-lg max-h-80 w-full object-cover mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
