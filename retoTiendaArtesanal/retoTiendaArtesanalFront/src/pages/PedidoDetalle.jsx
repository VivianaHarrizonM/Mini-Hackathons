import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import * as orderService from '../data/api/orderService'
import { ESTADOS_PEDIDO, dinero } from '../utils/estadoPedido'

export default function PedidoDetalle() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const pago = searchParams.get('pago')
  const { user } = useAuth()
  const { vaciar } = useCart()

  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reintentando, setReintentando] = useState(false)

  // El pago salió bien: ahora sí se vacía el carrito local
  useEffect(() => {
    if (pago === 'exito') vaciar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pago])

  useEffect(() => {
    if (!user) return
    let cancelado = false
    let intentos = 0
    let timer

    async function cargar() {
      try {
        const p = await orderService.getPedido(id)
        if (cancelado) return
        setPedido(p)
        setError('')
        setLoading(false)
        // el webhook puede tardar unos segundos en marcar PAGADO
        if (pago === 'exito' && p.estado === 'PENDIENTE_PAGO' && intentos < 8) {
          intentos += 1
          timer = setTimeout(cargar, 2000)
        }
      } catch (e) {
        if (cancelado) return
        setError(e.message || 'No se pudo cargar el pedido')
        setLoading(false)
      }
    }

    cargar()
    return () => {
      cancelado = true
      clearTimeout(timer)
    }
  }, [id, pago, user])

  async function reintentarPago() {
    setReintentando(true)
    try {
      const url = await orderService.iniciarCheckout(id)
      window.location.assign(url)
    } catch (e) {
      setError(e.message || 'No se pudo reiniciar el pago')
      setReintentando(false)
    }
  }

  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: `/pedidos/${id}` }} replace />
  }

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-10 text-ink/50 text-sm">Cargando…</main>
  }

  if (error && !pedido) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-terra mb-4">{error}</p>
        <Link to="/perfil" className="text-forest font-semibold underline">Ir a mis pedidos</Link>
      </main>
    )
  }

  const estado = ESTADOS_PEDIDO[pedido.estado] || { label: pedido.estado, clase: 'bg-stone-light text-ink' }
  const pendiente = pedido.estado === 'PENDIENTE_PAGO'

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      {pago === 'exito' && pedido.estado === 'PAGADO' && (
        <div className="bg-sage-light border border-sage text-forest rounded-lg px-4 py-3 mb-6 text-sm">
          ¡Pago confirmado! Te enviamos un correo con el detalle de tu pedido.
        </div>
      )}
      {pago === 'exito' && pendiente && (
        <div className="bg-mustard/20 border border-mustard text-ink rounded-lg px-4 py-3 mb-6 text-sm">
          Estamos confirmando tu pago… esto toma unos segundos.
        </div>
      )}
      {pago === 'cancelado' && pendiente && (
        <div className="bg-terra/10 border border-terra/30 text-ink rounded-lg px-4 py-3 mb-6 text-sm">
          Cancelaste el pago. Tu pedido sigue pendiente y no se hizo ningún cargo.
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl text-ink">Pedido #{pedido.id}</h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${estado.clase}`}>{estado.label}</span>
      </div>

      <div className="bg-paper border border-stone rounded-sm p-4">
        <div className="divide-y divide-stone-light">
          {pedido.items.map((item, i) => (
            <div key={item.productoId ?? i} className="flex justify-between py-2 text-sm">
              <span className="text-ink/80">{item.nombreProducto} × {item.cantidad}</span>
              <span className="font-mono text-ink/60">{dinero(item.precioUnitario * item.cantidad)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 mt-1 border-t border-stone">
          <span className="text-xs text-ink/50">
            Envío a: {pedido.nombreDestinatario}, {pedido.direccion}, {pedido.ciudad}, {pedido.estadoDireccion}, CP {pedido.codigoPostal}
          </span>
          <span className="font-mono text-lg text-terra font-bold">{dinero(pedido.total)}</span>
        </div>
      </div>

      {error && <p className="text-terra text-xs mt-3">{error}</p>}

      <div className="flex gap-3 mt-6">
        {pendiente && (
          <button
            onClick={reintentarPago}
            disabled={reintentando}
            className="bg-forest text-cream font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {reintentando ? 'Redirigiendo…' : 'Pagar ahora'}
          </button>
        )}
        <Link to="/perfil" className="border border-forest text-forest font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-forest hover:text-cream transition-colors">
          Mis pedidos
        </Link>
      </div>
    </main>
  )
}