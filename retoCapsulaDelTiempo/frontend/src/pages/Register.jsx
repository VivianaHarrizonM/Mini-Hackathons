import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(nombre, email, password)
      navigate('/login', { state: { registrado: true } })
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 bg-capsule-bg">
      <div className="w-full max-w-sm bg-capsule-cream rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Crea tu cuenta</h1>
        <p className="text-sm text-ink/60 mb-6">Para empezar a guardar recuerdos en el tiempo.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold" />
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold" />
          <input type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-capsule-gold" />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-capsule-bg text-capsule-cream font-semibold rounded-lg px-4 py-2.5 text-sm disabled:opacity-60">
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-5 text-center">
          ¿Ya tienes cuenta? <Link to="/login" className="text-capsule-bg font-semibold underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
