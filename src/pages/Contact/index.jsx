import { colors, fontFamily } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'
import zaloIcon from '../../assets/images/zalo.png'

// Trang /lien-he — nằm TRONG MainLayout nên vẫn có Header + Footer như mọi
// trang khác (không phải trang tách rời).
//
// Yêu cầu chủ dự án 2026-08-07: xếp thông tin liên hệ theo CHIỀU DỌC và gói
// gọn trong MỘT KHUNG HÌNH (đọc hết không phải cuộn). Nên:
//   - Toàn bộ nội dung nằm trong 1 thẻ, các dòng thông tin xếp dọc.
//   - Khối bọc dùng min-height tính theo viewport trừ chiều cao header
//     (~76px) để canh giữa màn hình mà không tràn gây cuộn.
//   - Chữ và khoảng cách nén vừa phải, không dàn ngang nhiều cột như footer.
const HOTLINE = import.meta.env.VITE_STORE_HOTLINE || '0947.569.879'
const ZALO = import.meta.env.VITE_STORE_ZALO || HOTLINE
const HOTLINE_TEL = HOTLINE.replace(/[^\d+]/g, '')
const ZALO_NUMBER = ZALO.replace(/[^\d]/g, '')

// Mỗi dòng: icon tròn + nhãn nhỏ + nội dung
function InfoRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: colors.neutral800,
          color: colors.accentPeach,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: colors.neutral500,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 15, color: colors.bgCreamAlt, lineHeight: 1.55 }}>{children}</div>
      </div>
    </div>
  )
}

export default function Contact() {
  const isMobile = useIsMobile()

  const iconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <div
      style={{
        // Trừ chiều cao header để nội dung canh giữa đúng 1 khung hình.
        minHeight: isMobile ? 'auto' : 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '28px 5vw 40px' : '32px 5vw',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        <h1
          style={{
            fontFamily: fontFamily.display,
            fontWeight: fontFamily.headingWeight,
            color: colors.bgCreamAlt,
            fontSize: isMobile ? 28 : 34,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Liên hệ Tuệ Trầm
        </h1>
        <p style={{ color: colors.neutralTan, fontSize: 14.5, margin: '8px 0 22px' }}>
          Gọi hoặc nhắn Zalo để được tư vấn về trầm hương — hoặc ghé trực tiếp phòng thuốc tại Đà Lạt.
        </p>

        {/* Thông tin xếp dọc trong 1 thẻ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            padding: isMobile ? 20 : 26,
            borderRadius: 22,
            background: colors.neutral800,
          }}
        >
          <InfoRow
            label="Hotline / Zalo"
            icon={
              <svg {...iconProps}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92" />
              </svg>
            }
          >
            <a href={`tel:${HOTLINE_TEL}`} style={{ color: colors.accentPeachLight, textDecoration: 'none' }}>
              {HOTLINE}
            </a>
          </InfoRow>

          <InfoRow
            label="Địa chỉ"
            icon={
              <svg {...iconProps}>
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          >
            Thôn Đất Làng, Xã Xuân Trường,
            <br />
            TP. Đà Lạt, Lâm Đồng
          </InfoRow>

          <InfoRow
            label="Giờ mở cửa"
            icon={
              <svg {...iconProps}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          >
            {/* Một dòng, không ngắt (yêu cầu chủ dự án 2026-08-07). */}
            Phòng thuốc Tâm Không Đường — mở cửa mỗi ngày 8:00 – 17:00
          </InfoRow>

          {/* Đã bỏ dòng "Website" (2026-08-07): khách đang ở chính website này
              rồi, để link tự trỏ về mình là thừa. */}
          <InfoRow
            label="Giao hàng"
            icon={
              <svg {...iconProps}>
                <path d="M10 17h4V5H2v12h3m5 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m5 0h2v-5l-3-4h-4v9h1m4 0a2 2 0 1 0 0 .01" />
              </svg>
            }
          >
            Giao hàng toàn quốc từ Đà Lạt
          </InfoRow>
        </div>

        {/* 2 nút hành động */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <a
            href={`tel:${HOTLINE_TEL}`}
            style={{
              flex: 1,
              minWidth: 150,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              height: 48,
              borderRadius: 999,
              background: colors.brandOrange,
              color: '#fff',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <svg {...iconProps} width="17" height="17">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92" />
            </svg>
            Gọi ngay
          </a>

          <a
            href={`https://zalo.me/${ZALO_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              minWidth: 150,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              height: 48,
              borderRadius: 999,
              background: '#0068ff',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img src={zaloIcon} alt="" style={{ width: 18, height: 18, display: 'block' }} />
            </span>
            Chat Zalo
          </a>
        </div>
      </div>
    </div>
  )
}
