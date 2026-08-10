import { useEffect, useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as orderService from '../data/api/orderService'

export default function Profile() {
  const { user } = useAuth()
  const location = useLocation()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const pedidoConfirmadoId = location.state?.pedidoConfirmado

  useEffect(() => {
    if (!user) return
    orderService.getMisPedidos(user.id)
      .then(setPedidos)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: '/perfil' }} replace />
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-1">Hola, {user.nombre.split(' ')[0]}</h1>
      <p className="text-ink/60 mb-6">{user.email}</p>

      {pedidoConfirmadoId && (
        <div className="bg-musgo/15 border border-musgo/40 text-musgo rounded-lg px-4 py-3 mb-6 text-sm">
          ✅ ¡Pedido #{pedidoConfirmadoId} confirmado! Aquí abajo puedes ver el detalle.
        </div>
      )}

      <h2 className="font-display text-xl text-ink mb-4">Mis pedidos</h2>

      {loading && <p className="text-ink/50 text-sm">Cargando…</p>}

      {!loading && pedidos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-sm border border-kraft">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-ink/60 mb-4">Todavía no tienes ningún pedido.</p>
          <Link to="/" className="bg-barro text-lino font-semibold rounded-lg px-4 py-2 text-sm">
            Ver el catálogo
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white border border-kraft rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-ink/50">Pedido #{pedido.id}</p>
                <p className="text-xs text-ink/50">
                  {new Date(pedido.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className="text-xs font-semibold bg-musgo/15 text-musgo px-2 py-1 rounded-full capitalize">
                {pedido.estado}
              </span>
            </div>

            <div className="divide-y divide-kraft-light border-t border-kraft-light">
              {pedido.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="text-ink/80">{item.nombre} × {item.cantidad}</span>
                  <span className="font-mono text-ink/60">${item.precio * item.cantidad}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 mt-1 border-t border-kraft">
              <span className="text-xs text-ink/50">
                Envío a: {pedido.direccionEnvio.ciudad}
              </span>
              <span className="font-mono text-lg text-barro font-bold">${pedido.total}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}