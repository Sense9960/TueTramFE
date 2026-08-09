import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../../services/blogService'
import { colors, fontFamily } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'

// Trang /bai-viet — dựng lại 1:1 theo màn `isBlog` trong file mockup gốc
// "Tue Tram - Standalone.html" (đọc trực tiếp markup + CSS ngày 2026-08-06):
//   wrapper : max-width 1240; padding 44px 5vw 80px
//   breadcrumb: 12px, letter-spacing .14em, uppercase, weight 700,
//               màu --color-neutral-400, dấu "/" màu --color-neutral-600
//   h1      : 40px --color-neutral-100; margin var(--space-3) 0 var(--space-2)
//   mô tả   : 14.5px --color-neutral-400; max-width 56ch
//   lưới    : grid repeat(3, 1fr); gap var(--space-4)=17.6px
//   thẻ     : ảnh vuông 1/1 bo --radius-md=16px (hover phóng 1.04) →
//             dòng "Chuyên mục | ngày" (chuyên mục đậm neutral-300, ngày
//             accent-400) → tiêu đề 19px neutral-100 → excerpt 13.5px
// Dữ liệu lấy từ API thật (GET /api/blog) — không còn mock data.
function fmtDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  // Mockup hiển thị dạng "28.07.26"
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)}`
}

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: isMobile ? '28px 5vw 60px' : '44px 5vw 80px' }}>
      <div
        style={{
          fontSize: 12,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: colors.neutralTan,
        }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Trang chủ
        </Link>{' '}
        <span style={{ color: colors.neutral600 }}>/</span> Bài viết
      </div>

      <h1
        style={{
          fontFamily: fontFamily.display,
          fontWeight: fontFamily.headingWeight,
          color: colors.bgCreamAlt,
          fontSize: isMobile ? 30 : 40,
          margin: '13.2px 0 8.8px',
        }}
      >
        Bài viết
      </h1>
      <p style={{ color: colors.neutralTan, fontSize: 14.5, maxWidth: '56ch', margin: '0 0 26.4px' }}>
        Góc nhỏ nơi Tuệ Trầm chia sẻ về hương đạo, cách dùng trầm và những câu chuyện từ phòng thuốc Tâm Không
        Đường. Bài mới sẽ được đăng tại đây.
      </p>

      {!loading && posts.length === 0 && (
        <p style={{ color: colors.neutralTan, fontSize: 14 }}>Chưa có bài viết nào được đăng.</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 17.6,
        }}
      >
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/bai-viet/${p.slug}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none' }}
          >
            <div style={{ borderRadius: 16, overflow: 'hidden', background: colors.neutral800 }}>
              {p.cover ? (
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.neutralTan,
                    fontSize: 13,
                  }}
                >
                  Ảnh đang cập nhật
                </div>
              )}
            </div>

            <div style={{ fontSize: 12, color: colors.neutral500 }}>
              <span style={{ fontWeight: 700, color: colors.neutralTanLight }}>
                {p.category?.name || p.category || 'Bài viết'}
              </span>
              <span style={{ margin: '0 4px' }}>|</span>
              <span style={{ color: colors.accentPeach }}>{fmtDate(p.publishedAt || p.createdAt)}</span>
            </div>

            <div style={{ fontSize: 19, lineHeight: 1.45, color: colors.bgCreamAlt }}>{p.title}</div>
            <p style={{ margin: 0, fontSize: 13.5, color: colors.neutralTan, lineHeight: 1.7 }}>{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
