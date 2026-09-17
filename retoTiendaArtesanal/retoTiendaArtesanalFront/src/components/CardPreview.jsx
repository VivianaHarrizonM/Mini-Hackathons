export default function CardPreview({ numero, nombre, vencimiento }) {
  const numeroMostrado = numero || '•••• •••• •••• ••••'
  const nombreMostrado = nombre || 'NOMBRE COMPLETO'
  const vencimientoMostrado = vencimiento || 'MM/AA'

  return (
    <div className="bg-forest-dark rounded-lg p-5 text-cream relative overflow-hidden aspect-[1.6/1] flex flex-col justify-between shadow-lg">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-terra/20" />
      <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-sage/10" />

      <div className="flex justify-between items-start relative">
        <span className="font-display text-sm tracking-wide">Hilo &amp; Barro</span>
        <div className="w-9 h-6 rounded-sm bg-mustard/85" />
      </div>

      <p className="font-mono text-lg sm:text-xl tracking-widest relative">{numeroMostrado}</p>

      <div className="flex justify-between items-end text-xs relative">
        <div>
          <p className="opacity-60 mb-0.5">Titular</p>
          <p className="font-mono uppercase tracking-wide">{nombreMostrado}</p>
        </div>
        <div className="text-right">
          <p className="opacity-60 mb-0.5">Vence</p>
          <p className="font-mono">{vencimientoMostrado}</p>
        </div>
      </div>
    </div>
  )
}