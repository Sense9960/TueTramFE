import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../constants/auth'

// Single axios instance for all backend (Node.js/Express) calls.
// Base URL and key are read from .env (VITE_ prefixed vars only - see
// CLAUDE.md). Never hardcode secrets here.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey
  }
  // Auth: API dùng JWT Bearer (xem api-docs). Token được AuthContext lưu vào
  // localStorage sau khi login/register — gắn tự động ở đây để các
  // service khác (order, review,...) không phải tự thêm header.
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default apiClient
