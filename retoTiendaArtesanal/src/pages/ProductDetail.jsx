import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as productService from '../data/api/productService'
import { useCart } from '../context/CartContext'
import ProductVisual from '../components/ProductVisual'
import { IconTruck } from '../components/icons'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { agregar } = useCart()

  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setAgregado(false)
    setCantidad(1)
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
        <Link to="/" className="text-forest font-semibold underline">Volver al catálogo</Link>
      </main>
    )
  }


  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-forest font-medium mb-6">
        ← Volver al catálogo
      </Link>

      <div className="grid sm:grid-cols-2 gap-10">
        <ProductVisual producto={producto} className="aspect-square rounded-sm" iconClassName="w-28 h-28 sm:w-36 sm:h-36" />

        <div>
          {producto.tags?.[0] && (
            <span className="inline-block bg-cream text-ink text-[10px] font-mono uppercase tracking-[0.12em] border border-ink/10 px-2.5 py-1 rounded-full mb-3">
              {producto.tags[0]}
            </span>
          )}

          <h1 className="font-display text-2xl sm:text-4xl text-ink leading-tight mb-1">{producto.nombre}</h1>
          <p className="text-sm text-ink/50 mb-4">
            Hecho por <span className="font-medium text-ink/80">{producto.artesano}</span>
          </p>

          <p className="font-mono text-3xl text-terra font-bold mb-5">${producto.precio}</p>

          <p className="text-ink/70 leading-relaxed mb-6">{producto.descripcionLarga}</p>

          <div className="mb-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40 mb-2">Materiales</h3>
            <div className="flex flex-wrap gap-2">
              {producto.materiales.map((m) => (
                <span key={m} className="text-xs bg-stone-light border border-stone px-2.5 py-1 rounded-full text-ink/70">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <p className="flex items-center gap-2 text-sm text-ink/60 mb-6">
            <IconTruck className="w-4 h-4 shrink-0" />
            Envío estimado en {producto.envioDias} días · {producto.stock} disponibles
          </p>

          <div className="flex items-center gap-3 mb-5">
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
              className="bg-terra text-cream font-semibold rounded-lg px-6 py-3 text-sm hover:bg-terra-dark transition-colors"
            >
              Agregar al carrito
            </button>
            {agregado && (
              <button
                onClick={() => navigate('/carrito')}
                className="border border-forest text-forest font-semibold rounded-lg px-6 py-3 text-sm hover:bg-forest hover:text-cream transition-colors"
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