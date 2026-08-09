import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/format'
import { colors, fontFamily } from '../../constants/theme'
import { SHOP_MODE } from '../../components/layout/Header'

// Bố cục TRANG SẢN PHẨM BẢN MOBILE — dựng theo nhánh `isCatalog` trong file
// mockup "Tue Tram Mobile - Standalone.html" (chủ dự án gửi 2026-08-07):
//   khung  : padding 0 18px 24px; flex column; gap 14px
//   tiêu đề: font-heading 24px (mockup KHÔNG có dòng eyebrow "Sản phẩm" phía
//            trên — bản cũ dùng SectionTitle nên bị lặp chữ "Sản phẩm" 2 lần)
//   danh mục: hàng nút bo tròn cuộn ngang (không dùng antd Tabs — Tabs có
//            gạch chân + padding riêng, nhìn lệch so với mockup)
//   lưới   : grid 1fr 1fr, gap 14px; thẻ ảnh aspect 1/1.05 bo 16px,
//            tên 13px, giá 13.5px accent-300, nút thêm giỏ 44x44 bo 14px
//
// Dùng chung state/props với bản desktop (ProductList.jsx) — component này chỉ
// lo phần hiển thị, không tự gọi API.
export default function ProductListMobile({ products = [], categories = [], activeCat, onPickCat }) {
  const navigate = useNavigate()
  const { addItem } = useCart()

  const pills = [{ id: 'all', title: 'Tất cả' }, ...categories]

  const handleAdd = (e, product) => {
    e.stopPropagation()
    addItem(product, 1)
    message.success('Đã thêm vào giỏ hàng')
  }

  // Mockup dựng sẵn 6 sản phẩm nên lưới 2 cột lúc nào cũng cân. Thực tế shop
  // mới có 1 sản phẩm thì ô đó nằm lọt nửa trái, nhìn rất lệch — nên khi chỉ
  // có 1 sản phẩm ta cho nó chiếm trọn bề ngang cho cân đối.
  const columns = products.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))'

  return (
    <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: fontFamily.display, fontWeight: fontFamily.headingWeight, fontSize: 24 }}>
        Sản phẩm
      </div>

      <div className="tt-hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {pills.map((c) => {
          const active = activeCat === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPickCat(c.id)}
              style={{
                flex: 'none',
                cursor: 'pointer',
                fontFamily: fontFamily.display,
                fontWeight: 500,
                fontSize: 12.5,
                borderRadius: 999,
                padding: '9px 16px',
                border: `1px solid ${active ? colors.accentPeach : colors.neutral700}`,
                background: active ? colors.accentPeach : 'transparent',
                color: active ? colors.textDark2 : colors.neutralTanLight,
              }}
            >
              {c.title}
            </button>
          )
        })}
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: colors.neutral500 }}>
          Chưa có sản phẩm trong danh mục này.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 14 }}>
          {products.map((p) => (
            <div
              key={p.sku}
              onClick={() => navigate(`/san-pham/${p.sku}`)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  style={{ width: '100%', aspectRatio: '1 / 1.05', objectFit: 'cover', borderRadius: 16 }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1.05',
                    borderRadius: 16,
                    background: `linear-gradient(150deg, ${colors.neutralTanLight}, ${colors.neutralTan})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.neutral700,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
              )}
              <div style={{ fontSize: 13, lineHeight: 1.4, color: colors.bgCreamAlt }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: colors.accentPeachLight }}>
                  {formatPrice(p)}
                </span>
                {SHOP_MODE ? (
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, p)}
                    aria-label={`Thêm ${p.name} vào giỏ`}
                    style={{
                      flex: 'none',
                      width: 44,
                      height: 44,
                      border: 'none',
                      borderRadius: 14,
                      background: colors.neutral800,
                      color: colors.accentPeachLight,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to="/lien-he"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      flex: 'none',
                      fontSize: 11,
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: `1px solid ${colors.neutral700}`,
                      color: colors.neutralTanLight,
                      textDecoration: 'none',
                    }}
                  >
                    Liên hệ
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
