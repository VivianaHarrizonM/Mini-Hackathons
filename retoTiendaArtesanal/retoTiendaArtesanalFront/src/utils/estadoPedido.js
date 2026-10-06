export const ESTADOS_PEDIDO = {
  PENDIENTE_PAGO: { label: 'Pendiente de pago', clase: 'bg-mustard/25 text-ink' },
  PAGADO: { label: 'Pagado', clase: 'bg-sage-light text-forest' },
  CANCELADO: { label: 'Cancelado', clase: 'bg-terra/10 text-terra' },
}

export function dinero(valor) {
  return `$${Number(valor).toFixed(2)}`
}