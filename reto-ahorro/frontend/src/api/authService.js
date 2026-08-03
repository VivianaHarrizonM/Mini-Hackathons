import axiosClient from './axiosClient.js'

export const authService = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  me: () => axiosClient.get('/users/me'),
}
