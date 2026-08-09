import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import useIsMobile from '../hooks/useIsMobile'
import { colors, fontFamily } from '../constants/theme'
import { ADMIN_BG, ADMIN_SURFACE, ADMIN_BORDER } from '../components/admin/ui'
import logoImg from '../assets/images/logo.png'

// Layout khu vực /admin/* — dựng theo bộ ảnh thiết kế Admin chủ dự án gửi
// ngày 2026-08-06 (6 màn: Tổng quan / Người dùng / Đơn hàng / Bài đăng /
// Sản phẩm / Mã voucher). Sidebar nền kem, logo + chữ "QUẢN TRỊ" ở đầu, mục
// đang chọn có nền nhạt + vạch cam bên trái, hộp "Đăng nhập: <email>" ở đáy.
//
// Khu vực này là NỀN SÁNG — hoàn toàn tách biệt với trang khách hàng nền tối
// (MainLayout bọc ConfigProvider dark riêng). Xem CLAUDE.md mục 2.
//
// Mục "Danh mục" KHÔNG có trong 6 màn thiết kế nhưng vẫn giữ route
// /admin/danh-muc vì cần để gán danh mục cho sản phẩm — chỉ ẩn khỏi sidebar
// nếu chủ dự án muốn; hiện để lại cuối danh sách cho tiện quản lý.
const NAV_ITEMS = [
  {
    key: '/admin',
    end: true,
    label: 'Tổng quan',
    icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  },
  {
    key: '/admin/nguoi-dung',
    label: 'Người dùng',
    icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    key: '/admin/don-hang',
    label: 'Đơn hàng',
    icon: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2m11-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0M3 3h2l2.68 11.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L21 8H6',
  },
  {
    key: '/admin/bai-viet',
    label: 'Bài đăng',
    icon: 'M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 3v6h6M9 13h6M9 17h4',
  },
  {
    key: '/admin/san-pham',
    label: 'Sản phẩm',
    icon: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73zM12 22V12m-8.7-5 8.7 5 8.7-5',
  },
  {
    key: '/admin/voucher',
    label: 'Mã voucher',
    icon: 'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42zM7.5 7.5h.01',
  },
  {
    key: '/admin/danh-muc',
    label: 'Danh mục',
    icon: 'M3 6h18M3 12h18M3 18h18',
  },
]

function NavIcon({ d }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sidebar = (
    <aside
      style={{
        width: 244,
        flexShrink: 0,
        background: '#fbf4e8',
        borderRight: `1px solid ${ADMIN_BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100%' : '100vh',
        position: isMobile ? 'static' : 'sticky',
        top: 0,
      }}
    >
      <Link
        to="/admin"
        onClick={() => setDrawerOpen(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px', textDecoration: 'none' }}
      >
        <img src={logoImg} alt="Tuệ Trầm" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: 17,
              color: colors.brandOrangeDark,
            }}
          >
            Tuệ Trầm
          </span>
          <span style={{ fontSize: 9.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: colors.neutral600 }}>
            Quản trị
          </span>
        </span>
      </Link>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 10px', flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.key}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '11px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14.5,
              // Mục đang chọn: nền kem đậm hơn + vạch cam bên trái
              background: isActive ? ADMIN_SURFACE : 'transparent',
              color: isActive ? colors.brandOrangeDark : '#4a4239',
              fontWeight: isActive ? 600 : 400,
              boxShadow: isActive ? `inset 3px 0 0 ${colors.brandOrangeMid}` : 'none',
            })}
          >
            <NavIcon d={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Khối tài khoản ở đáy sidebar. Trước đây chỉ là 1 dropdown ẩn nên
          không ai thấy nút Đăng xuất / Về cửa hàng — sửa 2026-08-06 thành 2
          NÚT HIỆN RÕ ngay dưới email đang đăng nhập. */}
      <div style={{ margin: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: '10px 14px', borderRadius: 12, background: '#eef4e0' }}>
          <div style={{ fontSize: 11.5, color: colors.accent2_700 }}>Đăng nhập:</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#33402a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email || user?.username || 'admin'}
          </div>
        </div>

        <Link
          to="/"
          onClick={() => setDrawerOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 12px',
            borderRadius: 999,
            border: `1px solid ${ADMIN_BORDER}`,
            background: ADMIN_SURFACE,
            color: '#4a4239',
            fontSize: 13.5,
            textDecoration: 'none',
          }}
        >
          <NavIcon d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          Về trang chủ
        </Link>

        <button
          type="button"
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 12px',
            borderRadius: 999,
            border: '1px solid #d8a394',
            background: 'transparent',
            color: '#b0402a',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <NavIcon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          Đăng xuất
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: ADMIN_BG, color: colors.textDark }}>
      {!isMobile && sidebar}

      {/* Mobile: sidebar trượt ra từ trái, phủ nền mờ phía sau */}
      {isMobile && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(32,30,29,0.45)', zIndex: 60 }}
          />
          <div style={{ position: 'fixed', insetBlock: 0, left: 0, zIndex: 61 }}>{sidebar}</div>
        </>
      )}

      <main style={{ flex: 1, minWidth: 0, padding: isMobile ? '16px 16px 32px' : '26px 30px 40px' }}>
        {isMobile && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở menu quản trị"
            style={{
              marginBottom: 14,
              border: `1px solid ${ADMIN_BORDER}`,
              background: ADMIN_SURFACE,
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: colors.textDark,
            }}
          >
            <NavIcon d="M3 6h18M3 12h18M3 18h18" />
            Menu
          </button>
        )}
        <Outlet />
      </main>
    </div>
  )
}
