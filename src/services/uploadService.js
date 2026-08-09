import apiClient from './apiClient'

// POST /api/upload/image (Admin, multipart/form-data) — đẩy ảnh lên
// Cloudinary phía backend, trả về `data.url` (hoặc tương đương) để gắn vào
// Product.images / Blog.thumbnail. Dùng chung cho mọi màn Admin cần upload ảnh.
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
