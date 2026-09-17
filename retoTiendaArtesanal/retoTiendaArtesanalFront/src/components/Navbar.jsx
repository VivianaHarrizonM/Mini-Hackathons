import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import LogoMark from './LogoMark'
import IconBasket from './IconBasket'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-forest text-cream sticky top-0 z-20 shadow-md border-b border-terra/40">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <LogoMark className="w-10 h-10" />
          <span className="font-display text-xl font-semibold tracking-wide">Hilo &amp; Barro</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link to="/" className="hidden sm:inline hover:text-mustard transition-colors font-medium">
            Catálogo
          </Link>

          <Link to="/carrito" className="relative hover:text-mustard transition-colors">
            <IconBasket className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-terra text-cream text-[10px] font-mono w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/perfil" className="hidden sm:inline hover:text-mustard transition-colors">
                Hola, {user.nombre.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-terra text-cream font-semibold px-4 py-2 rounded-full hover:bg-terra-dark transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-terra text-cream font-semibold px-4 py-2 rounded-full hover:bg-terra-dark transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}