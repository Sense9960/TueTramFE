import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Button, Dropdown } from 'antd'
import { DashboardOutlined, DownOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import useIsMobile from '../../hooks/useIsMobile'
import { getCategories } from '../../services/productService'
import { colors, fontFamily } from '../../constants/theme'
import AuthModal from '../auth/AuthModal'
import logoImg from '../../assets/images/logo.png'

// Dựng lại 1:1 theo <header> trong file mockup gốc "Tue Tram - Standalone.html"
// (đọc trực tiếp ngày 2026-08-05, không suy đoán):
//   position:sticky; background:color-mix(--color-neutral-900 96%, transparent)
//   + backdrop-filter:blur(8px); border-bottom:1px solid --color-neutral-800
//   grid-template-columns:1fr auto 1fr; padding:14px 5vw (KHÔNG dùng .container
//   max-width như phần thân trang — header full-width có chủ đích).
// "Sản phẩm" mở MEGA-MENU sổ từ header xuống (khối `menuOpen` trong mockup) —
// đã dựng đầy đủ ngày 2026-08-06, xem <MegaMenu> bên dưới.
const NAV_ITEMS = [
  { key: '/san-pham', label: 'Sản phẩm', chevron: true },
  { key: '/nguoi-sang-lap', label: 'Giới thiệu' },
  { key: '/bai-viet', label: 'Bài viết' },
]

// Cờ bật/tắt phần bán hàng online. Đặt false ngày 2026-08-07 theo yêu cầu
// chủ dự án: website hiện chỉ là LANDING PAGE giới thiệu, chưa bán hàng —
// ẩn "Giỏ hàng" + "Đăng nhập" ở header, ẩn "Giỏ hàng & đặt hàng" trong
// mega-menu, ẩn tab Giỏ hàng ở thanh nav mobile. Toàn bộ code giỏ hàng /
// đăng nhập / thanh toán vẫn giữ nguyên, chỉ ẩn lối vào — khi nào bán hàng
// thì đổi cờ này (và cờ cùng tên trong MobileBottomNav.jsx) thành true.
export const SHOP_MODE = false

// Nhóm "Có thể bạn quan tâm" trong mega-menu — lấy nguyên văn từ mockup,
// riêng mục "Giỏ hàng & đặt hàng" chỉ hiện khi SHOP_MODE bật.
const MENU_EXTRA_LINKS = [
  { to: '/nguoi-sang-lap', label: 'Lương y Phạm Ngọc Huỳnh' },
  { to: '/gio-hang', label: 'Giỏ hàng & đặt hàng', shopOnly: true },
  { to: '/bai-viet', label: 'Bài viết' },
]

// Ghi chú: từ 2026-08-07, "Liên hệ" ở header trỏ sang trang /lien-he (nơi
// hiển thị hotline/Zalo/địa chỉ) thay vì gọi thẳng `tel:` như trước, nên
// Header không cần biến hotline nữa — số nằm ở Contact page + ContactWidget,
// cùng đọc từ VITE_STORE_HOTLINE trong .env.

export default function Header() {
  const { cartCount } = useCart()
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])

  // Danh mục trong mega-menu lấy từ API thật (GET /categories).
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Đổi trang thì đóng mega-menu lại, tránh menu còn treo sau khi điều hướng.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  // Chọn danh mục -> sang trang Sản phẩm kèm query để lọc sẵn.
  const pickCategory = (id) => {
    navigate(id === 'all' ? '/san-pham' : `/san-pham?danh-muc=${id}`)
    setMenuOpen(false)
  }

  // Đăng nhập/Trang quản trị/Đăng xuất là tính năng thêm sau, mockup gốc
  // không có (chỉ có Liên hệ + Giỏ hàng) — giữ nguyên phong cách link phẳng
  // của mockup thay vì Button nổi khối, cho đồng bộ.
  const accountMenuItems = [
    { key: 'name', label: user?.fullName || user?.username || 'Tài khoản', disabled: true },
    { type: 'divider' },
    ...(user?.role === 'Admin'
      ? [{ key: 'admin', label: <Link to="/admin">Trang quản trị</Link>, icon: <DashboardOutlined /> }]
      : []),
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: logout },
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(46, 43, 37, 0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.neutral800}`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'auto 1fr auto' : '1fr auto 1fr',
          alignItems: 'center',
          gap: 17,
          padding: '14px 5vw',
        }}
      >
        {isMobile ? (
          // Mobile: nút mở menu dạng tròn 44px nền neutral-800 — theo bản
          // mockup mobile (nút tròn 44px ở đầu hàng header).
          // 2026-08-07 (yêu cầu chủ dự án): nút này mở CHÍNH mega-menu như khi
          // bấm "Sản phẩm" trên desktop, thay cho Drawer trắng cũ (Drawer dùng
          // antd Menu nền sáng, lạc hẳn với theme tối và không có danh mục).
          <Button
            shape="circle"
            icon={<MenuOutlined />}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Mở menu"
            style={{
              width: 44,
              height: 44,
              background: colors.neutral800,
              border: 'none',
              color: colors.bgCreamAlt,
              justifySelf: 'start',
            }}
          />
        ) : (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 17, fontSize: 14.5 }}>
            {NAV_ITEMS.map((n) =>
              n.chevron ? (
                // "Sản phẩm" là nút mở mega-menu (không điều hướng ngay), đúng
                // như mockup: chữ trắng neutral-100 + mũi tên xuống.
                <button
                  key={n.key}
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="tt-header-link"
                  aria-expanded={menuOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: 14.5,
                    fontFamily: fontFamily.body,
                    color: colors.bgCreamAlt,
                  }}
                >
                  {n.label}
                  <DownOutlined
                    style={{ fontSize: 10, transition: 'transform .2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
              ) : (
                <NavLink
                  key={n.key}
                  to={n.key}
                  className="tt-header-link"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    color: isActive ? colors.accentPeachLight : colors.neutralTanLight,
                  })}
                >
                  {n.label}
                </NavLink>
              ),
            )}
          </nav>
        )}

        {/* Khối logo giữa header — dựng đúng theo mockup gốc:
              <a style="display:flex;align-items:center;gap:12px;justify-self:center">
                <img style="width:46px;height:46px;border-radius:50%;object-fit:cover;box-shadow:var(--shadow-sm)">
                <span style="display:flex;flex-direction:column;align-items:center;line-height:1.05">
                  <span 26px var(--color-accent-300)>Tuệ Trầm</span>
                  <span 8.5px letter-spacing .32em uppercase var(--color-neutral-500)>Trầm hương Đà Lạt</span>
            Ảnh logo dùng file thật chủ shop gửi (2026-08-06) thay ảnh mẫu
            trong mockup; phần chữ giữ nguyên vì mockup có cả ảnh LẪN chữ. */}
        <Link
          to="/"
          style={{
            justifySelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
          }}
        >
          <img
            src={logoImg}
            alt="Logo Tuệ Trầm"
            style={{
              width: isMobile ? 38 : 46,
              height: isMobile ? 38 : 46,
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 1px 2px rgba(46, 43, 37, 0.14)',
              flexShrink: 0,
            }}
          />
          <span
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.05 }}
          >
            <span
              style={{
                fontFamily: fontFamily.display,
                fontWeight: fontFamily.headingWeight,
                fontSize: isMobile ? 21 : 26,
                color: colors.accentPeachLight,
                whiteSpace: 'nowrap',
              }}
            >
              Tuệ Trầm
            </span>
            {!isMobile && (
              <span
                style={{
                  fontSize: 8.5,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: colors.neutral500,
                  whiteSpace: 'nowrap',
                }}
              >
                Trầm hương Đà Lạt
              </span>
            )}
          </span>
        </Link>

        {/* SHOP_MODE = false (2026-08-07, yêu cầu chủ dự án): website hiện
            chỉ là landing page giới thiệu, CHƯA bán hàng online — nên ẩn nút
            "Giỏ hàng" và "Đăng nhập" ở header, chỉ giữ "Liên hệ".
            Code giỏ hàng/đăng nhập vẫn còn nguyên (route + service + modal),
            chỉ ẩn lối vào; bật lại bằng cách đổi SHOP_MODE = true. */}
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 17, fontSize: 14.5 }}>
          {isMobile ? (
            // Mobile: nút tròn 44px nền neutral-800 ở cuối hàng header, đúng
            // vị trí nút giỏ hàng trong mockup mobile — nay là nút Liên hệ
            // vì đang tắt bán hàng (SHOP_MODE).
            <Link
              to="/lien-he"
              aria-label="Liên hệ"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: colors.neutral800,
                color: colors.bgCreamAlt,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92" />
              </svg>
            </Link>
          ) : (
            <Link
              to="/lien-he"
              className="tt-header-link"
              style={{ textDecoration: 'none', color: colors.bgCreamAlt, whiteSpace: 'nowrap' }}
            >
              Liên hệ
            </Link>
          )}

          {SHOP_MODE && (
            <>
              <Link
                to="/gio-hang"
                className="tt-header-link"
                style={{ textDecoration: 'none', color: colors.bgCreamAlt, whiteSpace: 'nowrap' }}
              >
                Giỏ hàng ({cartCount})
              </Link>
              {isAuthenticated ? (
                <Dropdown menu={{ items: accountMenuItems }} placement="bottomRight" trigger={['click']}>
                  <Avatar
                    size={32}
                    style={{ cursor: 'pointer', background: colors.brandOrange, flexShrink: 0 }}
                    icon={!user?.fullName && !user?.username ? <UserOutlined /> : undefined}
                  >
                    {(user?.fullName || user?.username || '').slice(0, 1).toUpperCase() || undefined}
                  </Avatar>
                </Dropdown>
              ) : (
                <a
                  onClick={openAuthModal}
                  className="tt-header-link"
                  style={{ cursor: 'pointer', textDecoration: 'none', color: colors.neutralTanLight, whiteSpace: 'nowrap' }}
                >
                  Đăng nhập
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mega-menu sổ từ header xuống — dựng 1:1 theo khối `menuOpen` trong
          mockup: position absolute top:100%; nền --color-bg (KEM, tương phản
          với header tối); bo góc dưới calc(--radius-lg * 1.15) = 32.2px;
          shadow-lg. Bên trong: nhãn "Sản phẩm" 12px đậm neutral-600, danh
          sách danh mục chữ 23px font-heading, rồi nhãn "Có thể bạn quan tâm"
          + 3 link 19px. Nút X đóng ở góc phải trên. */}
      {/* Từ 2026-08-07 mega-menu dùng CHUNG cho cả desktop lẫn mobile: desktop
          mở bằng nút "Sản phẩm", mobile mở bằng nút tròn ☰. Trên mobile giới
          hạn chiều cao 78vh + cho cuộn, phòng khi danh mục nhiều. */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#f5ead8', // --color-bg
            color: colors.textDark,
            boxShadow: '0 12px 32px rgba(46, 43, 37, 0.22)',
            borderRadius: '0 0 32.2px 32.2px',
            maxHeight: isMobile ? '78vh' : undefined,
            overflowY: isMobile ? 'auto' : undefined,
          }}
        >
          <div
            className={isMobile ? 'tt-mega-mobile' : undefined}
            style={{
              maxWidth: 1240,
              margin: '0 auto',
              padding: isMobile ? '18px 18px 26px' : '26.4px 5vw 35.2px',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              title="Đóng"
              aria-label="Đóng menu"
              style={{
                position: 'absolute',
                top: isMobile ? 10 : 17.6,
                right: isMobile ? 12 : '5vw',
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: colors.neutral700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <div style={{ fontSize: 12, fontWeight: 700, color: colors.neutral600, margin: '17.6px 0 13.2px' }}>
              Sản phẩm
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8.8, alignItems: 'flex-start' }}>
              <button type="button" onClick={() => pickCategory('all')} className="tt-mega-link">
                Tất cả sản phẩm
              </button>
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => pickCategory(c.id)} className="tt-mega-link">
                  {c.title}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: colors.neutral600, margin: '26.4px 0 13.2px' }}>
              Có thể bạn quan tâm
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8.8, alignItems: 'flex-start' }}>
              {MENU_EXTRA_LINKS.filter((l) => SHOP_MODE || !l.shopOnly).map((l) => (
                <Link key={l.to} to={l.to} className="tt-mega-link tt-mega-link-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <AuthModal />
    </header>
  )
}
