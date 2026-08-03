import api from './axios'

export async function crearCapsula(payload) {
  const { data } = await api.post('/capsulas', payload)
  return data
}

export async function misCapsulas() {
  const { data } = await api.get('/capsulas')
  return data
}

export async function getCapsula(id) {
  const { data } = await api.get(`/capsulas/${id}`)
  return data
}

export async function getParticipantes(id) {
  const { data } = await api.get(`/capsulas/${id}/participantes`)
  return data
}

export async function invitarParticipante(id, email) {
  const { data } = await api.post(`/capsulas/${id}/participantes`, { email })
  return data
}

export async function getRecuerdos(id) {
  const { data } = await api.get(`/capsulas/${id}/recuerdos`)
  return data
}

export async function agregarRecuerdo(id, payload) {
  const { data } = await api.post(`/capsulas/${id}/recuerdos`, payload)
  return data
}
