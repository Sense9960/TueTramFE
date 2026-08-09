import { Link } from 'react-router-dom'
import { InputNumber, Tabs } from 'antd'
import { formatPrice } from '../../utils/format'
import { colors, fontFamily } from '../../constants/theme'
import { SHOP_MODE } from '../../components/layout/Header'

// Bố cục CHI TIẾT SẢN PHẨM BẢN MOBILE — dựng theo nhánh `isProduct` trong file
// mockup "Tue Tram Mobile - Standalone.html":
//   khung : padding 0 18px 24px; flex column; gap 14px
//   link  : "← Sản phẩm" 13px neutral-400
//   ảnh   : width 100%; aspect-ratio 1/1; bo 24px
//   tên   : font-heading 21px, line-height 1.3; dưới là danh mục 12px
//   giá   : 22px, weight 700, accent-300
//   mô tả : 13.5px, line-height 1.7, neutral-300
//   nút   : block, bo 999px, padding 14px, 15px
//
// LÝ DO PHẢI TÁCH RIÊNG (2026-08-07, chủ dự án phản ánh "tràn ra ngoài"):
// bản dùng chung với desktop bọc nội dung trong antd <Row gutter={[32,24]}>,
// mà `gutter` sinh margin âm -16px hai bên — vừa đúng bằng padding 16px của
// `.container` ở mobile, nên ảnh và chữ bị đẩy sát mép màn hình, trông như
// tràn ra ngoài. Ở đây không dùng Row/Col nữa, tự đặt padding 18px.
export default function ProductDetailMobile({ product, qty, onQtyChange, onAdd }) {
  const hasTabs = product.specs?.length > 0 || product.usageSteps?.length > 0

  return (
    <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Link
        to="/san-pham"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: colors.neutral500,
          textDecoration: 'none',
          fontSize: 13,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Sản phẩm
      </Link>

      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 24, display: 'block' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            borderRadius: 24,
            background: `linear-gradient(150deg, ${colors.neutral800}, ${colors.neutral700})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.neutral500,
            fontSize: 13,
          }}
        >
          Ảnh đang cập nhật
        </div>
      )}

      <div>
        <div
          style={{
            fontFamily: fontFamily.display,
            fontWeight: fontFamily.headingWeight,
            fontSize: 21,
            lineHeight: 1.3,
            color: colors.bgCreamAlt,
          }}
        >
          {product.name}
        </div>
        {/* Mockup có thêm "4.9 ★" nhưng backend chưa có điểm đánh giá thật
            (tag Reviews mới khai báo, chưa có endpoint) — không bịa số, chỉ
            hiện danh mục khi API trả về. */}
        {product.categoryName && (
          <div style={{ fontSize: 12, color: colors.neutral500, marginTop: 4 }}>{product.categoryName}</div>
        )}
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, color: colors.accentPeachLight }}>{formatPrice(product)}</div>

      {product.description && (
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: colors.neutralTan }}>{product.description}</p>
      )}

      {SHOP_MODE ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <InputNumber min={1} value={qty} onChange={onQtyChange} style={{ width: 78 }} />
          <button
            type="button"
            onClick={onAdd}
            style={{
              flex: 1,
              padding: 14,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: colors.brandOrange,
              color: '#fff',
            }}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      ) : (
        <Link
          to="/lien-he"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: 14,
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 999,
            background: colors.brandOrange,
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Liên hệ đặt hàng
        </Link>
      )}

      {hasTabs && (
        <Tabs
          size="small"
          items={[
            product.specs?.length > 0 && {
              key: 'specs',
              label: 'Thông số',
              children: (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <tbody>
                    {product.specs.map((s) => (
                      <tr key={`${s.label}-${s.value}`} style={{ borderBottom: `1px solid ${colors.neutral800}` }}>
                        <td style={{ padding: '9px 10px 9px 0', color: colors.neutral500, width: '42%' }}>{s.label}</td>
                        <td style={{ padding: '9px 0', color: colors.bgCreamAlt }}>{s.value}</td>
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
                <ol style={{ margin: 0, paddingLeft: 18, color: colors.neutralTan, fontSize: 13, lineHeight: 1.8 }}>
                  {product.usageSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ),
            },
          ].filter(Boolean)}
        />
      )}

      <div style={{ fontSize: 12, color: colors.neutral500, lineHeight: 1.7 }}>
        Giao từ Đà Lạt trong 2–4 ngày · Hotline {import.meta.env.VITE_STORE_HOTLINE}
      </div>
    </div>
  )
}
