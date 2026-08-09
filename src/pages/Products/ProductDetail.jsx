import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Row, Col, Tabs, message, InputNumber } from 'antd'
import { getProductBySku } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/format'
import { colors, fontFamily } from '../../constants/theme'
import { SHOP_MODE } from '../../components/layout/Header'
import ProductDetailMobile from './ProductDetailMobile'
import useIsMobile from '../../hooks/useIsMobile'

export default function ProductDetail() {
  const { sku } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const isMobile = useIsMobile()

  // `sku` trên URL chính là `_id` sản phẩm bên backend (xem productService).
  useEffect(() => {
    getProductBySku(sku)
      .then(setProduct)
      .catch(() => setProduct(null))
  }, [sku])

  if (!product) return null

  const handleAdd = () => {
    addItem(product, qty)
    message.success('Đã thêm vào giỏ hàng')
  }

  // Mobile có bố cục riêng theo mockup mobile (nhánh `isProduct`) — dùng chung
  // dữ liệu/state đã tải ở trên, chỉ khác cách hiển thị. Xem ghi chú đầu file
  // ProductDetailMobile.jsx về lý do KHÔNG dùng lại Row/Col ở mobile.
  if (isMobile) {
    return (
      <ProductDetailMobile
        product={product}
        qty={qty}
        onQtyChange={(v) => setQty(v || 1)}
        onAdd={handleAdd}
      />
    )
  }

  return (
    <div className="container" style={{ padding: '24px 0 48px' }}>
      <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
        <Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link>
      </div>
      <Row gutter={[32, 24]}>
        <Col xs={24} md={12}>
          {/* Ảnh lấy từ API thật (product.images[0]); chưa có ảnh thì hiện ô
              "Ảnh đang cập nhật" — không mượn ảnh sản phẩm khác. */}
          <div
            style={{
              aspectRatio: '1 / 1',
              borderRadius: 16,
              overflow: 'hidden',
              background: colors.neutralTanPale,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.neutral600,
              fontSize: 13,
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              'Ảnh đang cập nhật'
            )}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <h1
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: 26,
              margin: 0,
              color: colors.bgCreamAlt,
            }}
          >
            {product.name}
          </h1>
          {/* Đã bỏ dòng "Mã sản phẩm: <_id>" (2026-08-07, chủ dự án yêu cầu):
              đó là _id MongoDB dài loằng ngoằng, khách không dùng để làm gì. */}
          {/* priceOnRequest = bán theo yêu cầu -> hiện "Liên hệ" (formatPrice
              trong utils/format.js), không hiện 0₫. */}
          <div style={{ fontSize: 24, color: colors.accentPeachLight, fontWeight: 700, marginTop: 12 }}>
            {formatPrice(product)}
          </div>
          <p style={{ marginTop: 16, color: colors.neutralTan }}>{product.description}</p>

          {/* Đặt hàng online chỉ bật khi SHOP_MODE = true (xem Header.jsx).
              Hiện website là landing page nên thay bằng lời mời liên hệ. */}
          {SHOP_MODE ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
              <InputNumber min={1} value={qty} onChange={(v) => setQty(v || 1)} />
              <Button type="primary" size="large" onClick={handleAdd}>
                Thêm vào giỏ hàng
              </Button>
            </div>
          ) : (
            <div style={{ marginTop: 20 }}>
              <Link to="/lien-he">
                <Button type="primary" size="large">
                  Liên hệ đặt hàng
                </Button>
              </Link>
            </div>
          )}

          {/* Đã bỏ hộp "Lời thầy dặn" (2026-08-07, chủ dự án yêu cầu): chữ
              cứng nhét thêm ở mọi sản phẩm, làm trang rối. Nội dung riêng cho
              từng sản phẩm nay nhập ở tab "Cách dùng" (usageSteps) bên dưới. */}

          <div style={{ marginTop: 24, fontSize: 13, opacity: 0.7 }}>
            Giao từ Đà Lạt trong 2–4 ngày · Hotline {import.meta.env.VITE_STORE_HOTLINE}
          </div>
        </Col>
      </Row>

      {/* Tab "Thông số" (specs) + "Cách dùng" (usageSteps) — 2 field mới trong
          swagger 2026-08-07, nhập ở Admin > Sản phẩm. Sản phẩm chưa nhập thì
          không hiện tab nào để trang khỏi trống trơn. */}
      {(product.specs?.length > 0 || product.usageSteps?.length > 0) && (
        <div style={{ marginTop: 40 }}>
          <Tabs
            items={[
              product.specs?.length > 0 && {
                key: 'specs',
                label: 'Thông số',
                children: (
                  <table style={{ width: '100%', maxWidth: 560, borderCollapse: 'collapse', fontSize: 14 }}>
                    <tbody>
                      {product.specs.map((s) => (
                        <tr key={`${s.label}-${s.value}`} style={{ borderBottom: `1px solid ${colors.neutral800}` }}>
                          <td style={{ padding: '10px 12px 10px 0', color: colors.neutral500, width: 180 }}>
                            {s.label}
                          </td>
                          <td style={{ padding: '10px 0', color: colors.bgCreamAlt }}>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ),
              },
              product.usageSteps?.length > 0 && {
                key: 'usage',
                label: 'Cách dùng',
                children: (
                  <ol style={{ margin: 0, paddingLeft: 20, color: colors.neutralTan, fontSize: 14, lineHeight: 1.9 }}>
                    {product.usageSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ),
              },
            ].filter(Boolean)}
          />
        </div>
      )}
    </div>
  )
}
