import { useCallback, useEffect, useMemo, useState } from 'react'
import { Dropdown, message } from 'antd'
import { listOrders, updateOrderStatus, ORDER_STATUS } from '../../../services/orderService'
import { pickList } from '../../../utils/pickList'
import { formatVnd } from '../../../utils/format'
import { colors } from '../../../constants/theme'
import { AdminPageHeader, StatCards, DataTable, Pill } from '../../../components/admin/ui'

// Màn "Quản lý đơn hàng" — theo ảnh thiết kế Admin (2026-08-06).
// Dữ liệu thật từ GET /api/orders (Admin). Đổi trạng thái qua
// PATCH /api/orders/{id}/status.
//
// Backend không mô tả schema Order trả về trong api-docs (chỉ mô tả input),
// nên các field hiển thị đều đọc "thử vài tên phổ biến" thay vì cứng 1 tên;
// nếu backend chốt tên khác, sửa tập trung ở 4 helper dưới đây là đủ.
const idOf = (o) => o._id || o.id || o.orderNumber
const totalOf = (o) => Number(o.totalAmount ?? o.total ?? o.finalAmount ?? 0)
const customerOf = (o) => o.customer?.fullName || o.customerName || o.user?.fullName || '—'
const itemsOf = (o) => {
  const items = o.items || o.orderItems || []
  if (!items.length) return '—'
  const first = items[0]
  const name = first.product?.name || first.name || first.productName || 'Sản phẩm'
  return items.length > 1 ? `${name} +${items.length - 1}` : name
}

function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN')
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listOrders({ search: search || undefined, limit: 100 })
      setOrders(pickList(res?.data, ['orders', 'items', 'results']))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không tải được danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(load, 350)
    return () => clearTimeout(t)
  }, [load])

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      revenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + totalOf(o), 0),
    }),
    [orders],
  )

  const changeStatus = async (order, status) => {
    try {
      await updateOrderStatus(idOf(order), status)
      message.success(`Đã chuyển đơn sang "${ORDER_STATUS[status].label}"`)
      load()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Cập nhật trạng thái thất bại')
    }
  }

  const columns = [
    {
      key: 'code',
      title: 'Mã đơn',
      render: (o) => <strong style={{ fontWeight: 600 }}>#{o.orderNumber || idOf(o)}</strong>,
    },
    { key: 'customer', title: 'Khách hàng', render: customerOf },
    { key: 'items', title: 'Sản phẩm', muted: true, render: itemsOf },
    { key: 'total', title: 'Tổng tiền', render: (o) => <strong style={{ fontWeight: 600 }}>{formatVnd(totalOf(o))}</strong> },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (o) => {
        const st = ORDER_STATUS[o.status] || { label: o.status || '—', tone: 'neutral' }
        return (
          // Bấm vào nhãn để đổi trạng thái đơn (PATCH /orders/{id}/status).
          // Backend tự chặn bước nhảy không hợp lệ nên FE liệt kê đủ lựa chọn
          // và hiển thị lỗi trả về nếu chuyển sai luồng.
          <Dropdown
            trigger={['click']}
            menu={{
              items: Object.entries(ORDER_STATUS).map(([value, meta]) => ({
                key: value,
                label: meta.label,
                disabled: value === o.status,
                onClick: () => changeStatus(o, value),
              })),
            }}
          >
            <span style={{ cursor: 'pointer' }}>
              <Pill tone={st.tone}>{st.label}</Pill>
            </span>
          </Dropdown>
        )
      },
    },
    { key: 'date', title: 'Ngày đặt', muted: true, render: (o) => fmtDate(o.createdAt || o.orderDate) },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Quản lý đơn hàng"
        subtitle="Theo dõi và cập nhật trạng thái các đơn hàng."
        search={search}
        onSearchChange={setSearch}
      />

      <StatCards
        items={[
          { label: 'Tổng đơn hàng', value: stats.total },
          { label: 'Chờ xử lý', value: stats.pending },
          { label: 'Doanh thu', value: formatVnd(stats.revenue) },
        ]}
      />

      <DataTable columns={columns} rows={orders} rowKey={idOf} loading={loading} empty="Chưa có đơn hàng nào." />

      <p style={{ marginTop: 14, fontSize: 12.5, color: colors.neutral700 }}>
        Bấm vào nhãn trạng thái để chuyển đơn: chờ xử lý → đã xác nhận → đang giao → hoàn thành. Chỉ huỷ được đơn
        đang ở trạng thái chờ xử lý hoặc đã xác nhận.
      </p>
    </div>
  )
}
