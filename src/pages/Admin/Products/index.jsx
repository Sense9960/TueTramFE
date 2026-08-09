import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, message } from 'antd'
import { adminListProducts, deleteProduct } from '../../../services/productService'
import { getCategories } from '../../../services/categoryService'
import { pickList } from '../../../utils/pickList'
import { formatVnd } from '../../../utils/format'
import { colors } from '../../../constants/theme'
import ProductFormModal from '../../../components/admin/ProductFormModal'
import ProductEditDrawer from '../../../components/admin/ProductEditDrawer'
import { AdminPageHeader, StatCards, DataTable, Pill, RowActions } from '../../../components/admin/ui'

// Màn "Quản lý sản phẩm" — theo ảnh thiết kế Admin (2026-08-06).
// Dữ liệu thật từ GET /api/products; thêm/sửa dùng lại ProductFormModal +
// ProductEditDrawer đã có (bao gồm cả sửa tồn kho, cờ nổi bật/mới, ảnh).
const idOf = (p) => p._id || p.id
const LOW_STOCK = 10

function categoryNameOf(category, categories) {
  if (category && typeof category === 'object') return category.name
  return categories.find((c) => c._id === category)?.name || '—'
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const loadCategories = useCallback(async () => {
    try {
      const res = await getCategories()
      setCategories(pickList(res?.data, ['categories', 'items']))
    } catch {
      // Không chặn trang nếu load danh mục lỗi — form chỉ hiển thị select rỗng
    }
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminListProducts({ search: search || undefined, limit: 100 })
      const list = pickList(res?.data, ['products', 'items'])
      setProducts(list)
      // Đồng bộ lại record đang mở trong ProductEditDrawer (nếu có) để ảnh/tồn
      // kho/flags mới cập nhật hiện luôn mà không cần đóng-mở lại drawer.
      setEditingProduct((prev) => {
        if (!prev) return prev
        const id = idOf(prev)
        return list.find((p) => idOf(p) === id) || prev
      })
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không tải được danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    const t = setTimeout(loadProducts, 350)
    return () => clearTimeout(t)
  }, [loadProducts])

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status !== 'Inactive').length,
      low: products.filter((p) => (p.stock ?? 0) <= LOW_STOCK).length,
    }),
    [products],
  )

  const handleDelete = (product) => {
    Modal.confirm({
      title: 'Xoá sản phẩm này?',
      content: `${product.name} — không thể hoàn tác.`,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await deleteProduct(idOf(product))
          message.success('Đã xoá sản phẩm')
          loadProducts()
        } catch (err) {
          message.error(err?.response?.data?.message || 'Xoá sản phẩm thất bại')
        }
      },
    })
  }

  const columns = [
    {
      key: 'name',
      title: 'Sản phẩm',
      wrap: true,
      render: (p) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.name}
              style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#fdf7ec',
                color: colors.brandOrangeMid,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {(p.name || '?').slice(0, 1).toUpperCase()}
            </span>
          )}
          <strong style={{ fontWeight: 600 }}>{p.name}</strong>
        </span>
      ),
    },
    { key: 'cat', title: 'Danh mục', muted: true, render: (p) => categoryNameOf(p.category, categories) },
    {
      key: 'price',
      title: 'Giá',
      // priceOnRequest = bán theo yêu cầu (swagger 2026-08-07) — hiện "Liên hệ"
      // thay vì 0đ, tránh hiểu nhầm là sản phẩm miễn phí.
      render: (p) => (
        <strong style={{ fontWeight: 600 }}>{p.priceOnRequest ? 'Liên hệ' : formatVnd(p.price || 0)}</strong>
      ),
    },
    { key: 'stock', title: 'Tồn kho', render: (p) => p.stock ?? 0 },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (p) => (p.status === 'Inactive' ? <Pill tone="neutral">Ẩn</Pill> : <Pill tone="green">Đang bán</Pill>),
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (p) => <RowActions onEdit={() => setEditingProduct(p)} onDelete={() => handleDelete(p)} />,
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Quản lý sản phẩm"
        subtitle="Danh mục sản phẩm, giá bán và tồn kho."
        search={search}
        onSearchChange={setSearch}
        actionLabel="+ Thêm mới"
        onAction={() => setCreateOpen(true)}
      />

      <StatCards
        items={[
          { label: 'Tổng sản phẩm', value: stats.total },
          { label: 'Đang bán', value: stats.active },
          { label: `Sắp hết hàng (≤${LOW_STOCK})`, value: stats.low },
        ]}
      />

      <DataTable columns={columns} rows={products} rowKey={idOf} loading={loading} empty="Chưa có sản phẩm nào." />

      <ProductFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        categories={categories}
        onCreated={loadProducts}
      />
      <ProductEditDrawer
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        categories={categories}
        onUpdated={loadProducts}
      />
    </div>
  )
}
