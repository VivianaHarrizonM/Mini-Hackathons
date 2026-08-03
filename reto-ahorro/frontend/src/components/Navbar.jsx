import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const linkClass = 'text-ink/70 hover:text-jade transition-colors'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="border-b border-jade/15 bg-sage/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg sm:text-xl font-semibold text-ink flex items-center gap-2" onClick={cerrarMenu}>
          <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0" />
          Reto de Ahorro
        </Link>

        {/* Nav de escritorio */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link to="/" className={linkClass}>Mis metas</Link>
          <Link to="/goals/new" className={linkClass}>Crear meta</Link>
          <Link to="/perfil" className={linkClass}>{user?.nombre || 'Perfil'}</Link>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-full border border-ink/15 text-ink/70 hover:border-jade hover:text-jade transition-colors"
          >
            Salir
          </button>
        </nav>

        {/* Botón hamburguesa (solo mobile) */}
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-ink/15 text-ink/70"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú desplegable mobile */}
      {menuAbierto && (
        <nav className="sm:hidden border-t border-jade/10 px-4 py-3 flex flex-col gap-1 text-sm bg-sage">
          <Link to="/" className="py-2" onClick={cerrarMenu}>Mis metas</Link>
          <Link to="/goals/new" className="py-2" onClick={cerrarMenu}>Crear meta</Link>
          <Link to="/perfil" className="py-2" onClick={cerrarMenu}>{user?.nombre || 'Perfil'}</Link>
          <button
            onClick={() => {
              cerrarMenu()
              handleLogout()
            }}
            className="text-left py-2 text-ink/70"
          >
            Salir
          </button>
        </nav>
      )}
    </header>
  )
}
