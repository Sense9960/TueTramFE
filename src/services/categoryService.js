import apiClient from './apiClient'

// Domain: danh mục sản phẩm (tag "Categories" trong api-docs). Không dùng
// mock data như productService/blogService vì trang Admin cần thao tác trực
// tiếp trên dữ liệu thật để CRUD (tạo/sửa/xoá danh mục ảnh hưởng ngay tới DB).
export async function getCategories(params = {}) {
  const { data } = await apiClient.get('/categories', { params })
  return data
}

export async function getCategory(id) {
  const { data } = await apiClient.get(`/categories/${id}`)
  return data
}

export async function createCategory(payload) {
  // payload: { name, description?, image? }
  const { data } = await apiClient.post('/categories', payload)
  return data
}

export async function updateCategory(id, payload) {
  const { data } = await apiClient.put(`/categories/${id}`, payload)
  return data
}

export async function deleteCategory(id) {
  const { data } = await apiClient.delete(`/categories/${id}`)
  return data
}
