import { Link } from 'react-router-dom'

const enlace = 'hover:text-forest transition-colors'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-10">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-ink/50">
        <p>© {new Date().getFullYear()} Hilo &amp; Barro — Artesanías hechas a mano</p>
        <nav className="flex flex-wrap gap-4">
          <Link to="/legal/terminos" className={enlace}>Términos y condiciones</Link>
          <Link to="/legal/privacidad" className={enlace}>Aviso de privacidad</Link>
          <Link to="/legal/devoluciones" className={enlace}>Devoluciones</Link>
        </nav>
      </div>
    </footer>
  )
}