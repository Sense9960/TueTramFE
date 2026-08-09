import apiClient from './apiClient'
import { pickList } from '../utils/pickList'

// ĐÃ BỎ HOÀN TOÀN MOCK DATA (2026-08-06, theo yêu cầu chủ dự án).
// Path thật là /api/blog (KHÔNG phải /posts như bản mock cũ gọi nhầm).
// Response verify bằng curl: data: { items, total, page, limit, totalPages }.
// Database backend hiện đang RỖNG nên trang Bài viết sẽ trống cho tới khi
// chủ shop đăng bài qua /admin/bai-viet.
//
// CẬP NHẬT SWAGGER 2026-08-07 (đường dẫn KHÔNG đổi, chỉ đổi schema):
//   BlogPostInput tách rõ 2 loại ảnh —
//     - `thumbnail`: ảnh nền/hero hiện NGOÀI đầu bài (thẻ ở trang danh sách).
//     - `images`: MẢNG ảnh chèn BÊN TRONG nội dung bài viết.
//   Trước đây FE chỉ gửi `thumbnail`.

/** Chuẩn hoá 1 bài viết về đúng field UI đang dùng. */
function normalizePost(p) {
  if (!p) return null
  return {
    ...p,
    // UI dùng `slug` trong URL; API cho phép tra theo id HOẶC slug.
    slug: p.slug || p._id || p.id,
    excerpt: p.excerpt || p.description || '',
    cover: p.thumbnail || null,
    // Ảnh chèn trong nội dung — luôn là mảng để UI khỏi kiểm tra null.
    images: Array.isArray(p.images) ? p.images : [],
  }
}

export async function getPosts(params = {}) {
  const { data } = await apiClient.get('/blog', { params })
  return pickList(data?.data, ['items', 'posts']).map(normalizePost)
}

export async function getPostBySlug(slug) {
  const { data } = await apiClient.get(`/blog/${slug}`)
  const raw = data?.data?.post || data?.data
  return normalizePost(raw)
}

// --- Admin (CRUD bài viết, tag "Blog" trong api-docs) ---

export async function adminListPosts(params = {}) {
  // params: { status?, page?, limit? }
  const { data } = await apiClient.get('/blog', { params })
  return data
}

export async function createPost(payload) {
  // BlogPostInput: { title, content BẮT BUỘC; excerpt?, thumbnail?,
  // images? (ảnh trong nội dung), status? ('Draft' | 'Published') }
  const { data } = await apiClient.post('/blog', payload)
  return data
}

export async function updatePost(id, payload) {
  // Cùng schema BlogPostInput với createPost.
  const { data } = await apiClient.put(`/blog/${id}`, payload)
  return data
}

export async function deletePost(id) {
  const { data } = await apiClient.delete(`/blog/${id}`)
  return data
}
