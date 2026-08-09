import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, message } from 'antd'
import { listCoupons, deleteCoupon } from '../../../services/couponService'
import { pickList } from '../../../utils/pickList'
import { formatVnd } from '../../../utils/format'
import CouponFormModal from '../../../components/admin/CouponFormModal'
import { AdminPageHeader, StatCards, DataTable, Pill, RowActions } from '../../../components/admin/ui'

// Màn "Quản lý mã voucher" — theo ảnh thiết kế Admin (2026-08-06).
// Dữ liệu thật từ GET /api/coupons (Admin). CRUD qua couponService.
const idOf = (c) => c._id || c.id

function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN')
}

// Backend chỉ có filter status Active/Inactive; "Hết hạn" là trạng thái suy ra
// tại FE từ endDate/usageLimit để hiển thị cho đúng nghĩa với chủ shop.
function statusOf(c) {
  if (c.endDate && new Date(c.endDate) < new Date()) return { label: 'Hết hạn', tone: 'neutral' }
  if (c.usageLimit && (c.usedCount ?? c.usageCount ?? 0) >= c.usageLimit) {
    return { label: 'Hết lượt', tone: 'neutral' }
  }
  if (c.status === 'Inactive') return { label: 'Tạm dừng', tone: 'neutral' }
  return { label: 'Đang chạy', tone: 'green' }
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listCoupons({ limit: 100 })
      setCoupons(pickList(res?.data, ['coupons', 'items', 'results']))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không tải được danh sách mã giảm giá')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // GET /coupons không có tham số `search` (xem api-docs) nên lọc tại FE.
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return coupons
    return coupons.filter(
      (c) => (c.code || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q),
    )
  }, [coupons, search])

  const stats = useMemo(
    () => ({
      total: coupons.length,
      running: coupons.filter((c) => statusOf(c).label === 'Đang chạy').length,
      used: coupons.reduce((s, c) => s + (c.usedCount ?? c.usageCount ?? 0), 0),
    }),
    [coupons],
  )

  const handleDelete = (c) => {
    Modal.confirm({
      title: 'Xoá mã giảm giá này?',
      content: c.code,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await deleteCoupon(idOf(c))
          message.success('Đã xoá mã giảm giá')
          load()
        } catch (err) {
          message.error(err?.response?.data?.message || 'Xoá mã giảm giá thất bại')
        }
      },
    })
  }

  const columns = [
    { key: 'code', title: 'Mã', render: (c) => <Pill tone="outline" mono>{c.code}</Pill> },
    {
      key: 'value',
      title: 'Giảm giá',
      render: (c) => (
        <strong style={{ fontWeight: 600 }}>
          {c.discountType === 'fixed' ? formatVnd(c.discountValue || 0) : `${c.discountValue ?? 0}%`}
        </strong>
      ),
    },
    {
      key: 'type',
      title: 'Loại',
      muted: true,
      render: (c) => (c.discountType === 'fixed' ? 'Số tiền cố định' : 'Phần trăm'),
    },
    {
      key: 'used',
      title: 'Lượt dùng',
      render: (c) => `${c.usedCount ?? c.usageCount ?? 0}${c.usageLimit ? ` / ${c.usageLimit}` : ''}`,
    },
    { key: 'end', title: 'Hạn dùng', muted: true, render: (c) => fmtDate(c.endDate) },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (c) => {
        const st = statusOf(c)
        return <Pill tone={st.tone}>{st.label}</Pill>
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (c) => (
        <RowActions
          onEdit={() => {
            setEditing(c)
            setModalOpen(true)
          }}
          onDelete={() => handleDelete(c)}
        />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Quản lý mã voucher"
        subtitle="Chương trình khuyến mãi và mã giảm giá."
        search={search}
        onSearchChange={setSearch}
        actionLabel="+ Thêm mới"
        onAction={() => {
          setEditing(null)
          setModalOpen(true)
        }}
      />

      <StatCards
        items={[
          { label: 'Tổng mã voucher', value: stats.total },
          { label: 'Đang chạy', value: stats.running },
          { label: 'Lượt sử dụng', value: stats.used },
        ]}
      />

      <DataTable columns={columns} rows={visible} rowKey={idOf} loading={loading} empty="Chưa có mã giảm giá nào." />

      <CouponFormModal open={modalOpen} onClose={() => setModalOpen(false)} coupon={editing} onSaved={load} />
    </div>
  )
}
