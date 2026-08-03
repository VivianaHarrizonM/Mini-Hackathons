import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Capsulas from './pages/Capsulas'
import CreateCapsula from './pages/CreateCapsula'
import CapsulaDetail from './pages/CapsulaDetail'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-capsule-cream">
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<ProtectedRoute><Capsulas /></ProtectedRoute>} />
        <Route path="/nueva" element={<ProtectedRoute><CreateCapsula /></ProtectedRoute>} />
        <Route path="/capsulas/:id" element={<ProtectedRoute><CapsulaDetail /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
