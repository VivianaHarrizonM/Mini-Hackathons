import { delay } from './delay'

const ORDERS_KEY = 'hb_orders'

function leerPedidos() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
}

function guardarPedidos(pedidos) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(pedidos))
}

export async function crearPedido(usuarioId, { items, direccionEnvio, total }) {
  await delay(600)
  const pedidos = leerPedidos()

  const nuevo = {
    id: Date.now(),
    usuarioId,
    items,
    direccionEnvio,
    total,
    estado: 'confirmado',
    fecha: new Date().toISOString(),
  }

  pedidos.push(nuevo)
  guardarPedidos(pedidos)
  return nuevo
}

export async function getMisPedidos(usuarioId) {
  await delay()
  return leerPedidos()
    .filter((p) => p.usuarioId === usuarioId)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}