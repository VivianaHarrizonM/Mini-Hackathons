import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-ink text-center mb-1">Reto de Ahorro</h1>
        <p className="text-center text-ink/60 mb-8">Inicia sesión para seguir tu meta</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-jade/10 p-6 space-y-4">
          <div>
            <label className="text-sm text-ink/70">Correo</label>
            <input
              type="email"
              required
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="w-full mt-1 rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jade/40"
            />
          </div>
          <div>
            <label className="text-sm text-ink/70">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jade/40"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-jade text-white font-medium hover:bg-jade-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-jade-dark font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
