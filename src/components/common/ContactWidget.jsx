import { useState } from 'react'
import useIsMobile from '../../hooks/useIsMobile'
import { colors, fontFamily } from '../../constants/theme'
import zaloIcon from '../../assets/images/zalo.png'

// Widget liên hệ nổi ở góc phải dưới (theo yêu cầu chủ dự án 2026-08-07).
//
// Hai trạng thái:
//   - Thu gọn : 1 nút "Liên hệ" duy nhất.
//   - Mở rộng : 3 nút xếp dọc — Zalo (mở chat), Gọi ngay (quay số trực tiếp),
//               và nút X để thu gọn về lại nút "Liên hệ".
//
// Số điện thoại lấy từ .env (VITE_STORE_ZALO / VITE_STORE_HOTLINE) nên chỉ
// phải sửa 1 chỗ khi shop đổi số:
//   - Link Zalo phải là https://zalo.me/<số viết liền>, không dấu chấm/cách.
//   - href="tel:" cũng cần số viết liền thì máy mới quay số được.
//
// Widget đặt trong MainLayout nên hiện ở MỌI trang khách hàng, KHÔNG hiện
// trong khu vực /admin.
const HOTLINE = import.meta.env.VITE_STORE_HOTLINE || '0947.569.879'
const ZALO = import.meta.env.VITE_STORE_ZALO || HOTLINE
const HOTLINE_TEL = HOTLINE.replace(/[^\d+]/g, '')
const ZALO_NUMBER = ZALO.replace(/[^\d]/g, '')

const ITEM_BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  height: 52,
  borderRadius: 999,
  textDecoration: 'none',
  fontSize: 14.5,
  fontWeight: 600,
  fontFamily: fontFamily.body,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 8px 22px rgba(46, 43, 37, 0.35)',
  boxSizing: 'border-box',
  justifyContent: 'flex-start',
}

export default function ContactWidget() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  // Trên mobile có thanh nav dưới cùng -> đẩy widget lên để không che nhau.
  const bottom = isMobile ? 82 : 22
  // Khi mở: chỉ hiện icon tròn trên mobile cho gọn, có kèm chữ trên desktop.
  const itemStyle = { ...ITEM_BASE, padding: isMobile ? 0 : '0 20px 0 6px', width: isMobile ? 52 : 'auto' }

  return (
    <div
      style={{
        position: 'fixed',
        right: 18,
        bottom,
        zIndex: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
    >
      {open ? (
        <>
          {/* 1. Zalo — mở cửa sổ chat Zalo với số của shop */}
          <a
            href={`https://zalo.me/${ZALO_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Chat Zalo ${ZALO}`}
            style={{ ...itemStyle, background: '#0068ff', color: '#fff' }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: isMobile ? 6 : 0,
              }}
            >
              <img src={zaloIcon} alt="" style={{ width: 26, height: 26, display: 'block' }} />
            </span>
            {!isMobile && <span>Chat Zalo</span>}
          </a>

          {/* 2. Gọi ngay — bấm là máy quay số luôn */}
          <a
            href={`tel:${HOTLINE_TEL}`}
            title={`Gọi ${HOTLINE}`}
            style={{ ...itemStyle, background: '#22a24a', color: '#fff' }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fff',
                color: '#22a24a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: isMobile ? 6 : 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92" />
              </svg>
            </span>
            {/* Chỉ hiện chữ "Gọi ngay" — KHÔNG in số ra ngoài nút (số vẫn
                nằm trong href tel: nên bấm là quay số bình thường). */}
            {!isMobile && <span>Gọi ngay</span>}
          </a>

          {/* 3. Đóng — thu gọn về lại nút "Liên hệ" */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            title="Đóng"
            aria-label="Đóng menu liên hệ"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: colors.neutral800,
              color: colors.bgCreamAlt,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 22px rgba(46, 43, 37, 0.35)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu liên hệ"
          style={{
            ...ITEM_BASE,
            padding: '0 22px 0 8px',
            background: colors.brandOrange,
            color: '#fff',
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.22)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
            </svg>
          </span>
          Liên hệ
        </button>
      )}
    </div>
  )
}
