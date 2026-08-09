// Nhiều endpoint GET danh sách (products, users, categories, blog...) trả về
// { status, message, data } nhưng chưa có tài liệu chi tiết field nào trong
// `data` chứa mảng (items/products/users/results...) và field nào chứa tổng
// số bản ghi để phân trang. Hai hàm dưới đây thử các field phổ biến trước,
// fallback hợp lý nếu không khớp — để mỗi trang Admin không phải tự đoán lại.
export function pickList(data, keys = ['items', 'results']) {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key]
  }
  const arrField = Object.values(data).find((v) => Array.isArray(v))
  return arrField || []
}

export function pickTotal(data, fallbackLength) {
  if (data && typeof data === 'object') {
    if (typeof data.total === 'number') return data.total
    if (typeof data.totalItems === 'number') return data.totalItems
    if (typeof data.count === 'number') return data.count
  }
  return fallbackLength
}
