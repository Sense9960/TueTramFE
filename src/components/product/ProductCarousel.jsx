import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/format'
import { colors, fontFamily } from '../../constants/theme'
import { SHOP_MODE } from '../layout/Header'

// Khối "Sản phẩm" ở trang chủ — dựng lại 1:1 theo <section id="sp-grid">
// trong file mockup gốc "Tue Tram - Standalone.html" (đọc trực tiếp markup +
// CSS ngày 2026-08-06, KHÔNG suy đoán). Đây KHÔNG phải lưới Row/Col như bản
// cũ mà là carousel cuộn ngang:
//   section : max-width 1240; padding var(--space-6) 5vw 80px
//   header  : flex; align-items baseline; gap var(--space-3); flex-wrap wrap
//             h2 34px neutral-100 + span 13px neutral-500 + 2 nút tròn 42px
//             (prev: viền neutral-600 nền trong suốt / next: nền accent-500)
//   pills   : flex gap var(--space-2) wrap; pill radius 999px, padding 9px 18px,
//             font-heading 13.5px; active = nền+viền accent-500, chữ neutral-900
//   scroller: flex; gap var(--space-4); overflow-x auto; scroll-snap x proximity
//   card    : flex-none; width min(480px,86vw); flex-direction ROW; padding
//             var(--space-2); gap var(--space-3); nền --color-surface; radius
//             --radius-md=16px; ảnh 150px bo --radius-lg=28px
// (--space-2=8.8 / --space-3=13.2 / --space-4=17.6 / --space-6=26.4)
const NAV_BTN_BASE = {
  width: 42,
  height: 42,
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
}

// `categories` lấy từ API thật (GET /categories) do trang cha truyền xuống —
// KHÔNG còn dùng mock data (bỏ ngày 2026-08-06 theo yêu cầu chủ dự án).
export default function ProductCarousel({ products = [], categories = [] }) {
  const [cat, setCat] = useState('all')
  const scrollerRef = useRef(null)
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Pill "Tất cả" luôn đứng đầu, sau đó là danh mục thật từ backend.
  const pills = [{ id: 'all', title: 'Tất cả' }, ...categories]
  const visible = products.filter((p) => cat === 'all' || p.category === cat)
  const catLabel = (p) => p.categoryName || categories.find((c) => c.id === p.category)?.title || ''

  // Mockup cuộn theo chiều rộng 1 thẻ; dùng chính bề rộng thẻ đầu tiên để
  // số pixel cuộn luôn khớp với kích thước thẻ đang render (responsive).
  const slide = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.firstElementChild
    const step = card ? card.offsetWidth + 17.6 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const handleAdd = (e, product) => {
    e.stopPropagation()
    addItem(product, 1)
    message.success('Đã thêm vào giỏ hàng')
  }

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '26.4px 5vw 80px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 13.2,
          flexWrap: 'wrap',
          marginBottom: 17.6,
        }}
      >
        <h2
          style={{
            fontFamily: fontFamily.display,
            fontWeight: fontFamily.headingWeight,
            color: colors.bgCreamAlt,
            fontSize: 34,
            margin: 0,
          }}
        >
          Sản phẩm
        </h2>
        <span style={{ color: colors.neutral500, fontSize: 13 }}>
          Thỉnh trầm là góp một phần cho phòng thuốc từ thiện
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8.8 }}>
          <button
            type="button"
            onClick={() => slide(-1)}
            title="Xem trước"
            aria-label="Xem trước"
            style={{
              ...NAV_BTN_BASE,
              border: `1px solid ${colors.neutral600}`,
              background: 'transparent',
              color: colors.neutral200,
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            title="Xem tiếp"
            aria-label="Xem tiếp"
            style={{
              ...NAV_BTN_BASE,
              border: 'none',
              background: colors.brandOrangeLight,
              color: colors.textDark2,
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8.8, flexWrap: 'wrap', marginBottom: 26.4 }}>
        {pills.map((c) => {
          const active = cat === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              style={{
                cursor: 'pointer',
                fontFamily: fontFamily.display,
                fontWeight: fontFamily.headingWeight,
                fontSize: 13.5,
                borderRadius: 999,
                padding: '9px 18px',
                border: `1px solid ${active ? colors.brandOrangeLight : colors.neutral600}`,
                background: active ? colors.brandOrangeLight : 'transparent',
                color: active ? colors.textDark2 : colors.neutralTanLight,
              }}
            >
              {c.title}
            </button>
          )
        })}
      </div>

      <div
        ref={scrollerRef}
        className="tt-hide-scrollbar"
        style={{
          display: 'flex',
          gap: 17.6,
          overflowX: 'auto',
          scrollSnapType: 'x proximity',
          padding: '4px 4px 13.2px',
        }}
      >
        {visible.map((p) => (
          <article
            key={p.sku}
            onClick={() => navigate(`/san-pham/${p.sku}`)}
            style={{
              cursor: 'pointer',
              flex: 'none',
              width: 'min(480px, 86vw)',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              padding: 8.8,
              gap: 13.2,
              boxSizing: 'border-box',
              background: colors.neutralTanPale, // --color-surface
              borderRadius: 16,
              boxShadow: '0 3px 10px rgba(46, 43, 37, 0.16)',
            }}
          >
            {p.image ? (
              // Sửa 2026-08-07 (chủ dự án: "ảnh chưa fit với card"): trước đây
              // dùng `object-fit: cover` nên ảnh sản phẩm nằm ngang (ảnh chụp
              // hộp/bao bì) bị cắt cụt hai bên — mất luôn chữ trên bao bì.
              // Nay bọc ảnh trong một ô cố định 150px và dùng `contain` để
              // thấy TRỌN sản phẩm, phần dôi ra lấp bằng nền kem nhạt cho liền
              // mạch với thẻ. Mockup vẽ sẵn ảnh vuông nên không gặp cảnh này.
              <div
                style={{
                  width: 150,
                  minHeight: 150,
                  alignSelf: 'stretch',
                  flex: 'none',
                  borderRadius: 28,
                  overflow: 'hidden',
                  background: colors.neutralTanLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 6,
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 22,
                  }}
                />
              </div>
            ) : (
              // Mockup: sản phẩm chưa có ảnh dùng ô gradient + icon khói trầm
              <div
                style={{
                  width: 150,
                  minHeight: 150,
                  alignSelf: 'stretch',
                  borderRadius: 28,
                  flex: 'none',
                  background: `linear-gradient(150deg, ${colors.neutralTanLight}, ${colors.neutralTan})`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  color: colors.neutral700,
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                <span style={{ fontSize: 10, letterSpacing: '0.05em', textAlign: 'center', padding: '0 8px' }}>
                  Ảnh đang cập nhật
                </span>
              </div>
            )}

            <div
              style={{
                padding: '4.4px 8.8px 4.4px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                flex: 1,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: colors.accent2_100,
                  color: colors.accent2_800,
                }}
              >
                {catLabel(p)}
              </span>
              <h3
                style={{
                  fontFamily: fontFamily.display,
                  fontWeight: fontFamily.headingWeight,
                  fontSize: 16.5,
                  margin: 0,
                  color: colors.textDark2,
                }}
              >
                {p.name}
              </h3>
              {/* Cắt mô tả còn tối đa 5 dòng: mockup viết mô tả rất ngắn, còn
                  mô tả thật chủ shop nhập có thể dài cả đoạn — để nguyên thì
                  thẻ cao vống lên, kéo ô ảnh giãn theo và thừa nền. Muốn đọc
                  đủ thì bấm vào xem trang chi tiết. */}
              <p
                style={{
                  fontSize: 12.5,
                  color: colors.neutral700,
                  margin: 0,
                  flex: 1,
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 5,
                  overflow: 'hidden',
                }}
              >
                {p.short || p.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: colors.brandOrangeDark }}>
                  {formatPrice(p)}
                </span>
                {/* Nút thêm vào giỏ chỉ hiện khi bật bán hàng online
                    (SHOP_MODE trong Header.jsx) — hiện là landing page. */}
                {SHOP_MODE && (
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, p)}
                    title="Thêm vào giỏ"
                    aria-label={`Thêm ${p.name} vào giỏ`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      background: colors.brandOrange,
                      color: colors.bgCreamAlt,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
