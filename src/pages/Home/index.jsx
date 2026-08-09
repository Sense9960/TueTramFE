import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, Card } from 'antd'
import SectionTitle from '../../components/common/SectionTitle'
import TrustBadges from '../../components/common/TrustBadges'
import ProductCarousel from '../../components/product/ProductCarousel'
import HomeMobile from './HomeMobile'
import { getProducts, getCategories } from '../../services/productService'
import { getPosts } from '../../services/blogService'
import { founder } from '../../data/posts'
import { colors, fontFamily } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'
import heroImg from '../../assets/images/product-1.jpg'
import founderPreviewImg from '../../assets/images/founder-portrait.jpg'

// 4 dòng sản phẩm giới thiệu ở khối "Tuệ Trầm cung cấp gì?" — dữ liệu +
// icon path lấy nguyên văn từ `introCats` trong file mockup gốc
// "Tue Tram - Standalone.html" (đọc ngày 2026-08-05, không suy đoán). Đây là
// nội dung marketing tĩnh của mockup, khác với danh mục thật lấy từ API/mock
// productService (vẫn dùng ở trang /san-pham).
const INTRO_CATS = [
  {
    id: 'nhang',
    label: 'Nhang trầm',
    desc: 'Nhang 3 tấc & 4 tấc, tép 100g, thuần bột trầm.',
    icon: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  },
  {
    id: 'tram',
    label: 'Trầm miếng',
    desc: 'Trầm rừng dó bầu xông trên than.',
    icon: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  },
  {
    id: 'nu',
    label: 'Nhang vòng & nụ',
    desc: 'Khoanh cháy 4 giờ, nụ cho thác khói.',
    icon: 'M12.8 19.6A2 2 0 1 0 14 16H2m15.5-8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2',
  },
  {
    id: 'dc',
    label: 'Dụng cụ xông',
    desc: 'Lư gốm, thác khói cho trầm miếng, nụ.',
    icon: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73zM12 22V12m-8.7-5 8.7 5 8.7-5',
  },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const isMobile = useIsMobile()

  // Đã bỏ mock data (2026-08-06) — gọi thẳng API thật. Bắt lỗi để 1 endpoint
  // hỏng không làm trắng cả trang chủ; phần đó chỉ hiện rỗng.
  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]))
    getCategories().then(setCategories).catch(() => setCategories([]))
    getPosts().then(setPosts).catch(() => setPosts([]))
  }, [])

  // Mobile có bố cục RIÊNG theo file "Tue Tram Mobile - Standalone.html"
  // (khác hẳn desktop, không chỉ là thu nhỏ lại). Dữ liệu vẫn tải một lần ở
  // đây rồi truyền xuống — chung service, chung route, chung theme.
  if (isMobile) {
    return <HomeMobile products={products} categories={categories} posts={posts} />
  }

  return (
    <div>
      {/* Hero — dựng lại 1:1 theo <section> đầu tiên trong mockup gốc
          "Tue Tram - Standalone.html": grid 1.1fr/0.9fr, padding 72px 5vw 56px,
          max-width 1240px, không dùng .container (khác padding/max-width mặc
          định của site). Mọi màu/spacing lấy trực tiếp từ CSS variables trong
          file đó, không suy đoán. */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr minmax(0, 0.9fr)',
          gap: 35,
          alignItems: 'center',
          padding: isMobile ? '32px 5vw 32px' : '72px 5vw 56px',
          maxWidth: 1240,
          margin: '0 auto',
        }}
      >
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
            Trầm hương Đà Lạt · Thôn Đất Làng, Xã Xuân Trường
          </span>
          <h1
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: isMobile ? 'clamp(30px, 8vw, 38px)' : 'clamp(38px, 4.6vw, 60px)',
              color: colors.bgCreamAlt,
              margin: '13px 0 13px',
              lineHeight: 1.12,
              letterSpacing: '-0.015em',
            }}
          >
            Một nén trầm thơm,
            <br />
            một niệm <span style={{ color: colors.accentPeach }}>an lành</span>
          </h1>
          {/* `white-space: nowrap` quanh tên để KHÔNG bao giờ ngắt dòng giữa
              "Lương y Phạm Ngọc Quỳnh" (trước đây bị tách "Lương y Phạm Ngọc"
              / "Quỳnh" xuống 2 dòng, đọc rất khó). `textWrap: balance` chia
              đều độ dài các dòng còn lại. */}
          <p style={{ fontSize: 17, color: colors.neutralTan, maxWidth: '46ch', margin: 0, textWrap: 'balance' }}>
            Nhang trầm và trầm hương tự nhiên do{' '}
            <span style={{ whiteSpace: 'nowrap' }}>Lương y Phạm Ngọc Quỳnh</span> tuyển chọn — sạch, thuần
            mộc, dâng hương cúng Phật và thanh lọc không gian sống.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 17, flexWrap: 'wrap' }}>
            <Link to="/san-pham">
              <Button
                type="primary"
                size="large"
                style={{
                  padding: '0 26px',
                  height: 46,
                  fontSize: 15,
                  fontFamily: fontFamily.display,
                  fontWeight: fontFamily.headingWeight,
                }}
              >
                Xem sản phẩm
              </Button>
            </Link>
            <Link to="/nguoi-sang-lap">
              <Button
                size="large"
                style={{
                  padding: '0 26px',
                  height: 46,
                  fontSize: 15,
                  fontFamily: fontFamily.display,
                  fontWeight: fontFamily.headingWeight,
                  color: colors.bgCreamAlt,
                  borderColor: colors.neutral600,
                  background: 'transparent',
                }}
              >
                Giới thiệu
              </Button>
            </Link>
          </div>
          <div style={{ marginTop: 35 }}>
            <TrustBadges />
          </div>
        </div>

        <div style={{ position: 'relative', justifySelf: isMobile ? 'stretch' : 'center', width: '100%', maxWidth: 420 }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              borderRadius: 42,
              overflow: 'hidden',
              background: colors.neutral800,
            }}
          >
            {/* Ảnh sản phẩm thật (nhang trầm hương do chủ shop cung cấp
                2026-08-06), thay placeholder "Ảnh đang cập nhật" cũ. */}
            <img
              src={heroImg}
              alt="Nhang trầm hương Tuệ Trầm"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: -22,
              bottom: 26,
              background: colors.neutralTanPale,
              color: colors.textDark2,
              borderRadius: 999,
              padding: '10px 18px',
              fontSize: 12.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.brandOrangeMid}
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            Trầm hương Đà Lạt
          </div>
        </div>
      </section>

      {/* "Tuệ Trầm cung cấp gì?" — dựng lại 1:1 theo section thứ 2 trong
          mockup: grid minmax(260px,0.9fr)/2fr, 4 thẻ dữ liệu tĩnh INTRO_CATS
          ở trên (label/desc/icon lấy nguyên văn từ file). */}
      <section
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '17px 5vw 35px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(260px, 0.9fr) 2fr',
          gap: 26,
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              color: colors.bgCreamAlt,
              fontSize: 28,
              margin: '0 0 8px',
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
            }}
          >
            Tuệ Trầm cung cấp gì?
          </h2>
          <p style={{ color: colors.neutralTan, fontSize: 14, margin: 0 }}>
            Bốn dòng vật phẩm trầm hương tự nhiên cho bàn thờ Phật, phòng thiền và không gian sống — tất
            cả se và tuyển tại Xuân Trường, Đà Lạt.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 13 }}>
          {INTRO_CATS.map((c) => (
            <Link
              key={c.id}
              to="/san-pham"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 8,
                textAlign: 'left',
                background: colors.neutral800,
                borderRadius: 28,
                padding: 17,
                color: colors.neutralTanLight,
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: colors.accent2_800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accent2_300,
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={c.icon} />
                </svg>
              </span>
              <span
                style={{
                  fontFamily: fontFamily.display,
                  fontWeight: fontFamily.headingWeight,
                  fontSize: 15,
                  color: colors.bgCreamAlt,
                }}
              >
                {c.label}
              </span>
              <span style={{ fontSize: 12.5, color: colors.neutralTan, lineHeight: 1.5 }}>{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Khối "Sản phẩm" — carousel cuộn ngang, dựng 1:1 theo mockup.
          Xem comment chi tiết trong ProductCarousel.jsx. */}
      <ProductCarousel products={products} categories={categories} />

      {/* Khối "Người sáng lập" — dựng lại 1:1 theo <section> áp chót của
          trang chủ trong mockup gốc (đọc trực tiếp ngày 2026-08-06):
            section: background var(--color-neutral-800); padding 72px 5vw
            inner : max-width 1100px; grid-template-columns auto 1fr;
                    gap var(--space-8)=35.2px; align-items center
            img   : 250x250; object-fit cover; object-position 50% 20%;
                    border-radius 50%; box-shadow var(--shadow-lg)
            tag   : bg neutral-900, color accent-2-300, 11px, .12em, uppercase
            h2    : neutral-100, clamp(26px,3vw,38px), margin var(--space-2) 0
            p     : neutral-400, max-width 60ch
          Ảnh dùng ảnh thật chủ shop gửi thay ảnh mẫu trong mockup. */}
      <section style={{ background: colors.neutral800, padding: isMobile ? '44px 5vw' : '72px 5vw' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
            gap: 35,
            alignItems: 'center',
            justifyItems: isMobile ? 'center' : 'stretch',
          }}
        >
          <img
            src={founderPreviewImg}
            alt="Lương y Phạm Ngọc Quỳnh"
            style={{
              width: isMobile ? 190 : 250,
              height: isMobile ? 190 : 250,
              objectFit: 'cover',
              objectPosition: '50% 20%',
              borderRadius: '50%',
              boxShadow: '0 12px 32px rgba(46, 43, 37, 0.22)',
            }}
          />
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: colors.textDark2,
                color: colors.accent2_300,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 12,
              }}
            >
              Người sáng lập
            </span>
            <h2
              style={{
                fontFamily: fontFamily.display,
                fontWeight: fontFamily.headingWeight,
                color: colors.bgCreamAlt,
                // Cỡ chữ giảm còn 26px (mockup để tới 38px) để câu trích nằm
                // TRỌN MỘT DÒNG trên desktop theo yêu cầu chủ dự án
                // 2026-08-07 — cột chữ ở đây rộng ~705px, câu 50 ký tự ở
                // 26px chiếm ~680px nên vừa khít. Mobile vẫn phải xuống dòng.
                fontSize: isMobile ? 'clamp(20px, 5.6vw, 25px)' : 26,
                margin: '8.8px 0',
                lineHeight: 1.25,
              }}
            >
              &quot;{founder.quote}&quot;
            </h2>
            <p style={{ color: colors.neutralTan, maxWidth: '60ch', margin: 0 }}>{founder.bioShort}</p>
            <Link to="/nguoi-sang-lap">
              <Button type="primary" style={{ marginTop: 8.8, fontFamily: fontFamily.display, fontWeight: fontFamily.headingWeight }}>
                Đọc câu chuyện của thầy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog preview — CHƯA trích xuất từ mockup, chỉ đổi màu cho đọc được. */}
      <section className="container" style={{ padding: '48px 0' }}>
        <SectionTitle eyebrow="Bài viết" title="Bài viết về trầm hương" />
        <Row gutter={[16, 16]}>
          {posts.map((p) => (
            <Col xs={24} md={12} key={p.slug}>
              <Link to={`/bai-viet/${p.slug}`}>
                <Card hoverable title={p.title}>
                  {p.excerpt}
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/bai-viet">
            <Button>Tất cả bài viết</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
