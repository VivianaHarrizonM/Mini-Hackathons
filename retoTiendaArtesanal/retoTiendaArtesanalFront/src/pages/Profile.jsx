import { useEffect, useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as orderService from '../data/api/orderService'
import { IconBox, IconCheckCircle } from '../components/icons'

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
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-1">
        Hola, <span className="text-terra">{user.nombre.split(' ')[0]}</span>
      </h1>
      <p className="text-ink/60 mb-6">{user.email}</p>

      {pedidoConfirmadoId && (
        <div className="flex items-center gap-2 bg-sage-light border border-sage text-forest rounded-lg px-4 py-3 mb-6 text-sm">
          <IconCheckCircle className="w-5 h-5 shrink-0" />
          ¡Pedido #{pedidoConfirmadoId} confirmado! Aquí abajo puedes ver el detalle.
        </div>
      )}

      <h2 className="font-display text-xl text-ink mb-4">Mis pedidos</h2>

      {loading && <p className="text-ink/50 text-sm">Cargando…</p>}

      {!loading && pedidos.length === 0 && (
        <div className="text-center py-12 bg-paper rounded-sm border border-stone">
          <IconBox className="w-10 h-10 mx-auto mb-3 text-ink/25" />
          <p className="text-ink/60 mb-4">Todavía no tienes ningún pedido.</p>
          <Link to="/" className="bg-terra text-cream font-semibold rounded-lg px-4 py-2 text-sm hover:bg-terra-dark transition-colors">
            Ver el catálogo
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-paper border border-stone rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-ink/50">Pedido #{pedido.id}</p>
                <p className="text-xs text-ink/50">
                  {new Date(pedido.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className="text-xs font-semibold bg-sage-light text-forest px-2.5 py-1 rounded-full capitalize">
                {pedido.estado}
              </span>
            </div>

            <div className="divide-y divide-stone-light border-t border-stone-light">
              {pedido.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="text-ink/80">{item.nombre} × {item.cantidad}</span>
                  <span className="font-mono text-ink/60">${item.precio * item.cantidad}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 mt-1 border-t border-stone">
              <span className="text-xs text-ink/50">
                Envío a: {pedido.direccionEnvio.ciudad}
              </span>
              <span className="font-mono text-lg text-terra font-bold">${pedido.total}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}