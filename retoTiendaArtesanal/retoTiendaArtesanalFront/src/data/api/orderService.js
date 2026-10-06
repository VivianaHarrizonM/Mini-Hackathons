import { request } from './apiClient'

export function crearPedido(datos) {
  return request('/api/pedidos', { method: 'POST', auth: true, body: datos })
}

export function getMisPedidos() {
  return request('/api/pedidos', { auth: true })
}

export function getPedido(id) {
  return request(`/api/pedidos/${id}`, { auth: true })
}

export async function iniciarCheckout(pedidoId) {
  const { checkoutUrl } = await request(`/api/pedidos/${pedidoId}/checkout`, {
    method: 'POST',
    auth: true,
  })
  return checkoutUrl
}