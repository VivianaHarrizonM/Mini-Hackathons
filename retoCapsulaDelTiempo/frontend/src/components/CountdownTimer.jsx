import { useEffect, useState } from 'react'

function calcular(fechaApertura) {
  const target = new Date(fechaApertura + 'T00:00:00')
  const now = new Date()
  const diffMs = target - now
  if (diffMs <= 0) return null

  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const horas = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const minutos = Math.floor((diffMs / (1000 * 60)) % 60)
  const segundos = Math.floor((diffMs / 1000) % 60)
  return { dias, horas, minutos, segundos }
}

export default function CountdownTimer({ fechaApertura }) {
  const [restante, setRestante] = useState(() => calcular(fechaApertura))

  useEffect(() => {
    const interval = setInterval(() => setRestante(calcular(fechaApertura)), 1000)
    return () => clearInterval(interval)
  }, [fechaApertura])

  if (!restante) return null

  const unidades = [
    { label: 'días', valor: restante.dias },
    { label: 'hrs', valor: restante.horas },
    { label: 'min', valor: restante.minutos },
    { label: 'seg', valor: restante.segundos },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
      {unidades.map((u) => (
        <div key={u.label} className="bg-capsule-bg text-capsule-cream rounded-xl py-3 text-center shadow-lg">
          <div className="font-display text-2xl sm:text-3xl font-semibold tabular-nums">{String(u.valor).padStart(2, '0')}</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider opacity-70 mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  )
}
