import { colors, fontFamily } from '../../../constants/theme'

// Bộ UI dùng chung cho 6 màn hình Admin, dựng theo đúng ảnh thiết kế Admin
// chủ dự án gửi ngày 2026-08-06 (KHÔNG có trong file mockup
// "Tue Tram - Standalone.html" — mockup đó chỉ vẽ trang khách hàng).
//
// Bảng màu dùng lại đúng ramp của thương hiệu trong theme.js:
//   nền trang    = --color-bg      #f5ead8  (colors.adminBg)
//   nền thẻ/bảng = --color-surface #ebddc5  (colors.neutralTanPale)
//   chữ chính    = --color-text    #201e1d  (colors.textDark)
//   nhấn         = --color-accent  #c67139  (colors.brandOrange)
// Đây là khu vực NỀN SÁNG, khác hẳn trang khách hàng (nền tối) — xem
// CLAUDE.md mục 2.

export const ADMIN_BG = '#f5ead8' // --color-bg
export const ADMIN_SURFACE = colors.neutralTanPale // --color-surface #ebddc5
export const ADMIN_SURFACE_SOFT = '#f7efe2' // nền bảng/nhánh nhạt hơn surface
export const ADMIN_BORDER = '#e0cfb2' // đường kẻ mảnh giữa các dòng bảng

/** Tiêu đề trang + mô tả, ô tìm kiếm và nút hành động chính bên phải. */
export function AdminPageHeader({ title, subtitle, search, onSearchChange, actionLabel, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: fontFamily.display,
            fontWeight: fontFamily.headingWeight,
            fontSize: 26,
            margin: 0,
            color: '#1d1a17',
          }}
        >
          {title}
        </h1>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.neutral700 }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {onSearchChange && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fdfaf4',
              border: `1px solid ${ADMIN_BORDER}`,
              borderRadius: 999,
              padding: '9px 16px',
              minWidth: 230,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.neutral600}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 14,
                color: colors.textDark,
                width: '100%',
                fontFamily: fontFamily.body,
              }}
            />
          </label>
        )}
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: colors.brandOrangeMid,
              color: '#fff',
              borderRadius: 999,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: fontFamily.body,
              whiteSpace: 'nowrap',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

/** Hàng thẻ số liệu tổng quan phía trên bảng. */
export function StatCards({ items }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${items.length > 3 ? 200 : 240}px, 1fr))`,
        gap: 16,
        marginBottom: 22,
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            background: ADMIN_SURFACE,
            borderRadius: 22,
            padding: '16px 22px',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.brandOrangeMid,
              fontWeight: 600,
            }}
          >
            {it.label}
          </div>
          <div
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: 26,
              color: '#1d1a17',
              marginTop: 6,
            }}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  )
}

const PILL_TONES = {
  // xanh lá nhạt — trạng thái "tốt" (hoạt động, hoàn thành, đã đăng, đang chạy)
  green: { background: '#e8f2d8', color: colors.accent2_700, border: 'transparent' },
  // kem — trạng thái trung tính (chờ xử lý, bản nháp, hết hạn)
  neutral: { background: '#fdf7ec', color: colors.neutral700, border: ADMIN_BORDER },
  // viền cam — nhấn nhẹ (vai trò khách hàng, mã voucher)
  outline: { background: 'transparent', color: colors.brandOrangeMid, border: colors.brandOrangeMid },
  // viền đỏ — trạng thái xấu (đã huỷ, đã khoá)
  danger: { background: 'transparent', color: '#b0402a', border: '#b0402a' },
  // đặc — nhấn mạnh (quản trị viên)
  solid: { background: '#fdf7ec', color: '#1d1a17', border: 'transparent' },
}

/** Nhãn trạng thái bo tròn trong bảng. */
export function Pill({ tone = 'neutral', children, mono = false }) {
  const t = PILL_TONES[tone] || PILL_TONES.neutral
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: t.background,
        color: t.color,
        border: `1px solid ${t.border}`,
        borderRadius: 999,
        padding: '3px 12px',
        fontSize: 12.5,
        whiteSpace: 'nowrap',
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : fontFamily.body,
      }}
    >
      {children}
    </span>
  )
}

/** Bảng dữ liệu nền kem — dùng chung cho cả 5 màn hình danh sách. */
export function DataTable({ columns, rows, rowKey, empty = 'Chưa có dữ liệu', loading = false }) {
  return (
    <div style={{ background: ADMIN_SURFACE_SOFT, borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead>
            <tr style={{ background: ADMIN_SURFACE }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: c.align || 'left',
                    padding: '13px 18px',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: colors.neutral700,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} style={{ padding: 28, textAlign: 'center', color: colors.neutral700 }}>
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: 28, textAlign: 'center', color: colors.neutral700 }}>
                  {empty}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={rowKey(row)} style={{ borderTop: `1px solid ${ADMIN_BORDER}` }}>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        padding: '14px 18px',
                        fontSize: 14,
                        color: c.muted ? colors.neutral700 : colors.textDark,
                        textAlign: c.align || 'left',
                        whiteSpace: c.wrap ? 'normal' : 'nowrap',
                      }}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Cặp nút sửa / xoá ở cột cuối mỗi dòng. */
export function RowActions({ onEdit, onDelete, disableDelete = false }) {
  const btn = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 4,
    display: 'inline-flex',
    lineHeight: 0,
  }
  return (
    <span style={{ display: 'inline-flex', gap: 10 }}>
      {onEdit && (
        <button type="button" onClick={onEdit} title="Sửa" aria-label="Sửa" style={btn}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.brandOrangeMid}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={disableDelete}
          title="Xoá"
          aria-label="Xoá"
          style={{ ...btn, opacity: disableDelete ? 0.35 : 1, cursor: disableDelete ? 'not-allowed' : 'pointer' }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b0402a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      )}
    </span>
  )
}
