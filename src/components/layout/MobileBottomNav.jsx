import { NavLink } from 'react-router-dom'
import { colors, fontFamily } from '../../constants/theme'
import { SHOP_MODE } from './Header'

// Thanh tab dưới cùng (chỉ hiện ở mobile) — dựng theo file mockup mobile
// "Tue Tram Mobile - Standalone.html" (chủ dự án gửi 2026-08-07):
//   thanh : display flex; justify-content space-around; padding 8px 10px 6px;
//           border-top 1px --color-neutral-800;
//           background color-mix(--color-neutral-900 96%, transparent)
//   tab   : flex 1; padding 6px 4px; min-height 44px (đủ vùng chạm);
//           icon 19px, nhãn 10px cách icon 3px
//           màu: đang chọn = --color-accent-300, còn lại = --color-neutral-500
// Icon dùng đúng path SVG trong mockup, không thay bằng icon antd.
//
// Tab thứ 4 là "Giỏ hàng" khi bán hàng online (SHOP_MODE), còn hiện tại
// website là landing page nên thay bằng "Liên hệ".
const TABS = [
  {
    to: '/',
    label: 'Trang chủ',
    end: true,
    paths: [
      'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
      'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    ],
  },
  {
    to: '/san-pham',
    label: 'Sản phẩm',
    paths: [
      'M16 10a4 4 0 0 1-8 0',
      'M3.103 6.034h17.794',
      'M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z',
    ],
  },
  {
    to: '/bai-viet',
    label: 'Bài viết',
    paths: [
      'M15 18h-5',
      'M18 14h-8',
      'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9c0-1.1.9-2 2-2h2',
      'M18 10h-8',
    ],
  },
  SHOP_MODE
    ? {
        to: '/gio-hang',
        label: 'Giỏ hàng',
        paths: [
          'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12',
          'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
          'M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
        ],
      }
    : {
        to: '/lien-he',
        label: 'Liên hệ',
        paths: [
          'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92',
        ],
      },
]

export default function MobileBottomNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 10px 6px',
        borderTop: `1px solid ${colors.neutral800}`,
        background: 'rgba(46, 43, 37, 0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        paddingBottom: 'calc(6px + env(safe-area-inset-bottom))',
      }}
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          style={({ isActive }) => ({
            flex: 1,
            padding: '6px 4px',
            minHeight: 44,
            textAlign: 'center',
            textDecoration: 'none',
            fontFamily: fontFamily.body,
            color: isActive ? colors.accentPeachLight : colors.neutral500,
          })}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: 'block', margin: '0 auto' }}
          >
            {tab.paths.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
          <span style={{ fontSize: 10, display: 'block', marginTop: 3 }}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
