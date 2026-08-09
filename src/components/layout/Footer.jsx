import { colors, fontFamily } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'
import logoImg from '../../assets/images/logo.png'

// Footer — dựng lại 1:1 theo <footer> trong file mockup gốc
// "Tue Tram - Standalone.html" (đọc trực tiếp markup + CSS ngày 2026-08-06):
//   footer : border-top 1px --color-neutral-800;
//            background linear-gradient(180deg, transparent,
//                       color-mix(--color-accent-900 26%, transparent))
//            → --color-accent-900 = #402310, 26% alpha ≈ rgba(64,35,16,0.26)
//   inner  : padding var(--space-8)=35.2px 5vw; max-width 1240;
//            grid-template-columns 1.2fr 1fr 1fr; gap 35.2px
//   cột 1  : logo tròn 58px + "Tuệ Trầm" 19px neutral-100 +
//            "HƯƠNG THƠM CỦA TRÍ TUỆ" 11.5px accent-400 uppercase .1em,
//            rồi đoạn mô tả 13px neutral-400 line-height 1.8 max-width 34ch
//   cột 2  : "Địa chỉ" 15px neutral-200 + icon ghim accent-400 + địa chỉ
//   cột 3  : "Liên hệ" 15px neutral-200 + hotline/website (accent-300)
//   đáy    : dòng bản quyền căn giữa 11.5px neutral-600
// Số hotline dùng số THẬT của shop (.env), không phải số minh hoạ trong mockup.
const HOTLINE = import.meta.env.VITE_STORE_HOTLINE || '0947.569.879'
const HOTLINE_TEL = HOTLINE.replace(/[^\d+]/g, '')

const colTitleStyle = {
  fontFamily: fontFamily.display,
  fontWeight: fontFamily.headingWeight,
  fontSize: 15,
  color: colors.neutral200,
  marginBottom: 8,
}
const colBodyStyle = { fontSize: 13, color: colors.neutralTan, lineHeight: 2 }
const linkStyle = { color: colors.accentPeachLight, textDecoration: 'none' }

export default function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.neutral800}`,
        background: 'linear-gradient(180deg, transparent, rgba(64, 35, 16, 0.26))',
      }}
    >
      <div
        style={{
          padding: '35.2px 5vw',
          display: 'grid',
          // Mockup là `1.2fr 1fr 1fr`; cột giữa được nới lên 1.4fr để dòng
          // "Phòng thuốc … 8:00 – 17:00" nằm trọn một dòng (xem ghi chú dưới).
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1.4fr 1fr',
          gap: 35.2,
          maxWidth: 1240,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 13.2 }}>
            <img
              src={logoImg}
              alt="Logo Tuệ Trầm"
              style={{ width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ lineHeight: 1.3 }}>
              <div
                style={{
                  fontFamily: fontFamily.display,
                  fontWeight: fontFamily.headingWeight,
                  fontSize: 19,
                  color: colors.bgCreamAlt,
                }}
              >
                Tuệ Trầm
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: colors.accentPeach,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Hương thơm của trí tuệ
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: colors.neutralTan, lineHeight: 1.8, maxWidth: '34ch' }}>
            Chuyên cung cấp Trầm Hương – Nhang Trầm tự nhiên từ Đà Lạt. Mỗi nén trầm góp một phần cho phòng
            thuốc từ thiện Tâm Không Đường.
          </p>
        </div>

        <div style={colBodyStyle}>
          <div style={colTitleStyle}>Địa chỉ</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.accentPeach}
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flex: 'none', marginTop: 6 }}
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              Thôn Đất Làng, Xã Xuân Trường,
              <br />
              TP. Đà Lạt, Lâm Đồng
            </span>
          </div>
          {/* Chủ dự án yêu cầu dòng này nằm TRÊN MỘT DÒNG (2026-08-07).
              Cột "Địa chỉ" theo mockup là 1fr (~320px) nên câu 57 ký tự bị
              gãy đôi -> đã nới cột thành 1.4fr ở grid phía trên và khoá
              `nowrap` cho riêng dòng này. Ở mobile grid chỉ còn 1 cột hẹp,
              nowrap sẽ tràn ngang nên vẫn cho phép xuống dòng. */}
          <div style={{ marginTop: 6, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
            Phòng thuốc Tâm Không Đường — mở cửa mỗi ngày 8:00 – 17:00
          </div>
        </div>

        <div style={colBodyStyle}>
          <div style={colTitleStyle}>Liên hệ</div>
          <div>
            Hotline / Zalo:{' '}
            <a href={`tel:${HOTLINE_TEL}`} style={linkStyle}>
              {HOTLINE}
            </a>
          </div>
          {/* Đã bỏ dòng "www.tuetram.com" (2026-08-07, theo yêu cầu chủ dự
              án): khách đang ở chính website này rồi nên link tự trỏ về mình
              là thừa. Mockup gốc có dòng này — đây là chỗ CỐ Ý khác mockup. */}
          <div>Giao hàng toàn quốc từ Đà Lạt</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 5vw 17.6px', fontSize: 11.5, color: colors.neutral600 }}>
        © 2026 Tuệ Trầm · Nam mô Bổn Sư Thích Ca Mâu Ni Phật
      </div>
    </footer>
  )
}
