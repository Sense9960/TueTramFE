import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/format'
import { colors, fontFamily } from '../../constants/theme'
import { SHOP_MODE } from '../../components/layout/Header'
import { founder } from '../../data/posts'
import heroImg from '../../assets/images/product-1.jpg'
import founderImg from '../../assets/images/founder-portrait.jpg'

// Bố cục TRANG CHỦ BẢN MOBILE — dựng theo file mockup riêng cho mobile
// "Tue Tram Mobile - Standalone.html" (chủ dự án gửi 2026-08-07, đọc trực
// tiếp markup + CSS, không suy đoán). Cấu trúc mobile KHÁC HẲN desktop:
//   - Hero là 1 thẻ ảnh cao 190px, bo 24px, có lớp phủ gradient và tiêu đề
//     nằm đè lên ảnh (desktop là lưới 2 cột chữ/ảnh).
//   - 3 ô "tin cậy" xếp lưới 3 cột, chữ 10px.
//   - Mỗi khối có hàng tiêu đề 20px + nút "TẤT CẢ" bo tròn bên phải.
//   - Sản phẩm/bài viết cuộn NGANG, thẻ hẹp (160px / 220px).
//   - Khối người sáng lập là thẻ nền neutral-800 bo 24px, ảnh tròn 64px.
//
// QUAN TRỌNG: đây KHÔNG phải app riêng cho mobile — component này nhận
// products/categories/posts do `pages/Home/index.jsx` (bản desktop) tải sẵn
// rồi truyền xuống, dùng chung service/route/theme với desktop. Chỉ phần
// hiển thị là khác.
const TRUST_ITEMS = [
  {
    label: (
      <>
        100% trầm
        <br />
        tự nhiên
      </>
    ),
    icon: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10ZM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  },
  {
    label: (
      <>
        Đốt sạch,
        <br />
        không hoá chất
      </>
    ),
    icon: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  },
  {
    label: (
      <>
        Gắn với
        <br />
        thiện nguyện
      </>
    ),
    icon: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  },
]

const HOTLINE = import.meta.env.VITE_STORE_HOTLINE || '0947.569.879'

// Hàng tiêu đề mỗi khối: chữ 20px + nút "Tất cả" bo tròn bên phải
function SectionRow({ title, to }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: fontFamily.display, fontWeight: fontFamily.headingWeight, fontSize: 20 }}>
        {title}
      </span>
      <Link
        to={to}
        style={{
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          background: 'transparent',
          border: `1px solid ${colors.neutral700}`,
          color: colors.neutralTanLight,
          borderRadius: 999,
          padding: '8px 14px',
          fontSize: 10.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Tất cả
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

function NoImageBox({ radius = 16, ratio = '1 / 1.05' }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: ratio,
        borderRadius: radius,
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
  )
}

export default function HomeMobile({ products = [], categories = [], posts = [] }) {
  const [cat, setCat] = useState('all')
  const navigate = useNavigate()
  const { addItem } = useCart()

  const pills = [{ id: 'all', title: 'Tất cả' }, ...categories]
  const visible = products.filter((p) => cat === 'all' || p.category === cat)

  const handleAdd = (e, product) => {
    e.stopPropagation()
    addItem(product, 1)
    message.success('Đã thêm vào giỏ hàng')
  }

  return (
    <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hero: ảnh 190px + lớp phủ gradient + tiêu đề đè lên */}
      <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
        <img
          src={heroImg}
          alt="Nhang trầm Tuệ Trầm"
          style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 20%, rgba(32,30,29,0.85))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <div
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: 21,
              lineHeight: 1.25,
              color: colors.bgCreamAlt,
            }}
          >
            Một nén trầm thơm,
            <br />
            một niệm an lành
          </div>
          <div style={{ fontSize: 12, color: colors.neutralTanLight, marginTop: 4 }}>
            Trầm hương tự nhiên Đà Lạt
          </div>
        </div>
      </div>

      {/* 3 ô tin cậy */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {TRUST_ITEMS.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 6,
              background: colors.neutral800,
              borderRadius: 14,
              padding: '10px 6px',
              fontSize: 10,
              lineHeight: 1.35,
              color: colors.neutralTanLight,
              textAlign: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.greenPale} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
            {t.label}
          </span>
        ))}
      </div>

      {/* Sản phẩm */}
      <SectionRow title="Sản phẩm" to="/san-pham" />

      <div className="tt-hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {pills.map((c) => {
          const active = cat === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
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

      <div className="tt-hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {visible.map((p) => (
          <div
            key={p.sku}
            onClick={() => navigate(`/san-pham/${p.sku}`)}
            style={{ flex: 'none', width: 160, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                style={{ width: '100%', aspectRatio: '1 / 1.05', objectFit: 'cover', borderRadius: 16 }}
              />
            ) : (
              <NoImageBox />
            )}
            <div style={{ fontSize: 13, lineHeight: 1.4, color: colors.bgCreamAlt }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: colors.accentPeachLight }}>
                {formatPrice(p)}
              </span>
              {SHOP_MODE && (
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
              )}
            </div>
          </div>
        ))}

        <Link
          to="/san-pham"
          style={{
            flex: 'none',
            width: 110,
            alignSelf: 'stretch',
            minHeight: 150,
            background: colors.neutral800,
            color: colors.neutralTanLight,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 12,
            textDecoration: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          Xem tất cả
        </Link>
      </div>

      {/* Bài viết */}
      <div style={{ marginTop: 6 }}>
        <SectionRow title="Bài viết" to="/bai-viet" />
      </div>

      <div className="tt-hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
        {posts.map((b) => (
          <Link
            key={b.slug}
            to={`/bai-viet/${b.slug}`}
            style={{ flex: 'none', width: 220, display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none' }}
          >
            {b.cover ? (
              <img
                src={b.cover}
                alt={b.title}
                loading="lazy"
                style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 16 }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: 130,
                  borderRadius: 16,
                  background: colors.neutral800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.neutralTan,
                  fontSize: 12,
                }}
              >
                Ảnh đang cập nhật
              </div>
            )}
            <div style={{ fontSize: 10.5, color: colors.neutral500 }}>
              <span style={{ fontWeight: 700, color: colors.neutralTanLight }}>
                {b.category?.name || b.category || 'Bài viết'}
              </span>{' '}
              | <span style={{ color: colors.accentPeach }}>{b.date || ''}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.4, color: colors.bgCreamAlt }}>{b.title}</div>
          </Link>
        ))}
      </div>

      {/* Người sáng lập */}
      <div
        style={{
          background: colors.neutral800,
          borderRadius: 24,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={founderImg}
            alt={founder.name}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 20%', flexShrink: 0 }}
          />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.accent2_300 }}>
              Người sáng lập
            </div>
            <div style={{ fontFamily: fontFamily.display, fontWeight: fontFamily.headingWeight, fontSize: 16, color: colors.bgCreamAlt }}>
              {founder.name}
            </div>
            <div style={{ fontSize: 11, color: colors.neutralTan, marginTop: 2 }}>{founder.dharmaName}</div>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: colors.neutralTan }}>
          &quot;{founder.quote}&quot; — hơn sáu năm khám chữa bệnh miễn phí cho người nghèo tại phòng thuốc Tâm
          Không Đường, Đà Lạt.
        </p>
        <Link
          to="/nguoi-sang-lap"
          style={{
            alignSelf: 'flex-start',
            background: colors.brandOrange,
            color: '#f5ead8',
            borderRadius: 999,
            padding: '9px 18px',
            fontSize: 13,
            fontFamily: fontFamily.display,
            fontWeight: fontFamily.headingWeight,
            textDecoration: 'none',
          }}
        >
          Đọc câu chuyện của thầy
        </Link>
      </div>

      <div style={{ textAlign: 'center', fontSize: 11, color: colors.neutral500, lineHeight: 1.9, paddingTop: 8 }}>
        Thôn Đất Làng, Xã Xuân Trường, Đà Lạt
        <br />
        Hotline / Zalo: {HOTLINE}
      </div>
    </div>
  )
}
