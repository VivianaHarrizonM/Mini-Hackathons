import { useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement, Tooltip)

const PALETA = ['#1F7A5C', '#D4A017', '#2FA37A', '#14503C', '#E8C158']

export default function StatsCharts({ contribuciones, objetivo }) {
  const acumulado = useMemo(() => {
    const ordenadas = [...contribuciones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    let total = 0
    return ordenadas.map((c) => {
      total += c.cantidad
      return {
        fecha: new Date(c.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        total,
      }
    })
  }, [contribuciones])

  const porParticipante = useMemo(() => {
    const totales = {}
    contribuciones.forEach((c) => {
      totales[c.usuarioNombre] = (totales[c.usuarioNombre] || 0) + c.cantidad
    })
    return Object.entries(totales).sort((a, b) => b[1] - a[1])
  }, [contribuciones])

  if (contribuciones.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-jade/10 p-5 text-center text-ink/50 text-sm">
        Las gráficas aparecerán en cuanto haya al menos una aportación.
      </div>
    )
  }

  const lineData = {
    labels: acumulado.map((a) => a.fecha),
    datasets: [
      {
        label: 'Ahorrado',
        data: acumulado.map((a) => a.total),
        borderColor: '#1F7A5C',
        backgroundColor: 'rgba(31, 122, 92, 0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#D4A017',
      },
    ],
  }

  const barData = {
    labels: porParticipante.map(([nombre]) => nombre),
    datasets: [
      {
        label: 'Aportado',
        data: porParticipante.map(([, total]) => total),
        backgroundColor: porParticipante.map((_, i) => PALETA[i % PALETA.length]),
        borderRadius: 6,
      },
    ],
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        max: objetivo,
        ticks: { callback: (v) => `$${v.toLocaleString('es-MX')}` },
        grid: { color: 'rgba(15,46,43,0.06)' },
      },
      x: { grid: { display: false } },
    },
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-jade/10 p-4 sm:p-5">
        <h3 className="font-display text-base font-semibold text-ink mb-3">Progreso acumulado</h3>
        <div className="h-48">
          <Line data={lineData} options={commonOptions} />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-jade/10 p-4 sm:p-5">
        <h3 className="font-display text-base font-semibold text-ink mb-3">Aportado por persona</h3>
        <div className="h-48">
          <Bar data={barData} options={{ ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, max: undefined } } }} />
        </div>
      </div>
    </div>
  )
}