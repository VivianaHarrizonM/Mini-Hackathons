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
    <>
      <div className="relative overflow-hidden border-b border-ink/8">
        {/* manchas decorativas de color, solo en pantallas grandes para no estorbar en mobile */}
        <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 pointer-events-none">
          <div className="absolute top-8 right-6 w-56 h-56 rounded-[45%_55%_60%_40%] bg-terra/20" />
          <div className="absolute top-28 right-32 w-36 h-36 rounded-[60%_40%_45%_55%] bg-sage/40" />
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-10 pb-8 sm:pt-14 sm:pb-10 relative">
          <h1 className="font-display text-3xl sm:text-5xl text-ink leading-[1.1] mb-3 max-w-xl">
            Piezas <span className="text-terra">hechas a mano</span>,<br />
            del taller a <span className="text-terra">tu casa</span>
          </h1>
          <p className="text-ink/60 mb-3 max-w-md">
            Cada producto viene de un artesano real — sin producción en masa.
          </p>
          <div className="w-14 h-1 rounded-full bg-mustard mb-6" />

          <input
            type="text"
            placeholder="Buscar productos…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full sm:w-96 bg-white rounded-full px-5 py-3 text-sm shadow-sm border border-ink/10 focus:outline-none focus:ring-2 focus:ring-terra mb-5"
          />

          <CategoryFilter
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelect={setCategoriaActiva}
          />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
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
    </>
  )
}