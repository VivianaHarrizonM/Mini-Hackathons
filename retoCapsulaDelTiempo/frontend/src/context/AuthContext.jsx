import { createContext, useContext, useState } from 'react'
import * as authService from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('capsula_user')
    return stored ? JSON.parse(stored) : null
  })

  function persist(data) {
    localStorage.setItem('capsula_token', data.token)
    const u = { id: data.id, nombre: data.nombre, email: data.email }
    localStorage.setItem('capsula_user', JSON.stringify(u))
    setUser(u)
  }

  async function login(email, password) {
    const data = await authService.login(email, password)
    persist(data)
  }

  async function register(nombre, email, password) {
    // Solo crea la cuenta, no inicia sesión automáticamente.
    // El usuario debe ir a /login a entrar con sus credenciales.
    await authService.register(nombre, email, password)
  }

  function logout() {
    localStorage.removeItem('capsula_token')
    localStorage.removeItem('capsula_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
