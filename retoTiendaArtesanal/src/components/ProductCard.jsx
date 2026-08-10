import { Link } from 'react-router-dom'

export default function ProductCard({ producto }) {
  return (
    <Link
      to={`/producto/${producto.slug}`}
      className="group block bg-kraft-light border border-kraft rounded-sm p-3 relative hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      {/* "hoyito" de la etiqueta */}
      <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-lino border border-ink/20" />

      <div
        className="w-full aspect-square rounded-sm mb-3 mt-2"
        style={{ backgroundColor: producto.imagenes[0] }}
      />

      {producto.tags?.[0] && (
        <span className="inline-block bg-musgo text-lino text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full mb-2">
          {producto.tags[0]}
        </span>
      )}

      <h3 className="font-display text-base text-ink leading-snug mb-1 group-hover:text-indigo">
        {producto.nombre}
      </h3>
      <p className="text-xs text-ink/60 mb-3">{producto.artesano}</p>

      <div className="flex items-center justify-between border-t border-ink/10 pt-2">
        <span className="font-mono text-lg text-barro font-bold">${producto.precio}</span>
        <span className="text-xs text-ink/50">★ {producto.calificacion}</span>
      </div>
    </Link>
  )
}