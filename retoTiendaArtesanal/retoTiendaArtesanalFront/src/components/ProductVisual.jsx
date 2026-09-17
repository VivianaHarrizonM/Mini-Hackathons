
import { useState } from 'react'
import { visualPorCategoria } from '../data/categoryVisuals'


export default function ProductVisual({ producto, className = '', iconClassName = 'w-16 h-16' }) {
  const [error, setError] = useState(false)
  const visual = visualPorCategoria[producto.categoria]
  const Icon = visual.Icon
  const mostrarFoto = producto.foto && !error

  return (
    <div className={`relative overflow-hidden ${visual.bg} flex items-center justify-center ${className}`}>
      {mostrarFoto ? (
        <img
          src={producto.foto}
          alt={producto.nombre}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full bg-black/5" />
          <div className="absolute -top-10 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <Icon className={`relative transition-transform duration-500 group-hover:scale-110 ${visual.fg} ${iconClassName}`} />
        </>
      )}
    </div>
  )
}