import { useEffect, useState } from 'react'
import { authService } from '../api/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState(user)

  useEffect(() => {
    authService.me().then(({ data }) => setPerfil(data))
  }, [])

  if (!perfil) return null

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Perfil</h1>
      <div className="bg-white rounded-2xl border border-jade/10 p-6 space-y-4">
        <div>
          <p className="text-sm text-ink/60">Nombre</p>
          <p className="text-ink font-medium">{perfil.nombre}</p>
        </div>
        <div>
          <p className="text-sm text-ink/60">Correo</p>
          <p className="text-ink font-medium">{perfil.correo}</p>
        </div>
      </div>
    </main>
  )
}
