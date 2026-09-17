import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconCheckCircle } from '../components/icons'

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
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-forest">
      <div className="w-full max-w-sm bg-cream rounded-sm shadow-xl p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Bienvenido de vuelta</h1>
        <p className="text-sm text-ink/60 mb-6">Entra para ver tu carrito y tus pedidos.</p>

        {recienRegistrado && (
          <p className="flex items-center gap-2 text-sm bg-sage-light border border-sage text-forest rounded-lg px-3 py-2 mb-4">
            <IconCheckCircle className="w-4 h-4 shrink-0" />
            ¡Cuenta creada! Ahora inicia sesión.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-terra" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-terra" />
          {error && <p className="text-terra text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-forest text-cream font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-forest-dark transition-colors disabled:opacity-60">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-5 text-center">
          ¿No tienes cuenta? <Link to="/registro" className="text-forest font-semibold underline">Regístrate</Link>
        </p>
      </div>
    </main>
  )
}