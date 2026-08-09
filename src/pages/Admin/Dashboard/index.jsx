import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { message } from 'antd'
import { listOrders, ORDER_STATUS } from '../../../services/orderService'
import { pickList } from '../../../utils/pickList'
import { formatVnd } from '../../../utils/format'
import { colors, fontFamily } from '../../../constants/theme'
import { StatCards, Pill, ADMIN_SURFACE, ADMIN_SURFACE_SOFT, ADMIN_BORDER } from '../../../components/admin/ui'

// Màn "Tổng quan doanh thu" — dựng theo ảnh thiết kế Admin chủ dự án gửi
// ngày 2026-08-06.
//
// LƯU Ý VỀ DỮ LIỆU (quan trọng, đừng hiểu nhầm là số ảo): backend CHƯA có
// endpoint thống kê riêng (api-docs không có /admin/stats hay /orders/summary).
// Nên mọi con số ở đây được TÍNH TẠI FE từ danh sách đơn hàng THẬT lấy qua
// GET /orders (Admin) với limit 200. Khi shop có nhiều hơn 200 đơn, cần
// backend bổ sung endpoint thống kê thay vì nâng limit — xem CLAUDE.md mục 8.
const MONTHS_SHOWN = 6

// Backend chưa chốt tên field tổng tiền / ngày tạo trong response đơn hàng
// (api-docs chỉ mô tả input, không mô tả schema Order trả về) — thử lần lượt
// các tên phổ biến thay vì đoán bừa một cái.
function orderTotal(o) {
  return Number(o.totalAmount ?? o.total ?? o.finalAmount ?? 0)
}
function orderDate(o) {
  return new Date(o.createdAt || o.orderDate || o.updatedAt || Date.now())
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    listOrders({ limit: 200 })
      .then((res) => {
        if (alive) setOrders(pickList(res?.data, ['orders', 'items', 'results']))
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || 'Không tải được danh sách đơn hàng')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    // Doanh thu chỉ tính đơn KHÔNG bị huỷ.
    const valid = orders.filter((o) => o.status !== 'cancelled')
    const revenue = valid.reduce((sum, o) => sum + orderTotal(o), 0)

    const now = new Date()
    const thisMonth = orders.filter((o) => {
      const d = orderDate(o)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const pending = orders.filter((o) => o.status === 'pending').length
    const avg = valid.length ? Math.round(revenue / valid.length) : 0

    return { revenue, thisMonth, pending, avg }
  }, [orders])

  // Doanh thu 6 tháng gần nhất cho biểu đồ cột
  const monthly = useMemo(() => {
    const now = new Date()
    const buckets = []
    for (let i = MONTHS_SHOWN - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: `T${d.getMonth() + 1}`, value: 0 })
    }
    orders
      .filter((o) => o.status !== 'cancelled')
      .forEach((o) => {
        const d = orderDate(o)
        const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`)
        if (b) b.value += orderTotal(o)
      })
    const max = Math.max(...buckets.map((b) => b.value), 1)
    return { buckets, max }
  }, [orders])

  const recent = useMemo(() => [...orders].sort((a, b) => orderDate(b) - orderDate(a)).slice(0, 5), [orders])

  return (
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
        Tổng quan doanh thu
      </h1>
      <p style={{ margin: '4px 0 20px', fontSize: 14, color: colors.neutral700 }}>
        Doanh thu, đơn hàng và hoạt động gần đây của cửa hàng.
      </p>

      <StatCards
        items={[
          { label: 'Tổng doanh thu', value: loading ? '—' : formatVnd(stats.revenue) },
          { label: 'Đơn hàng tháng này', value: loading ? '—' : stats.thisMonth },
          { label: 'Đơn chờ xử lý', value: loading ? '—' : stats.pending },
          { label: 'Giá trị đơn TB', value: loading ? '—' : formatVnd(stats.avg) },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {/* Biểu đồ cột doanh thu theo tháng */}
        <section style={{ background: ADMIN_SURFACE, borderRadius: 22, padding: '18px 22px 14px' }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.brandOrangeMid,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            Doanh thu theo tháng
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 190 }}>
            {monthly.buckets.map((b) => (
              <div
                key={b.key}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}
              >
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div
                    title={formatVnd(b.value)}
                    style={{
                      width: '100%',
                      height: `${Math.max((b.value / monthly.max) * 100, 2)}%`,
                      background: colors.brandOrangeLight,
                      borderRadius: '8px 8px 0 0',
                    }}
                  />
                </div>
                <span style={{ fontSize: 12.5, color: colors.neutral700 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Danh sách đơn hàng gần đây */}
        <section style={{ background: ADMIN_SURFACE_SOFT, borderRadius: 22, padding: '18px 0 6px' }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.brandOrangeMid,
              fontWeight: 600,
              padding: '0 22px 12px',
            }}
          >
            Đơn hàng gần đây
          </div>
          {!loading && recent.length === 0 && (
            <div style={{ padding: '18px 22px', color: colors.neutral700, fontSize: 14 }}>Chưa có đơn hàng nào.</div>
          )}
          {recent.map((o) => {
            const st = ORDER_STATUS[o.status] || { label: o.status || '—', tone: 'neutral' }
            return (
              <div
                key={o._id || o.id || o.orderNumber}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '13px 22px',
                  borderTop: `1px solid ${ADMIN_BORDER}`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>#{o.orderNumber || o._id || o.id}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: colors.neutral700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {o.customer?.fullName || o.customerName || '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{formatVnd(orderTotal(o))}</div>
                  <div style={{ marginTop: 4 }}>
                    <Pill tone={st.tone}>{st.label}</Pill>
                  </div>
                </div>
              </div>
            )
          })}
          <div style={{ padding: '12px 22px 6px' }}>
            <Link to="/admin/don-hang" style={{ fontSize: 13, color: colors.brandOrangeDark }}>
              Xem tất cả đơn hàng →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
