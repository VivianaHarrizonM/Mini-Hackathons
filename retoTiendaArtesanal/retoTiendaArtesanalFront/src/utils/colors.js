// Genera una variante más oscura de un color hex, para crear degradados
// automáticos aunque el producto solo tenga un color base.
export function oscurecer(hex, cantidad = 0.18) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, ((num >> 16) & 255) * (1 - cantidad))
  const g = Math.max(0, ((num >> 8) & 255) * (1 - cantidad))
  const b = Math.max(0, (num & 255) * (1 - cantidad))
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`
}