import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const recienRegistrado = location.state?.registrado

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.redirectTo || '/')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 bg-indigo">
      <div className="w-full max-w-sm bg-lino rounded-sm shadow-xl p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Bienvenido de vuelta</h1>
        <p className="text-sm text-ink/60 mb-6">Entra para ver tu carrito y tus pedidos.</p>

        {recienRegistrado && (
          <p className="text-sm bg-musgo/15 border border-musgo/40 text-musgo rounded-lg px-3 py-2 mb-4">
            ¡Cuenta creada! Ahora inicia sesión.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-barro" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-barro" />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo text-lino font-semibold rounded-lg px-4 py-2.5 text-sm disabled:opacity-60">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-5 text-center">
          ¿No tienes cuenta? <Link to="/registro" className="text-indigo font-semibold underline">Regístrate</Link>
        </p>
      </div>
    </main>
  )
}