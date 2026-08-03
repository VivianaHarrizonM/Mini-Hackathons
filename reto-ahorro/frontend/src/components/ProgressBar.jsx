// Elemento distintivo: la barra de progreso se dibuja como un frasco de ahorro
// que se va llenando, con una "ola" animada en la superficie del líquido.
export default function ProgressBar({ actual, objetivo, size = 'lg' }) {
  const porcentaje = objetivo > 0 ? Math.min((actual / objetivo) * 100, 100) : 0
  const height = size === 'lg' ? 'h-40' : 'h-24'

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
      <div className={`relative w-20 sm:w-24 ${height} shrink-0`}>
        {/* Contorno del frasco */}
        <div className="absolute inset-0 rounded-b-3xl rounded-t-lg border-2 border-jade/30 overflow-hidden bg-white/40">
          {/* Relleno */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-jade to-jade-light transition-all duration-700 ease-out"
            style={{ height: `${porcentaje}%` }}
          >
            {/* Ola animada en la superficie */}
            <div
              className="absolute -top-2 left-0 right-0 h-4 opacity-70 animate-wave"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 8px 8px, transparent 8px, #D4A017 8.5px)',
                backgroundSize: '28px 16px',
                backgroundRepeat: 'repeat-x',
              }}
            />
          </div>
        </div>
        {/* Marca de cuello del frasco */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 rounded-t-md border-2 border-b-0 border-jade/30 bg-white/40" />
      </div>

      <div className="flex-1 w-full text-center sm:text-left">
        <p className="text-sm text-ink/60 font-body">Llevan ahorrado</p>
        <p className="font-mono-nums text-2xl sm:text-3xl font-semibold text-ink">
          ${actual.toLocaleString('es-MX')}
        </p>
        <p className="text-sm text-ink/60 font-body mb-2">
          de ${objetivo.toLocaleString('es-MX')} meta
        </p>
        <div className="w-full h-2.5 rounded-full bg-jade/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-jade to-gold transition-all duration-700 ease-out"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <p className="font-mono-nums text-sm text-jade-dark mt-1">{porcentaje.toFixed(0)}%</p>
      </div>
    </div>
  )
}
