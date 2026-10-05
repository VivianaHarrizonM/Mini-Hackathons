import { request } from './apiClient'

export async function register(nombre, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { nombre, email, password },
  })
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}