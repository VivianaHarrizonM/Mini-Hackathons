import { request } from './apiClient'

export const DOCUMENTOS_LEGALES = {
  terminos: { titulo: 'Términos y condiciones' },
  privacidad: { titulo: 'Aviso de privacidad' },
  devoluciones: { titulo: 'Política de devoluciones' },
}

export function getDocumentoLegal(tipo) {
  return request(`/api/legal/${tipo}`)
}
