import { delay } from './delay'

/**
 * CONTRATO ESPERADO DEL BACKEND:
 *   POST /api/auth/register  { nombre, email, password } -> { token, id, nombre, email }
 *   POST /api/auth/login     { email, password }          -> { token, id, nombre, email }
 *
 * Por ahora todo se guarda en localStorage bajo 'hb_users' simulando la
 * tabla de usuarios. El "token" es falso (no es seguro), solo sirve para
 * que el resto de la app (AuthContext, rutas protegidas) funcione igual
 * que funcionará con JWT real.
 */

const USERS_KEY = 'hb_users'

function leerUsuarios() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios))
}

export async function register(nombre, email, password) {
  await delay()
  const usuarios = leerUsuarios()

  if (usuarios.some((u) => u.email === email)) {
    const error = new Error('Ya existe una cuenta con ese correo')
    error.status = 409
    throw error
  }

  const nuevo = { id: Date.now(), nombre, email, password }
  usuarios.push(nuevo)
  guardarUsuarios(usuarios)

  return {
    token: `fake-token-${nuevo.id}`,
    id: nuevo.id,
    nombre: nuevo.nombre,
    email: nuevo.email,
  }
}

export async function login(email, password) {
  await delay()
  const usuarios = leerUsuarios()
  const user = usuarios.find((u) => u.email === email && u.password === password)

  if (!user) {
    const error = new Error('Correo o contraseña incorrectos')
    error.status = 401
    throw error
  }

  return {
    token: `fake-token-${user.id}`,
    id: user.id,
    nombre: user.nombre,
    email: user.email,
  }
}