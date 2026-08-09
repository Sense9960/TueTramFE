import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useCart } from '../../hooks/useCart'
import { submitOrder } from '../../services/orderService'
import { applyCoupon } from '../../services/couponService'
import { formatVnd } from '../../utils/format'
import { colors, fontFamily } from '../../constants/theme'
import useIsMobile from '../../hooks/useIsMobile'

// Trang /gio-hang — dựng lại 1:1 theo màn `isCart` trong file mockup gốc
// "Tue Tram - Standalone.html" (đọc trực tiếp markup + CSS ngày 2026-08-06).
//
// ĐIỂM QUAN TRỌNG dễ hiểu nhầm: trong mockup, giỏ hàng và thanh toán nằm
// CHUNG MỘT TRANG — KHÔNG có màn "Checkout" riêng. Bản cũ tách làm 2 trang
// (/gio-hang + /thanh-toan) nên bố cục lệch hẳn so với prototype. Cấu trúc
// đúng theo mockup:
//   wrapper : max-width 1100; padding 48px 5vw 80px
//   h1      : 40px, --color-neutral-100
//   [rỗng]  : icon giỏ 52px + "Giỏ hàng đang trống — như tâm đang tĩnh."
//             + nút "Thỉnh trầm ngay"
//   [có hàng]: danh sách dòng sản phẩm (thẻ kem NGANG: ảnh 72px bo 16px, tên
//             + đơn giá, bộ tăng/giảm bo tròn 999px, thành tiền canh phải
//             96px, nút X xoá 30px)
//             → grid 1.55fr / 1fr, gap --space-6:
//                 trái : 4 thẻ kem (Thông tin liên hệ / Địa chỉ giao hàng /
//                        Phương thức vận chuyển / Phương thức thanh toán)
//                 phải : thẻ "Chi tiết đơn hàng" position:sticky; top:96px —
//                        ô mã khuyến mãi, 3 dòng tạm tính/giảm giá/phí ship,
//                        hộp tổng cộng nền --color-neutral-900 + nút "ĐẶT
//                        HÀNG" viền sáng, dòng ghi chú in nghiêng cuối
// Vì vậy route /thanh-toan đã bỏ, chuyển hướng về /gio-hang (xem App.jsx).
//
// Giá trị lấy từ CSS variables trong mockup:
//   --space-3 13.2 / --space-4 17.6 / --space-6 26.4
//   --radius-md 16 / --radius-lg 28 / --color-divider = #201e1d 16%
const DIVIDER = 'rgba(32, 30, 29, 0.16)'
const SHIPPING_FEE = 30000
const PROVINCES = ['Lâm Đồng', 'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Tỉnh / thành khác']
const HOTLINE = import.meta.env.VITE_STORE_HOTLINE || '0947.569.879'
const HOTLINE_TEL = HOTLINE.replace(/[^\d+]/g, '')

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 13.2,
  padding: 26.4,
  borderRadius: 16,
  background: colors.neutralTanPale, // --color-surface
  color: colors.textDark2,
  boxShadow: '0 3px 10px rgba(46, 43, 37, 0.16)',
}
const h3Style = {
  margin: 0,
  fontSize: 19,
  fontFamily: fontFamily.display,
  fontWeight: fontFamily.headingWeight,
}
const inputStyle = {
  width: '100%',
  minHeight: 36,
  padding: '6px 10px',
  fontSize: 14,
  fontFamily: fontFamily.body,
  color: colors.textDark,
  background: colors.neutralTanPale,
  border: `1px solid ${DIVIDER}`,
  borderRadius: 16,
  boxSizing: 'border-box',
}

function Field({ label, span, children }) {
  return (
    <div style={{ gridColumn: span ? '1 / -1' : undefined }}>
      <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: 'rgba(32,30,29,0.7)' }}>{label}</label>
      {children}
    </div>
  )
}

function Radio({ checked, onChange, children }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          width: 16,
          height: 16,
          flex: 'none',
          borderRadius: '50%',
          border: `1.5px solid ${checked ? colors.brandOrange : DIVIDER}`,
          background: checked ? colors.brandOrange : 'transparent',
          boxShadow: checked ? `inset 0 0 0 4px ${colors.neutralTanPale}` : 'none',
        }}
      />
      {children}
    </label>
  )
}

export default function Cart() {
  const { items, cartCount, subtotal, setQty, removeItem, clearCart } = useCart()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: 'Lâm Đồng',
    district: '',
    ward: '',
    address: '',
    note: '',
  })
  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const [formErr, setFormErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const shipFee = shipping === 'pickup' ? 0 : SHIPPING_FEE
  const grandTotal = useMemo(() => Math.max(subtotal - discount, 0) + shipFee, [subtotal, discount, shipFee])

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) return
    try {
      // POST /coupons/apply — backend tự kiểm tra hạn dùng, lượt dùng và giá
      // trị đơn tối thiểu rồi trả về số tiền được giảm (chưa trừ lượt dùng).
      const res = await applyCoupon({ code, orderValue: subtotal })
      const value = Number(res?.data?.discount ?? res?.data?.discountAmount ?? 0)
      setDiscount(value)
      setCouponMsg(res?.message || `Đã áp mã ${code}`)
    } catch (err) {
      setDiscount(0)
      setCouponMsg(err?.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn')
    }
  }

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.phone.trim()) {
      setFormErr('Vui lòng nhập họ tên và số điện thoại để Tuệ Trầm gọi xác nhận đơn.')
      return
    }
    setFormErr('')
    setSubmitting(true)

    // Gộp địa chỉ thành 1 chuỗi như schema OrderCheckoutInput yêu cầu.
    const address = [form.address, form.ward, form.district, form.province].filter(Boolean).join(', ')

    try {
      await submitOrder({
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          ...(form.email ? { email: form.email } : {}),
          address,
        },
        // Giỏ hàng FE dùng `sku` làm khoá; backend nhận `productId`.
        items: items.map((i) => ({ productId: i.sku, quantity: i.qty })),
        paymentMethod: payment === 'transfer' ? 'SePay' : 'COD',
        ...(couponCode.trim() ? { couponCode: couponCode.trim().toUpperCase() } : {}),
        ...(form.note ? { note: form.note } : {}),
      })
      clearCart()
      message.success('Đã nhận đơn của bạn')
      navigate('/dat-hang-thanh-cong')
    } catch (err) {
      setFormErr(err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '28px 5vw 60px' : '48px 5vw 80px' }}>
      <h1
        style={{
          fontFamily: fontFamily.display,
          fontWeight: fontFamily.headingWeight,
          color: colors.bgCreamAlt,
          fontSize: isMobile ? 30 : 40,
          margin: 0,
        }}
      >
        Giỏ hàng
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: colors.neutralTan }}>
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.neutral600}
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto 16px', display: 'block' }}
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <p style={{ fontSize: 16 }}>Giỏ hàng đang trống — như tâm đang tĩnh.</p>
          <Link to="/san-pham">
            <button
              type="button"
              style={{
                marginTop: 8.8,
                cursor: 'pointer',
                border: 'none',
                background: colors.brandOrange,
                color: '#f5ead8',
                borderRadius: 999,
                padding: '10px 22px',
                fontFamily: fontFamily.display,
                fontWeight: fontFamily.headingWeight,
                fontSize: 14,
              }}
            >
              Thỉnh trầm ngay
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Danh sách dòng sản phẩm trong giỏ */}
          <div style={{ marginTop: 17.6, display: 'flex', flexDirection: 'column', gap: 13.2 }}>
            {items.map((it) => (
              <div
                key={it.sku}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13.2,
                  padding: 13.2,
                  borderRadius: 16,
                  background: colors.neutralTanPale,
                  color: colors.textDark2,
                  boxShadow: '0 1px 2px rgba(46, 43, 37, 0.14)',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                }}
              >
                {it.image ? (
                  <img
                    src={it.image}
                    alt={it.name}
                    loading="lazy"
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16, flex: 'none' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 16,
                      flex: 'none',
                      background: colors.neutralTanLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.neutral600,
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: fontFamily.display, fontWeight: fontFamily.headingWeight, fontSize: 15.5 }}>
                    {it.name}
                  </div>
                  <div style={{ fontSize: 12, color: colors.neutral600 }}>{formatVnd(it.price)} / phần</div>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    border: `1px solid ${DIVIDER}`,
                    borderRadius: 999,
                    padding: 2,
                    flex: 'none',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQty(it.sku, it.qty - 1)}
                    aria-label="Giảm số lượng"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.neutral800,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span style={{ minWidth: 26, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{it.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(it.sku, it.qty + 1)}
                    aria-label="Tăng số lượng"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.neutral800,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>

                <span
                  style={{
                    minWidth: 96,
                    textAlign: 'right',
                    fontWeight: 700,
                    fontSize: 15,
                    color: colors.brandOrangeDark,
                    flex: 'none',
                  }}
                >
                  {formatVnd(it.price * it.qty)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(it.sku)}
                  title="Xoá"
                  aria-label={`Xoá ${it.name}`}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.neutral500,
                    flex: 'none',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Cột trái: 4 thẻ form — Cột phải: chi tiết đơn hàng (sticky) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr',
              gap: 26.4,
              alignItems: 'start',
              marginTop: 26.4,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 17.6 }}>
              <div style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 13.2,
                    flexWrap: 'wrap',
                  }}
                >
                  <h3 style={h3Style}>Thông tin liên hệ của bạn</h3>
                  <span style={{ fontSize: 12.5, color: colors.neutral600 }}>
                    Cần hỗ trợ?{' '}
                    <a href={`tel:${HOTLINE_TEL}`} style={{ color: colors.brandOrangeDark }}>
                      {HOTLINE}
                    </a>
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 13.2 }}>
                  <Field label="Họ và tên *">
                    <input style={inputStyle} placeholder="Nguyễn Văn An" value={form.fullName} onChange={set('fullName')} />
                  </Field>
                  <Field label="Số điện thoại *">
                    <input style={inputStyle} placeholder="09xx xxx xxx" value={form.phone} onChange={set('phone')} />
                  </Field>
                  <Field label="Email (không bắt buộc)" span>
                    <input style={inputStyle} placeholder="ban@email.com" value={form.email} onChange={set('email')} />
                  </Field>
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={h3Style}>Địa chỉ giao hàng</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 13.2 }}>
                  <Field label="Tỉnh / Thành phố">
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.province} onChange={set('province')}>
                      {PROVINCES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Quận / Huyện">
                    <input style={inputStyle} placeholder="Quận / huyện" value={form.district} onChange={set('district')} />
                  </Field>
                  <Field label="Phường / Xã">
                    <input style={inputStyle} placeholder="Phường / xã" value={form.ward} onChange={set('ward')} />
                  </Field>
                  <Field label="Số nhà, đường, khu vực">
                    <input style={inputStyle} placeholder="Số nhà, tên đường" value={form.address} onChange={set('address')} />
                  </Field>
                  <Field label="Ghi chú" span>
                    <input
                      style={inputStyle}
                      placeholder="Ví dụ: giao giờ hành chính…"
                      value={form.note}
                      onChange={set('note')}
                    />
                  </Field>
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={h3Style}>Phương thức vận chuyển</h3>
                <Radio checked={shipping === 'standard'} onChange={() => setShipping('standard')}>
                  Giao hàng tiêu chuẩn (2–4 ngày) — 30.000₫
                </Radio>
                <Radio checked={shipping === 'pickup'} onChange={() => setShipping('pickup')}>
                  Nhận tại phòng thuốc Tâm Không Đường, Đà Lạt — miễn phí
                </Radio>
              </div>

              <div style={cardStyle}>
                <h3 style={h3Style}>Phương thức thanh toán</h3>
                <Radio checked={payment === 'cod'} onChange={() => setPayment('cod')}>
                  Thanh toán khi giao hàng (COD)
                </Radio>
                <Radio checked={payment === 'transfer'} onChange={() => setPayment('transfer')}>
                  Chuyển khoản (hướng dẫn khi gọi xác nhận)
                </Radio>
              </div>
            </div>

            <div style={{ ...cardStyle, position: isMobile ? 'static' : 'sticky', top: 96 }}>
              <h3 style={h3Style}>Chi tiết đơn hàng</h3>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    marginBottom: 5,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(32,30,29,0.7)',
                  }}
                >
                  Nhập mã khuyến mãi
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    style={inputStyle}
                    placeholder="TUETRAM10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    style={{
                      flex: 'none',
                      cursor: 'pointer',
                      background: 'transparent',
                      border: `1px solid ${DIVIDER}`,
                      borderRadius: 999,
                      padding: '8.8px 18px',
                      fontFamily: fontFamily.display,
                      fontWeight: fontFamily.headingWeight,
                      fontSize: 14,
                      color: colors.textDark,
                    }}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
              {couponMsg && <div style={{ fontSize: 12, color: colors.accent2_800 }}>{couponMsg}</div>}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  borderTop: `1px solid ${DIVIDER}`,
                  paddingTop: 13.2,
                  fontSize: 14,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tạm tính ({cartCount} món)</span>
                  <span style={{ fontWeight: 600 }}>{formatVnd(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Giảm giá</span>
                  <span style={{ fontWeight: 600, color: colors.accent2_700 }}>−{formatVnd(discount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ fontWeight: 600 }}>{shipFee === 0 ? 'Miễn phí' : formatVnd(shipFee)}</span>
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: colors.accent2_800,
                  background: colors.accent2_100,
                  borderRadius: 16,
                  padding: '9px 14px',
                }}
              >
                {shipping === 'pickup'
                  ? 'Nhận trực tiếp tại phòng thuốc — không mất phí giao hàng.'
                  : 'Giao từ Đà Lạt, thường nhận sau 2–4 ngày làm việc.'}
              </div>

              {formErr && (
                <div
                  style={{
                    fontSize: 12.5,
                    color: colors.brandOrangeDeep,
                    background: colors.bgWarm,
                    borderRadius: 16,
                    padding: '9px 14px',
                  }}
                >
                  {formErr}
                </div>
              )}

              <div
                style={{
                  background: colors.textDark2,
                  color: colors.bgCreamAlt,
                  borderRadius: 28,
                  padding: 17.6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 13.2,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10.5,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: colors.neutralTan,
                    }}
                  >
                    Tổng cộng
                  </div>
                  <div style={{ fontSize: 23, fontWeight: 700, color: colors.accentPeachLight }}>
                    {formatVnd(grandTotal)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    background: 'transparent',
                    border: `1.5px solid ${colors.bgCreamAlt}`,
                    color: colors.bgCreamAlt,
                    borderRadius: 999,
                    padding: '13px 24px',
                    fontSize: 13,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontFamily: fontFamily.body,
                    opacity: submitting ? 0.6 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {submitting ? 'Đang gửi...' : 'Đặt hàng'}
                </button>
              </div>

              <p style={{ margin: 0, fontSize: 11.5, color: colors.neutral600, fontStyle: 'italic' }}>
                * Nhấn Đặt hàng nghĩa là bạn đồng ý để Tuệ Trầm gọi xác nhận đơn. Nhận trực tiếp tại: Thôn Đất
                Làng, Xã Xuân Trường, Đà Lạt — mở cửa 8:00–17:00.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
