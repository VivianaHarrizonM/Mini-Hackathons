import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-indigo text-lino sticky top-0 z-20 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-wide">
          Hilo &amp; Barro
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 text-sm">
          <Link to="/" className="hidden sm:inline hover:opacity-80">Catálogo</Link>

          <Link to="/carrito" className="relative hover:opacity-80">
            🧺
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-barro text-lino text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/perfil" className="hidden sm:inline hover:opacity-80">
                Hola, {user.nombre.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-barro text-lino font-semibold px-3 py-1.5 rounded-full hover:opacity-90"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-barro text-lino font-semibold px-3 py-1.5 rounded-full hover:opacity-90"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}