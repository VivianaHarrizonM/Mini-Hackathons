import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import * as orderService from '../data/api/orderService'
import * as cartService from '../data/api/cartService'
import { dinero } from '../utils/estadoPedido'

const inputClase =
  'w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-terra'

export default function Checkout() {
  const { user, logout } = useAuth()
  const { items, totalPrecio } = useCart()

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [estado, setEstado] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [telefono, setTelefono] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-10 text-center">
        <p className="text-ink/70 mb-4">Necesitas iniciar sesión para continuar con tu compra.</p>
        <Link
          to="/login"
          state={{ redirectTo: '/checkout' }}
          className="bg-forest text-cream font-semibold rounded-lg px-5 py-2.5 text-sm inline-block hover:bg-forest-dark transition-colors"
        >
          Iniciar sesión
        </Link>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="max-w-md mx-auto px-4 py-10 text-center">
        <p className="text-ink/70 mb-4">Tu carrito está vacío.</p>
        <Link to="/" className="bg-terra text-cream font-semibold rounded-lg px-5 py-2.5 text-sm inline-block hover:bg-terra-dark transition-colors">
          Ver el catálogo
        </Link>
      </main>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setProcesando(true)
    try {
      await cartService.sincronizarCarrito(items)
      const pedido = await orderService.crearPedido({
        nombreDestinatario: nombre,
        telefono,
        direccion,
        ciudad,
        estadoDireccion: estado,
        codigoPostal,
        aceptaTerminos,
      })
      const url = await orderService.iniciarCheckout(pedido.id)
      window.location.assign(url) // salimos a la página de pago de Stripe
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout()
        setError('Tu sesión expiró. Inicia sesión de nuevo para continuar.')
      } else {
        setError(err.message || 'No se pudo procesar el pedido')
      }
      setProcesando(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">
        Finalizar <span className="text-terra">compra</span>
      </h1>

      <div className="grid sm:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="sm:col-span-3 space-y-5">
          <div className="bg-paper border border-stone rounded-sm p-5 space-y-3">
            <h2 className="font-display text-lg text-ink mb-1">Dirección de envío</h2>

            <input required type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} />
            <input required type="text" placeholder="Calle y número" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={inputClase} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className={inputClase} />
              <input required type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} className={inputClase} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required type="text" placeholder="Código postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className={inputClase} />
              <input required type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputClase} />
            </div>
          </div>

          <div className="bg-paper border border-stone rounded-sm p-5 space-y-3">
            <h2 className="font-display text-lg text-ink mb-1">Pago</h2>
            <p className="text-sm text-ink/60">
              Al continuar te llevaremos a la página segura de Stripe para pagar con tarjeta.
              Nosotros nunca vemos ni guardamos los datos de tu tarjeta.
            </p>

            <label className="flex items-start gap-2 text-sm text-ink/70 pt-1">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-0.5"
              />
              <span>Acepto los términos y condiciones y la política de devoluciones.</span>
            </label>
          </div>

          {error && <p className="text-terra text-xs">{error}</p>}

          <button
            type="submit"
            disabled={procesando || !aceptaTerminos}
            className="w-full bg-forest text-cream font-semibold rounded-lg px-4 py-3 text-sm hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {procesando ? 'Redirigiendo a Stripe…' : `Pagar con Stripe — ${dinero(totalPrecio)}`}
          </button>
        </form>

        <div className="sm:col-span-2">
          <div className="bg-stone-light border border-stone rounded-sm p-4 sm:sticky sm:top-20">
            <h2 className="font-display text-base text-ink mb-3">Resumen</h2>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-ink/70">
                  <span className="truncate pr-2">{item.nombre} × {item.cantidad}</span>
                  <span className="font-mono shrink-0">{dinero(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-stone pt-3">
              <span className="font-display text-ink">Total</span>
              <span className="font-mono text-xl text-terra font-bold">{dinero(totalPrecio)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}