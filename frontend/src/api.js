import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' })

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})
// Expired / invalid token -> force re-login
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 && localStorage.getItem('token') && !err.config.url.includes('/auth/')) {
    localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'
  }
  return Promise.reject(err)
})
export const errMsg = e => e.response?.data?.message || 'Something went wrong. Please try again.'
export const money = n => '₹' + Number(n).toLocaleString('en-IN')
export default api
