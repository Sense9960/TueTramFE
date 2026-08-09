import apiClient from './apiClient'
import { pickList } from '../utils/pickList'

// ĐÃ BỎ HOÀN TOÀN MOCK DATA (2026-08-06, theo yêu cầu chủ dự án) — mọi hàm
// dưới đây gọi thẳng API thật. Các trang khách hàng nhận về MẢNG đã chuẩn
// hoá sẵn (không phải envelope { status, message, data }) để component không
// phải tự bóc tách.
//
// Hình dạng response thật đã verify bằng curl ngày 2026-08-06:
//   GET /api/categories -> data: []                (mảng thẳng)
//   GET /api/products   -> data: { items, total, page, limit, totalPages }
//
// LƯU Ý: hiện database backend đang RỖNG (0 danh mục, 0 sản phẩm) nên trang
// Sản phẩm sẽ trống cho tới khi chủ shop nhập liệu qua khu vực /admin.
//
// CẬP NHẬT SWAGGER 2026-08-07 (chủ dự án sửa lại schema, đường dẫn KHÔNG đổi):
//   ProductInput / ProductUpdateInput có thêm 3 field:
//     - priceOnRequest (bool): true = "bán theo yêu cầu", FE hiển thị chữ
//       "Liên hệ" thay cho giá; khi đó `price` được phép bỏ trống.
//     - specs: [{ label, value }] -> tab "Thông số" ở trang chi tiết.
//     - usageSteps: [string] (theo thứ tự) -> tab "Cách dùng".
//   GET /products có thêm tham số lọc `minRating` (0-5).

/** Chuẩn hoá 1 sản phẩm từ API về đúng field mà UI đang dùng. */
function normalizeProduct(p) {
  if (!p) return null
  return {
    ...p,
    // UI dùng `sku` làm khoá định danh trong URL/giỏ hàng; API dùng `_id`.
    sku: p._id || p.id,
    // Danh mục có thể là object populate hoặc chỉ là id.
    category: typeof p.category === 'object' ? p.category?._id : p.category,
    categoryName: typeof p.category === 'object' ? p.category?.name : undefined,
    image: p.images?.[0] || null,
    short: p.shortDescription || p.excerpt || p.description,
    // Swagger cập nhật 2026-08-07 (xem đầu file): 3 field mới dưới đây.
    // Ép về kiểu chuẩn để UI khỏi phải kiểm tra null/undefined ở mọi chỗ.
    priceOnRequest: Boolean(p.priceOnRequest),
    specs: Array.isArray(p.specs) ? p.specs : [],
    usageSteps: Array.isArray(p.usageSteps) ? p.usageSteps : [],
  }
}

export async function getCategories() {
  const { data } = await apiClient.get('/categories')
  return pickList(data?.data, ['categories', 'items']).map((c) => ({
    ...c,
    id: c._id || c.id,
    title: c.name,
  }))
}

export async function getProducts(params = {}) {
  const { data } = await apiClient.get('/products', { params })
  return sortForDisplay(pickList(data?.data, ['items', 'products']).map(normalizeProduct))
}

/**
 * Thứ tự hiển thị cho khách (yêu cầu chủ dự án 2026-08-07):
 * **sản phẩm có giá niêm yết đứng trước, sản phẩm "Liên hệ" xếp sau cùng.**
 * Trong mỗi nhóm giữ nguyên thứ tự backend trả về (sort ổn định của JS), nên
 * chủ shop vẫn điều chỉnh được bằng cách thêm/sửa sản phẩm bên Admin.
 *
 * Lưu ý: backend CHƯA có field thứ tự (displayOrder/position) trong
 * ProductInput, nên KHÔNG thể ghim cứng "sản phẩm A luôn đứng thứ 3". Vị trí
 * cụ thể phụ thuộc số sản phẩm có giá. Muốn ghim cố định thì phải nhờ backend
 * bổ sung field sắp xếp rồi sort theo field đó ở đây.
 */
function sortForDisplay(list) {
  return [...list].sort((a, b) => Number(a.priceOnRequest) - Number(b.priceOnRequest))
}

/** Chi tiết sản phẩm — `sku` ở FE chính là `_id` của backend. */
export async function getProductBySku(sku) {
  const { data } = await apiClient.get(`/products/${sku}`)
  const raw = data?.data?.product || data?.data
  return normalizeProduct(raw)
}

// --- Admin (CRUD sản phẩm thật, tag "Products" trong api-docs) ---
// Luôn gọi API thật (không qua USE_MOCK) vì trang Admin cần thao tác trực
// tiếp trên dữ liệu thật.

export async function adminListProducts(params = {}) {
  // params: { category?, status?, isFeatured?, isNew?, search?, minRating?,
  // minPrice?, maxPrice?, sort?, page?, limit? }
  const { data } = await apiClient.get('/products', { params })
  return data
}

export async function createProduct(payload) {
  // ProductInput: { name, category BẮT BUỘC; price bắt buộc TRỪ KHI
  // priceOnRequest=true; description?, stock?, images?, priceOnRequest?,
  // specs? [{label,value}], usageSteps? [string] }
  const { data } = await apiClient.post('/products', cleanProductPayload(payload))
  return data
}

export async function updateProduct(id, payload) {
  // ProductUpdateInput: { name?, description?, price?, priceOnRequest?,
  // category?, status?, specs?, usageSteps? }
  const { data } = await apiClient.put(`/products/${id}`, cleanProductPayload(payload))
  return data
}

/**
 * Dọn payload trước khi gửi lên API:
 *  - priceOnRequest=true -> KHÔNG gửi `price` (schema cho phép bỏ trống, gửi
 *    kèm giá cũ dễ gây hiểu nhầm là vẫn còn niêm yết).
 *  - Bỏ dòng thông số trống và bước dùng trống do form để lại.
 */
function cleanProductPayload(payload = {}) {
  const out = { ...payload }
  if (out.priceOnRequest) delete out.price
  if (Array.isArray(out.specs)) {
    out.specs = out.specs.filter((s) => s && (s.label?.trim() || s.value?.trim()))
  }
  if (Array.isArray(out.usageSteps)) {
    out.usageSteps = out.usageSteps.filter((s) => s && s.trim())
  }
  return out
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`)
  return data
}

export async function updateProductStock(id, stock) {
  const { data } = await apiClient.patch(`/products/${id}/stock`, { stock })
  return data
}

export async function updateProductFlags(id, flags) {
  // flags: { isFeatured?, isNew? }
  const { data } = await apiClient.patch(`/products/${id}/flags`, flags)
  return data
}

export async function addProductImage(id, imageUrl) {
  const { data } = await apiClient.post(`/products/${id}/images`, { imageUrl })
  return data
}

export async function removeProductImage(id, imageUrl) {
  const { data } = await apiClient.delete(`/products/${id}/images`, { data: { imageUrl } })
  return data
}
