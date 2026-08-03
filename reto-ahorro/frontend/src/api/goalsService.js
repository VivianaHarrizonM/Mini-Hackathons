import axiosClient from './axiosClient.js'

export const goalsService = {
  getAll: () => axiosClient.get('/goals'),
  getById: (id) => axiosClient.get(`/goals/${id}`),
  create: (data) => axiosClient.post('/goals', data),
  getContributions: (id) => axiosClient.get(`/goals/${id}/contributions`),
  addContribution: (id, data) => axiosClient.post(`/goals/${id}/contributions`, data),
  getParticipants: (id) => axiosClient.get(`/goals/${id}/participants`),
  addParticipant: (id, data) => axiosClient.post(`/goals/${id}/participants`, data),
}