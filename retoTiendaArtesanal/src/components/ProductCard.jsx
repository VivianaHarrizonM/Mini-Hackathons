import { Link } from 'react-router-dom'
import ProductVisual from './ProductVisual'

export default function ProductCard({ producto }) {
  return (
    <Link
      to={`/producto/${producto.slug}`}
      className="group block bg-paper border border-ink/8 rounded-sm overflow-hidden hover:shadow-[0_12px_32px_-8px_rgba(28,26,23,0.2)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative">
        <ProductVisual producto={producto} className="aspect-[4/5]" iconClassName="w-16 h-16 sm:w-20 sm:h-20" />

        {producto.tags?.[0] && (
          <span className="absolute top-3 left-3 bg-cream/95 backdrop-blur-sm text-ink text-[10px] font-mono uppercase tracking-[0.12em] px-2.5 py-1 rounded-full shadow-sm">
            {producto.tags[0]}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-[0.1em] text-ink/40 mb-1.5">{producto.artesano}</p>
        <h3 className="font-display text-base text-ink leading-snug mb-2.5 group-hover:text-forest transition-colors">
          {producto.nombre}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-mono text-lg text-terra font-bold tracking-tight">${producto.precio}</span>
          <span className="text-xs text-ink/45 flex items-center gap-1">
            <span className="text-mustard">★</span> {producto.calificacion}
          </span>
        </div>
      </div>
    </Link>
  )
}