import apiClient from './apiClient'

// Domain: quản lý người dùng — chỉ Admin gọi được (tag "Users" trong
// api-docs), dùng ở src/pages/Admin/Users.
// Lưu ý: path thật là /api/admin/users (đã đổi tên từ /api/users cũ, verify
// lại bằng curl https://tue-tram.vercel.app/api-docs.json ngày 2026-08-05).
export async function listUsers(params = {}) {
  // params: { role?, status?, search?, page?, limit? }
  const { data } = await apiClient.get('/admin/users', { params })
  return data
}

export async function getUser(id) {
  const { data } = await apiClient.get(`/admin/users/${id}`)
  return data
}

export async function createUser(payload) {
  // payload: { username, email, password, fullName, phone?, address?, role? }
  const { data } = await apiClient.post('/admin/users', payload)
  return data
}

export async function updateUser(id, payload) {
  // payload: { fullName?, phone?, avatar?, address?, dateOfBirth?, gender?, role?, password? }
  const { data } = await apiClient.put(`/admin/users/${id}`, payload)
  return data
}

export async function updateUserStatus(id, status) {
  // status: 'Active' | 'Inactive' | 'Banned'
  const { data } = await apiClient.patch(`/admin/users/${id}/status`, { status })
  return data
}

export async function deleteUser(id) {
  const { data } = await apiClient.delete(`/admin/users/${id}`)
  return data
}
