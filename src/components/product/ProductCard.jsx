import { Link } from 'react-router-dom'
import { Card } from 'antd'
import { formatPrice } from '../../utils/format'
import { colors } from '../../constants/theme'

// Ảnh sản phẩm lấy từ API thật (`product.images[0]`, đã chuẩn hoá thành
// `product.image` trong productService). Không còn ảnh mock dự phòng — sản
// phẩm chưa có ảnh thì hiện ô "Ảnh đang cập nhật" đúng như mockup, để chủ
// shop biết mà lên Admin bổ sung ảnh.
export default function ProductCard({ product }) {
  return (
    <Link to={`/san-pham/${product.sku}`}>
      <Card
        hoverable
        cover={
          <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: colors.neutralTanPale }}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.neutral600,
                  fontSize: 12,
                }}
              >
                Ảnh đang cập nhật
              </div>
            )}
          </div>
        }
        styles={{ body: { padding: 12 } }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, color: colors.bgCreamAlt, minHeight: 40 }}>
          {product.name}
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ color: colors.accentPeachLight, fontWeight: 600 }}>{formatPrice(product)}</span>
        </div>
      </Card>
    </Link>
  )
}
