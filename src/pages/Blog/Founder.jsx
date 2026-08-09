import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { founder } from '../../data/posts'
import { colors, fontFamily } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'
import founderImg from '../../assets/images/founder-portrait.jpg'
import traDamImg from '../../assets/images/tra-dam.jpg'

// Trang /nguoi-sang-lap — dựng lại 1:1 theo màn `isAbout` trong file mockup
// gốc "Tue Tram - Standalone.html" (đọc trực tiếp markup + CSS variables ngày
// 2026-08-06, KHÔNG suy đoán). Mockup có đúng 3 section:
//   1. Hero  : max-width 1100; padding 64px 5vw 24px; grid 0.9fr/1.1fr;
//              gap var(--space-8)=35.2px; ảnh min(380px,36vw) tỉ lệ 3/4,
//              border-radius calc(--radius-lg * 1.6)=44.8px + figcaption;
//              cột phải: tag "Theo tạp chí..." (bg neutral-800, màu accent-300)
//              → h1 clamp(36px,4.4vw,54px) → pháp danh (accent-2-300) → p 17px
//   2. Bài   : max-width 820; card kem (--color-surface #ebddc5) bo
//              --radius-md=16px, padding var(--space-8), chữ neutral-900;
//              h3 accent-700; p 15px/1.7; blockquote nền accent-100,
//              bo --radius-lg=28px, 21px, màu accent-800; figure ảnh cao 340px
//   3. CTA   : max-width 820; căn giữa; h2 30px neutral-100 + nút primary
// Toàn bộ câu chữ lấy từ `founder` trong src/data/posts.js (copy nguyên văn
// từ mockup) — không tự viết lại.
export default function Founder() {
  const isMobile = useIsMobile()

  const paragraphStyle = { margin: 0, fontSize: 15, lineHeight: 1.7 }
  const h3Style = {
    fontFamily: fontFamily.display,
    fontWeight: fontFamily.headingWeight,
    color: colors.brandOrangeDark, // --color-accent-700
    margin: 0,
    fontSize: 21,
  }

  return (
    <div>
      {/* 1. Hero */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '32px 5vw 16px' : '64px 5vw 24px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr',
          gap: 35,
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', justifySelf: 'center' }}>
          <figure style={{ margin: 0 }}>
            <img
              src={founderImg}
              alt="Lương y Phạm Ngọc Quỳnh"
              style={{
                width: isMobile ? 'min(320px, 78vw)' : 'min(380px, 36vw)',
                aspectRatio: '3 / 4',
                objectFit: 'cover',
                borderRadius: 44.8,
                boxShadow: '0 12px 32px rgba(46, 43, 37, 0.22)',
                display: 'block',
              }}
            />
            <figcaption
              style={{ color: colors.neutral500, textAlign: 'center', marginTop: 10, fontSize: 13 }}
            >
              {founder.photoCaption}
            </figcaption>
          </figure>
        </div>
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: colors.neutral800,
              color: colors.accentPeachLight,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 12,
            }}
          >
            {founder.source}
          </span>
          <h1
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              color: colors.bgCreamAlt,
              fontSize: isMobile ? 'clamp(30px, 9vw, 40px)' : 'clamp(36px, 4.4vw, 54px)',
              margin: '13.2px 0',
              lineHeight: 1.12,
            }}
          >
            {founder.nameLines[0]}
            <br />
            {founder.nameLines[1]}
          </h1>
          <div style={{ fontSize: 15, color: colors.accent2_300, marginBottom: 13.2 }}>
            {founder.dharmaName}
          </div>
          <p style={{ fontSize: 17, color: colors.neutralTan, margin: 0 }}>{founder.intro}</p>
        </div>
      </section>

      {/* 2. Bài viết trong thẻ nền kem */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '26.4px 5vw 40px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 17.6,
            padding: isMobile ? 22 : 35.2,
            borderRadius: 16,
            background: colors.neutralTanPale, // --color-surface
            color: colors.textDark2, // --color-neutral-900
            boxShadow: '0 12px 32px rgba(46, 43, 37, 0.22)',
          }}
        >
          <h3 style={h3Style}>{founder.article.section1Title}</h3>
          {founder.article.section1.map((p) => (
            <p key={p.slice(0, 24)} style={paragraphStyle}>
              {p}
            </p>
          ))}

          <blockquote
            style={{
              margin: '8.8px 0',
              padding: '17.6px 26.4px',
              background: colors.bgWarm, // --color-accent-100
              borderRadius: 28,
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: 21,
              lineHeight: 1.4,
              color: colors.brandOrangeDeep, // --color-accent-800
            }}
          >
            {founder.article.pullQuote}
          </blockquote>

          <h3 style={{ ...h3Style, margin: '8.8px 0 0' }}>{founder.article.section2Title}</h3>
          {founder.article.section2.map((p) => (
            <p key={p.slice(0, 24)} style={paragraphStyle}>
              {p}
            </p>
          ))}

          <figure style={{ marginTop: 8.8, marginBottom: 0, marginInline: 0 }}>
            <img
              src={traDamImg}
              alt="Không gian trà đàm"
              style={{
                width: '100%',
                height: 340,
                objectFit: 'cover',
                objectPosition: '50% 60%',
                borderRadius: 28,
                display: 'block',
              }}
            />
            <figcaption style={{ fontSize: 13, marginTop: 8, opacity: 0.75 }}>
              {founder.article.figureCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 3. CTA cuối trang */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 5vw 80px', textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: fontFamily.display,
            fontWeight: fontFamily.headingWeight,
            color: colors.bgCreamAlt,
            fontSize: isMobile ? 24 : 30,
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {founder.cta.titleLines[0]}
          <br />
          {founder.cta.titleLines[1]}
        </h2>
        <Link to="/san-pham">
          <Button
            type="primary"
            style={{
              padding: '0 28px',
              height: 46,
              fontSize: 15,
              marginTop: 8.8,
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
            }}
          >
            {founder.cta.button}
          </Button>
        </Link>
      </section>
    </div>
  )
}
