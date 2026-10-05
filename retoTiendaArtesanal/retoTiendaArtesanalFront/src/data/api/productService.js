import { request } from './apiClient'


export async function getProductos({ categoria = null, busqueda = '' } = {}) {
  let resultado = await request('/api/productos')

  if (categoria) {
    resultado = resultado.filter((p) => p.categoria === categoria)
  }
  if (busqueda.trim()) {
    const q = busqueda.trim().toLowerCase()
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcionCorta || '').toLowerCase().includes(q)
    )
  }
  return resultado
}

export async function getProductoPorSlugAsync(slug) {
  return request(`/api/productos/slug/${encodeURIComponent(slug)}`)
}


export async function getCategorias() {
  const categorias = await request('/api/categorias')
  return categorias.map((c) => ({ ...c, id: c.slug }))
}

export async function getDestacados() {
  return request('/api/productos/destacados')
}