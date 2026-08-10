export function formatearNumeroTarjeta(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 16)
  return digitos.replace(/(.{4})/g, '$1 ').trim()
}

export function formatearVencimiento(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4)
  if (digitos.length <= 2) return digitos
  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
}

export function validarTarjeta({ numero, nombre, vencimiento, cvv }) {
  const digitosNumero = numero.replace(/\s/g, '')
  if (digitosNumero.length !== 16) return 'El número de tarjeta debe tener 16 dígitos'
  if (!nombre.trim()) return 'Falta el nombre del titular'

  const match = vencimiento.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return 'Fecha de vencimiento inválida (usa MM/AA)'
  const mes = Number(match[1])
  if (mes < 1 || mes > 12) return 'El mes de vencimiento no es válido'

  if (!/^\d{3,4}$/.test(cvv)) return 'El CVV debe tener 3 o 4 dígitos'

  return null
}