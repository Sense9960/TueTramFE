export function formatVnd(amount) {
  return Number(amount || 0).toLocaleString('vi-VN') + '₫'
}

/**
 * Chuỗi giá hiển thị cho khách.
 *
 * Swagger cập nhật 2026-08-07 thêm `priceOnRequest`: sản phẩm bán theo yêu
 * cầu thì `price` được phép bỏ trống, FE phải hiện chữ "Liên hệ" chứ KHÔNG
 * hiện 0₫ (dễ hiểu nhầm là cho không). Dùng hàm này ở mọi chỗ in giá để
 * các trang không xử lý mỗi nơi một kiểu.
 */
export function formatPrice(product) {
  if (!product) return 'Liên hệ'
  if (product.priceOnRequest || product.price == null) return 'Liên hệ'
  return formatVnd(product.price)
}
