import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Row, Col, Tabs } from 'antd'
import SectionTitle from '../../components/common/SectionTitle'
import ProductCard from '../../components/product/ProductCard'
import ProductListMobile from './ProductListMobile'
import useIsMobile from '../../hooks/useIsMobile'
import { getProducts, getCategories } from '../../services/productService'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const isMobile = useIsMobile()
  // Danh mục đang chọn lưu trên URL (?danh-muc=<id>) để mega-menu ở Header
  // và link chia sẻ đều mở đúng danh mục — không giữ trong state cục bộ.
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCat = searchParams.get('danh-muc') || 'all'

  // Đã bỏ mock data (2026-08-06) — gọi API thật, bắt lỗi để không trắng trang.
  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]))
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const setActiveCat = (key) => {
    if (key === 'all') setSearchParams({}, { replace: true })
    else setSearchParams({ 'danh-muc': key }, { replace: true })
  }

  const filtered = activeCat === 'all' ? products : products.filter((p) => p.category === activeCat)

  // Mobile có bố cục riêng theo mockup mobile (lưới 2 cột, nút danh mục bo
  // tròn) — vẫn dùng chung dữ liệu/state đã tải ở trên, chỉ khác cách hiển thị.
  if (isMobile) {
    return (
      <ProductListMobile
        products={filtered}
        categories={categories}
        activeCat={activeCat}
        onPickCat={setActiveCat}
      />
    )
  }

  return (
    <div className="container" style={{ padding: '32px 0 48px' }}>
      <SectionTitle eyebrow="Sản phẩm" title="Sản phẩm" align="left" />
      <Tabs
        activeKey={activeCat}
        onChange={setActiveCat}
        items={[{ key: 'all', label: 'Tất cả' }, ...categories.map((c) => ({ key: c.id, label: c.title }))]}
      />
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {filtered.map((p) => (
          <Col xs={12} md={6} key={p.sku}>
            <ProductCard product={p} />
          </Col>
        ))}
      </Row>
    </div>
  )
}
