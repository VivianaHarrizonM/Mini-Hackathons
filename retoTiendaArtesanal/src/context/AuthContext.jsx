import { createContext, useContext, useState } from 'react'
import * as authService from '../data/api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hb_user')
    return stored ? JSON.parse(stored) : null
  })

  function persist(data) {
    localStorage.setItem('hb_token', data.token)
    const u = { id: data.id, nombre: data.nombre, email: data.email }
    localStorage.setItem('hb_user', JSON.stringify(u))
    setUser(u)
  }

  async function login(email, password) {
    const data = await authService.login(email, password)
    persist(data)
  }

  async function register(nombre, email, password) {
    const data = await authService.register(nombre, email, password)
    persist(data)
  }

  function logout() {
    localStorage.removeItem('hb_token')
    localStorage.removeItem('hb_user')
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