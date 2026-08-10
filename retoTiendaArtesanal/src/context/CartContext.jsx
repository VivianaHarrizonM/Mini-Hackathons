import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'hb_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  function agregar(producto, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id)
      if (existente) {
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      }
      return [
        ...prev,
        {
          id: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagenes?.[0],
          artesano: producto.artesano,
          stock: producto.stock,
          cantidad,
        },
      ]
    })
  }

  function actualizarCantidad(id, cantidad) {
    if (cantidad <= 0) {
      quitar(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)))
  }

  function quitar(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function vaciar() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrecio = items.reduce((sum, i) => sum + i.cantidad * i.precio, 0)

  return (
    <CartContext.Provider
      value={{ items, agregar, actualizarCantidad, quitar, vaciar, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}