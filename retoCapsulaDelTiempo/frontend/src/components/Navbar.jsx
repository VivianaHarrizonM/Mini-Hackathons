import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-capsule-bg text-capsule-cream sticky top-0 z-20 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-semibold tracking-wide flex items-center gap-2">
          <span>⏳</span> Cápsula del Tiempo
        </Link>

        {user && (
          <button
            className="sm:hidden text-capsule-cream text-2xl leading-none"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        )}

        {user && (
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="opacity-80">Hola, {user.nombre.split(' ')[0]}</span>
            <button onClick={handleLogout} className="bg-capsule-gold text-capsule-bg font-semibold px-3 py-1.5 rounded-full hover:opacity-90">
              Salir
            </button>
          </div>
        )}
      </div>

      {user && open && (
        <div className="sm:hidden bg-capsule-bg border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
          <span className="opacity-80">Hola, {user.nombre.split(' ')[0]}</span>
          <button onClick={handleLogout} className="bg-capsule-gold text-capsule-bg font-semibold px-3 py-2 rounded-full">
            Salir
          </button>
        </div>
      )}
    </nav>
  )
}
