function formatoFecha(fechaISO) {
  const fecha = new Date(fechaISO)
  const hoy = new Date()
  const ayer = new Date()
  ayer.setDate(hoy.getDate() - 1)

  const esMismoDia = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  if (esMismoDia(fecha, hoy)) return 'Hoy'
  if (esMismoDia(fecha, ayer)) return 'Ayer'
  return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
}

export default function ContributionHistory({ contribuciones }) {
  if (!contribuciones?.length) {
    return (
      <div className="bg-white rounded-2xl border border-jade/10 p-5 text-center text-ink/50 text-sm">
        Todavía no hay aportaciones. ¡Sé el primero en aportar!
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-jade/10 divide-y divide-jade/10">
      {contribuciones.map((c) => (
        <div key={c.id} className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="font-medium text-ink">{c.usuarioNombre}</p>
            <p className="text-xs text-ink/50">{formatoFecha(c.fecha)}</p>
          </div>
          <span className="font-mono-nums text-jade-dark font-semibold">
            +${c.cantidad.toLocaleString('es-MX')}
          </span>
        </div>
      ))}
    </div>
  )
}
