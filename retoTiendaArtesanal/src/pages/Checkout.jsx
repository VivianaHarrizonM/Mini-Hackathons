import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import * as orderService from '../data/api/orderService'
import CardPreview from '../components/CardPreview'
import { formatearNumeroTarjeta, formatearVencimiento, validarTarjeta } from '../utils/cardFormat'

export default function Checkout() {
  const { user } = useAuth()
  const { items, totalPrecio, vaciar } = useCart()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [calle, setCalle] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [telefono, setTelefono] = useState('')

  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [nombreTarjeta, setNombreTarjeta] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [cvv, setCvv] = useState('')

  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-10 text-center">
        <p className="text-ink/70 mb-4">Necesitas iniciar sesión para continuar con tu compra.</p>
        <Link
          to="/login"
          state={{ redirectTo: '/checkout' }}
          className="bg-indigo text-lino font-semibold rounded-lg px-5 py-2.5 text-sm inline-block"
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
        <Link to="/" className="bg-barro text-lino font-semibold rounded-lg px-5 py-2.5 text-sm inline-block">
          Ver el catálogo
        </Link>
      </main>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errorTarjeta = validarTarjeta({ numero: numeroTarjeta, nombre: nombreTarjeta, vencimiento, cvv })
    if (errorTarjeta) {
      setError(errorTarjeta)
      return
    }

    setProcesando(true)
    try {
      const pedido = await orderService.crearPedido(user.id, {
        items,
        direccionEnvio: { nombre, calle, ciudad, codigoPostal, telefono },
        total: totalPrecio,
      })
      vaciar()
      navigate('/perfil', { state: { pedidoConfirmado: pedido.id } })
    } catch (err) {
      setError(err.message || 'No se pudo procesar el pedido')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">Finalizar compra</h1>

      <div className="grid sm:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="sm:col-span-3 space-y-5">
          <div className="bg-white border border-kraft rounded-sm p-5 space-y-3">
            <h2 className="font-display text-lg text-ink mb-1">Dirección de envío</h2>

            <input required type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-barro" />
            <input required type="text" placeholder="Calle y número" value={calle} onChange={(e) => setCalle(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-barro" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-barro" />
              <input required type="text" placeholder="Código postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-barro" />
            </div>
            <input required type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-barro" />
          </div>

          <div className="bg-white border border-kraft rounded-sm p-5 space-y-3">
            <h2 className="font-display text-lg text-ink mb-1">Método de pago</h2>

            <div className="mb-3">
              <CardPreview numero={numeroTarjeta} nombre={nombreTarjeta} vencimiento={vencimiento} />
            </div>

            <input
              required
              type="text"
              inputMode="numeric"
              placeholder="Número de tarjeta"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(formatearNumeroTarjeta(e.target.value))}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-barro"
            />
            <input
              required
              type="text"
              placeholder="Nombre del titular"
              value={nombreTarjeta}
              onChange={(e) => setNombreTarjeta(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-barro"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={vencimiento}
                onChange={(e) => setVencimiento(formatearVencimiento(e.target.value))}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-barro"
              />
              <input
                required
                type="text"
                inputMode="numeric"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-barro"
              />
            </div>

            <p className="text-xs text-ink/40 pt-1">
              💳 El pago es simulado por ahora — no se hace ningún cargo real, se conectará cuando exista el backend.
            </p>
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button type="submit" disabled={procesando}
            className="w-full bg-indigo text-lino font-semibold rounded-lg px-4 py-3 text-sm disabled:opacity-60">
            {procesando ? 'Procesando…' : `Confirmar pedido — $${totalPrecio}`}
          </button>
        </form>

        <div className="sm:col-span-2">
          <div className="bg-kraft-light border border-kraft rounded-sm p-4 sm:sticky sm:top-20">
            <h2 className="font-display text-base text-ink mb-3">Resumen</h2>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-ink/70">
                  <span className="truncate pr-2">{item.nombre} × {item.cantidad}</span>
                  <span className="font-mono shrink-0">${item.precio * item.cantidad}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-kraft pt-3">
              <span className="font-display text-ink">Total</span>
              <span className="font-mono text-xl text-barro font-bold">${totalPrecio}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}