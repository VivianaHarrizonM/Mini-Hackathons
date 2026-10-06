import { request } from './apiClient'

export async function sincronizarCarrito(itemsLocales) {
  const actual = await request('/api/carrito', { auth: true })
  for (const it of actual.items) {
    await request(`/api/carrito/items/${it.id}`, { method: 'DELETE', auth: true })
  }
  for (const it of itemsLocales) {
    await request('/api/carrito/items', {
      method: 'POST',
      auth: true,
      body: { productoId: it.id, cantidad: it.cantidad },
    })
  }
}