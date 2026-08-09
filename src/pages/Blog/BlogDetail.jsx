import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../../services/blogService'
import { colors, fontFamily } from '../../constants/theme'

// Trang chi tiết bài viết.
//
// Sửa 2026-08-07 theo swagger mới (BlogPostInput tách 2 loại ảnh):
//   - `thumbnail` (chuẩn hoá thành `post.cover`) = ảnh nền ĐẦU BÀI. Trước đây
//     chỗ này luôn hiện ô "Ảnh đang cập nhật" kể cả khi bài ĐÃ có ảnh — lỗi
//     thật, nay đã render ảnh.
//   - `images` = các ảnh chèn trong nội dung, hiện phía dưới phần chữ.
export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    getPostBySlug(slug)
      .then(setPost)
      .catch(() => setPost(null))
  }, [slug])

  if (!post) return null

  return (
    <div className="container" style={{ padding: '24px 0 48px', maxWidth: 720, marginInline: 'auto' }}>
      <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
        <Link to="/">Trang chủ</Link> / <Link to="/bai-viet">Bài viết</Link>
      </div>
      <h1 style={{ fontFamily: fontFamily.display, fontWeight: fontFamily.headingWeight, fontSize: 28, color: colors.bgCreamAlt }}>
        {post.title}
      </h1>

      {post.cover ? (
        <img
          src={post.cover}
          alt={post.title}
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            borderRadius: 16,
            margin: '16px 0',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            aspectRatio: '16 / 9',
            background: colors.neutralTanPale,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textDark,
            opacity: 0.5,
            margin: '16px 0',
          }}
        >
          Ảnh đang cập nhật
        </div>
      )}

      <p style={{ color: colors.neutralTan, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.content}</p>

      {post.images?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          {post.images.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              loading="lazy"
              style={{ width: '100%', borderRadius: 16, display: 'block' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
