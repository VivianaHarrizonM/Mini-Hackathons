import { useEffect, useState } from 'react'
import * as productService from '../data/api/productService'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'

export default function Home() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getCategorias().then(setCategorias)
  }, [])

  useEffect(() => {
    setLoading(true)
    productService
      .getProductos({ categoria: categoriaActiva, busqueda })
      .then(setProductos)
      .finally(() => setLoading(false))
  }, [categoriaActiva, busqueda])

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">
          Piezas hechas a mano, de taller a tu casa
        </h1>
        <p className="text-ink/60">
          Cada producto viene de un artesano real — sin producción en masa.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Buscar productos…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-80 border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-barro"
        />
        <CategoryFilter
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSelect={setCategoriaActiva}
        />
      </div>

      {loading && <p className="text-ink/50 text-sm">Cargando…</p>}

      {!loading && productos.length === 0 && (
        <p className="text-ink/50 text-sm">No encontramos productos con ese filtro.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </main>
  )
}