import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PedidoDetalle from './pages/PedidoDetalle'

export default function App() {
  return (
    <div className="min-h-screen bg-lino">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/pedidos/:id" element={<PedidoDetalle />} />
      </Routes>
    </div>
  )
}