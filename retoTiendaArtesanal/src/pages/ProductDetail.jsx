import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as productService from '../data/api/productService'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { agregar } = useCart()

  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setAgregado(false)
    setCantidad(1)
    setImagenActiva(0)
    productService
      .getProductoPorSlugAsync(slug)
      .then(setProducto)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  function handleAgregar() {
    agregar(producto, cantidad)
    setAgregado(true)
  }

  if (loading) {
    return <main className="max-w-5xl mx-auto px-4 py-10 text-ink/50 text-sm">Cargando…</main>
  }

  if (error || !producto) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-ink/70 mb-4">No encontramos ese producto.</p>
        <Link to="/" className="text-indigo font-semibold underline">Volver al catálogo</Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink font-medium mb-6">
        ← Volver al catálogo
      </Link>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <div
            className="w-full aspect-square rounded-sm"
            style={{ backgroundColor: producto.imagenes[imagenActiva] }}
          />
          {producto.imagenes.length > 1 && (
            <div className="flex gap-2 mt-3">
              {producto.imagenes.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setImagenActiva(i)}
                  className={`w-14 h-14 rounded-sm border-2 ${
                    imagenActiva === i ? 'border-indigo' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Ver imagen ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {producto.tags?.[0] && (
            <span className="inline-block bg-musgo text-lino text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full mb-3">
              {producto.tags[0]}
            </span>
          )}

          <h1 className="font-display text-2xl sm:text-3xl text-ink mb-1">{producto.nombre}</h1>
          <p className="text-sm text-ink/60 mb-4">
            Hecho por <span className="font-medium text-ink/80">{producto.artesano}</span>
          </p>

          <p className="font-mono text-3xl text-barro font-bold mb-4">${producto.precio}</p>

          <p className="text-ink/80 leading-relaxed mb-5">{producto.descripcionLarga}</p>

          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Materiales</h3>
            <div className="flex flex-wrap gap-2">
              {producto.materiales.map((m) => (
                <span key={m} className="text-xs bg-kraft-light border border-kraft px-2 py-1 rounded-full text-ink/70">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-ink/60 mb-6">
            📦 Envío estimado en {producto.envioDias} días · {producto.stock} disponibles
          </p>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-ink/70">Cantidad</label>
            <div className="flex items-center border border-ink/15 rounded-lg overflow-hidden">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="px-3 py-1.5 hover:bg-ink/5 text-ink/70"
              >
                −
              </button>
              <span className="px-4 font-mono text-sm">{cantidad}</span>
              <button
                onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                className="px-3 py-1.5 hover:bg-ink/5 text-ink/70"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAgregar}
              className="bg-barro text-lino font-semibold rounded-lg px-6 py-3 text-sm hover:opacity-90"
            >
              Agregar al carrito
            </button>
            {agregado && (
              <button
                onClick={() => navigate('/carrito')}
                className="border border-indigo text-indigo font-semibold rounded-lg px-6 py-3 text-sm hover:bg-indigo hover:text-lino transition-colors"
              >
                Ver carrito →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}