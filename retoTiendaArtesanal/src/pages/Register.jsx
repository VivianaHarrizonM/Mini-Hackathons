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
      setError(err.message || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-forest">
      <div className="w-full max-w-sm bg-cream rounded-sm shadow-xl p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Crea tu cuenta</h1>
        <p className="text-sm text-ink/60 mb-6">Para poder comprar y ver tus pedidos.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-terra" />
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-terra" />
          <input type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-terra" />
          {error && <p className="text-terra text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-forest text-cream font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-forest-dark transition-colors disabled:opacity-60">
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-5 text-center">
          ¿Ya tienes cuenta? <Link to="/login" className="text-forest font-semibold underline">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}