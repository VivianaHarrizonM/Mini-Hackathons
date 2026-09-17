import { delay } from './delay'
import { productos, categorias, getProductoPorSlug } from '../mockProducts'

export async function getProductos({ categoria = null, busqueda = '' } = {}) {
  await delay()
  let resultado = [...productos]

  if (categoria) {
    resultado = resultado.filter((p) => p.categoria === categoria)
  }
  if (busqueda.trim()) {
    const q = busqueda.trim().toLowerCase()
    resultado = resultado.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.descripcionCorta.toLowerCase().includes(q)
    )
  }
  return resultado
}

export async function getProductoPorSlugAsync(slug) {
  await delay()
  const producto = getProductoPorSlug(slug)
  if (!producto) {
    const error = new Error('Producto no encontrado')
    error.status = 404
    throw error
  }
  return producto
}

export async function getCategorias() {
  await delay(200)
  return categorias
}

export async function getDestacados() {
  await delay()
  return productos.filter((p) => p.destacado)
}