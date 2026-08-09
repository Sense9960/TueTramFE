import apiClient from './apiClient'

// Bọc toàn bộ endpoint tag "Orders" trong tue-tram.vercel.app/api-docs
// (kiểm tra lại spec ngày 2026-08-06 — backend ĐÃ có các path này, khác với
// ghi chú cũ trong CLAUDE.md nói mới chỉ khai báo tag chứ chưa có path).
// Mọi response theo dạng { status, message, data }; caller tự đọc `.data`.

/**
 * POST /orders — đặt hàng. Cho phép cả khách chưa đăng nhập (guest); đơn quá
 * GUEST_MAX_ITEMS sản phẩm thì backend bắt buộc phải đăng nhập.
 */
export async function submitOrder(payload) {
  const { data } = await apiClient.post('/orders', payload)
  return data
}

/** GET /orders/my — lịch sử đơn hàng của tôi (User đã đăng nhập) */
export async function listMyOrders(params = {}) {
  const { data } = await apiClient.get('/orders/my', { params })
  return data
}

/** GET /orders/track — guest tra đơn bằng orderNumber + email */
export async function trackOrder(params) {
  const { data } = await apiClient.get('/orders/track', { params })
  return data
}

/** GET /orders/{id} — chi tiết đơn (chủ đơn hoặc Admin) */
export async function getOrder(id) {
  const { data } = await apiClient.get(`/orders/${id}`)
  return data
}

/** POST /orders/{id}/cancel-request — user xin huỷ đơn (khi pending/confirmed) */
export async function requestCancelOrder(id, payload) {
  const { data } = await apiClient.post(`/orders/${id}/cancel-request`, payload)
  return data
}

/** POST /orders/{id}/return-request — user xin đổi trả (khi đơn completed) */
export async function requestReturnOrder(id, payload) {
  const { data } = await apiClient.post(`/orders/${id}/return-request`, payload)
  return data
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

/**
 * GET /orders — danh sách TẤT CẢ đơn hàng (Admin).
 * params: { status: 'pending'|'confirmed'|'shipping'|'completed'|'cancelled',
 *           search, page, limit }
 */
export async function listOrders(params = {}) {
  const { data } = await apiClient.get('/orders', { params })
  return data
}

/**
 * PATCH /orders/{id}/status — Admin đổi trạng thái đơn.
 * Luồng hợp lệ theo api-docs: pending → confirmed → shipping → completed;
 * chỉ huỷ được khi đơn đang pending hoặc confirmed.
 * payload: { status, note? }
 */
export async function updateOrderStatus(id, status, note) {
  const { data } = await apiClient.patch(`/orders/${id}/status`, { status, ...(note ? { note } : {}) })
  return data
}

/**
 * PATCH /orders/{id}/resolve-request — Admin duyệt/từ chối yêu cầu huỷ/đổi trả
 * của khách (approve = hoàn kho lại).
 */
export async function resolveOrderRequest(id, payload) {
  const { data } = await apiClient.patch(`/orders/${id}/resolve-request`, payload)
  return data
}

// Các trạng thái đơn + nhãn tiếng Việt dùng chung cho màn Admin Đơn hàng và
// Dashboard. Giá trị (key) lấy đúng enum trong api-docs, KHÔNG tự đặt thêm.
export const ORDER_STATUS = {
  pending: { label: 'Chờ xử lý', tone: 'neutral' },
  confirmed: { label: 'Đã xác nhận', tone: 'neutral' },
  shipping: { label: 'Đang giao', tone: 'neutral' },
  completed: { label: 'Hoàn thành', tone: 'green' },
  cancelled: { label: 'Đã huỷ', tone: 'danger' },
}
