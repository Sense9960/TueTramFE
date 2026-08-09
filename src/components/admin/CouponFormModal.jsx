import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { createCoupon, updateCoupon } from '../../services/couponService'

// Form thêm/sửa mã giảm giá — field khớp đúng schema `CouponInput` trong
// api-docs (kiểm tra ngày 2026-08-06):
//   code*, description, discountType* ('percent'|'fixed'), discountValue*,
//   maxDiscount, minOrderValue, usageLimit, startDate, endDate
// KHÔNG thêm field ngoài schema để tránh backend từ chối request.
export default function CouponFormModal({ open, onClose, coupon, onSaved }) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(coupon)
  const discountType = Form.useWatch('discountType', form)

  useEffect(() => {
    if (!open) return
    if (coupon) {
      form.setFieldsValue({
        ...coupon,
        startDate: coupon.startDate ? dayjs(coupon.startDate) : undefined,
        endDate: coupon.endDate ? dayjs(coupon.endDate) : undefined,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ discountType: 'percent' })
    }
  }, [open, coupon, form])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      const payload = {
        ...values,
        code: values.code?.trim().toUpperCase(),
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
      }
      if (isEdit) {
        await updateCoupon(coupon._id || coupon.id, payload)
        message.success('Đã cập nhật mã giảm giá')
      } else {
        await createCoupon(payload)
        message.success('Đã tạo mã giảm giá')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Lưu mã giảm giá thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      title={isEdit ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
      okText="Lưu"
      cancelText="Huỷ"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={submitting}>
        <Form.Item name="code" label="Mã" rules={[{ required: true, message: 'Nhập mã giảm giá' }]}>
          <Input placeholder="TET2026" style={{ textTransform: 'uppercase' }} />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input placeholder="Giảm 10% dịp Tết" />
        </Form.Item>

        <Form.Item name="discountType" label="Loại giảm" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'percent', label: 'Phần trăm (%)' },
              { value: 'fixed', label: 'Số tiền cố định (₫)' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="discountValue"
          label={discountType === 'fixed' ? 'Số tiền giảm (₫)' : 'Phần trăm giảm (1–100)'}
          rules={[{ required: true, message: 'Nhập giá trị giảm' }]}
        >
          <InputNumber
            min={1}
            max={discountType === 'fixed' ? undefined : 100}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {discountType === 'percent' && (
          <Form.Item name="maxDiscount" label="Giảm tối đa (₫) — 0 = không giới hạn">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        )}
        <Form.Item name="minOrderValue" label="Giá trị đơn tối thiểu (₫)">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="usageLimit" label="Tổng lượt dùng (bỏ trống = không giới hạn)">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="startDate" label="Ngày bắt đầu">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="endDate" label="Hạn dùng">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
