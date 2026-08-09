import { fontFamily, colors } from '../../constants/theme'

// Dùng ở nhiều trang (Products, Blog, Home...) nên phải theo đúng bảng màu
// dark-theme của site (xem colors.textDark2 trong constants/theme.js — giờ
// là màu NỀN, không phải màu chữ). eyebrow/title/subtitle đổi sang tông sáng
// để đọc được trên nền tối.
export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div style={{ textAlign: align, marginBottom: 32 }}>
      {eyebrow && (
        <div style={{ color: colors.accentPeachLight, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: fontFamily.display,
          fontWeight: fontFamily.headingWeight,
          fontSize: 28,
          margin: 0,
          color: colors.bgCreamAlt,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: colors.neutralTan,
            marginTop: 8,
            maxWidth: 560,
            marginInline: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
