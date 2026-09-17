import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import IconBasket from '../components/IconBasket'
import { visualPorCategoria } from '../data/categoryVisuals'

export default function Cart() {
  const { items, actualizarCantidad, quitar, totalPrecio } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-14 text-center">
        <IconBasket className="w-14 h-14 mx-auto mb-4 text-ink/25" />
        <h1 className="font-display text-2xl text-ink mb-2">Tu carrito está vacío</h1>
        <p className="text-ink/60 mb-6">Todavía no has agregado ninguna pieza.</p>
        <Link to="/" className="bg-terra text-cream font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-terra-dark transition-colors">
          Ver el catálogo
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">Tu carrito</h1>

      <div className="bg-paper border border-stone rounded-sm divide-y divide-stone">
        {items.map((item) => {
          const visual = visualPorCategoria[item.categoria]
          const Icon = visual.Icon
          return (
            <div key={item.id} className="p-4 flex gap-4 items-center">
              <div className={`w-16 h-16 rounded-sm shrink-0 ${visual.bg} flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${visual.fg}`} />
              </div>

              <div className="flex-1 min-w-0">
                <Link to={`/producto/${item.slug}`} className="font-display text-base text-ink hover:text-forest block truncate">
                  {item.nombre}
                </Link>
                <p className="text-xs text-ink/50">{item.artesano}</p>
                <p className="font-mono text-sm text-terra font-bold mt-1">${item.precio}</p>
              </div>

              <div className="flex items-center border border-ink/15 rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="px-2.5 py-1 hover:bg-ink/5 text-ink/70"
                >
                  −
                </button>
                <span className="px-3 font-mono text-sm">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stock}
                  className="px-2.5 py-1 hover:bg-ink/5 text-ink/70 disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => quitar(item.id)}
                className="text-terra text-xs font-semibold hover:bg-terra/10 rounded-lg px-2 py-1 shrink-0"
              >
                Quitar
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-stone-light border border-stone rounded-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-lg text-ink">Total</span>
          <span className="font-mono text-2xl text-terra font-bold">${totalPrecio}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-forest text-cream font-semibold rounded-lg px-5 py-3 text-sm hover:bg-forest-dark transition-colors"
        >
          Continuar a pago
        </button>
      </div>
    </main>
  )
}