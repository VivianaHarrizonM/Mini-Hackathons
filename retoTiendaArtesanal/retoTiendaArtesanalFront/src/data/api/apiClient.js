const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// El backend responde errores como { error, status, path, timestamp },
// salvo las validaciones de formulario, que vienen como { campo: "mensaje" }.
function mensajeDeError(data, status) {
  if (data && typeof data.error === 'string') return data.error
  if (data && typeof data === 'object') {
    const mensajes = Object.values(data).filter((v) => typeof v === 'string')
    if (mensajes.length) return mensajes.join('. ')
  }
  return `Error inesperado (${status})`
}

export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = localStorage.getItem('hb_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Intenta de nuevo en un momento.', 0)
  }

  const texto = await response.text()
  let data = null
  if (texto) {
    try {
      data = JSON.parse(texto)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    throw new ApiError(mensajeDeError(data, response.status), response.status)
  }
  return data
}