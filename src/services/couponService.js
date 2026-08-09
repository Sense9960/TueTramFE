import apiClient from './apiClient'

// Bọc toàn bộ endpoint tag "Coupons" trong tue-tram.vercel.app/api-docs
// (kiểm tra lại spec ngày 2026-08-06 — các path này CÓ THẬT trên backend,
// khác với ghi chú cũ trong CLAUDE.md nói mới chỉ khai báo tag).
// Mọi response theo dạng { status, message, data }; caller tự đọc `.data`.

/** GET /coupons — danh sách mã giảm giá (Admin). params: { status, page, limit } */
export async function listCoupons(params = {}) {
  const { data } = await apiClient.get('/coupons', { params })
  return data
}

/** GET /coupons/{id} — chi tiết mã giảm giá (Admin) */
export async function getCoupon(id) {
  const { data } = await apiClient.get(`/coupons/${id}`)
  return data
}

/**
 * POST /coupons — tạo mã giảm giá (Admin).
 * payload theo schema CouponInput:
 *   { code*, description, discountType* ('percent'|'fixed'), discountValue*,
 *     maxDiscount, minOrderValue, usageLimit, startDate, endDate }
 */
export async function createCoupon(payload) {
  const { data } = await apiClient.post('/coupons', payload)
  return data
}

/** PUT /coupons/{id} — cập nhật mã giảm giá (Admin) */
export async function updateCoupon(id, payload) {
  const { data } = await apiClient.put(`/coupons/${id}`, payload)
  return data
}

/** DELETE /coupons/{id} — xoá mã giảm giá (Admin) */
export async function deleteCoupon(id) {
  const { data } = await apiClient.delete(`/coupons/${id}`)
  return data
}

/** POST /coupons/apply — user áp thử mã cho 1 giá trị đơn (chưa trừ lượt dùng) */
export async function applyCoupon(payload) {
  const { data } = await apiClient.post('/coupons/apply', payload)
  return data
}
