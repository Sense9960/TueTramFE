import apiClient from './apiClient'

// Wraps every endpoint under tag "Auth" in tue-tram.vercel.app/api-docs.
// All responses follow { status, message, data } (see ApiResponse schema);
// callers get that whole envelope back and read `.data` themselves so error
// messages (`.message`) stay available on the caller side too.

export async function register(payload) {
  // payload: { username, email, password, fullName, phone?, address? }
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}

export async function login(payload) {
  // payload: { emailOrUsername, password }
  const { data } = await apiClient.post('/auth/login', payload)
  return data
}

export async function getMe() {
  const { data } = await apiClient.get('/auth/me')
  return data
}

export async function updateProfile(payload) {
  const { data } = await apiClient.put('/auth/me', payload)
  return data
}

export async function changePassword(payload) {
  // payload: { oldPassword, newPassword }
  const { data } = await apiClient.post('/auth/change-password', payload)
  return data
}

export async function forgotPassword(payload) {
  // payload: { email }
  const { data } = await apiClient.post('/auth/forgot-password', payload)
  return data
}

export async function resetPassword(payload) {
  // payload: { token, newPassword }
  const { data } = await apiClient.post('/auth/reset-password', payload)
  return data
}

export async function logout() {
  const { data } = await apiClient.post('/auth/logout')
  return data
}
