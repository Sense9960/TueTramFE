import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Form, Input, InputNumber, Select, Upload, Button, Alert, Divider, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { createProduct } from '../../services/productService'
import { uploadImage } from '../../services/uploadService'
import { PriceFields, SpecsField, UsageStepsField } from './ProductExtraFields'

const { TextArea } = Input

// Modal tạo sản phẩm mới — POST /products (schema ProductInput: name, price,
// category BẮT BUỘC; description / stock / images tuỳ chọn).
//
// Sửa 2026-08-06 theo phản hồi chủ dự án:
//   1) Trước đây modal KHÔNG có ô tải ảnh — phải tạo xong rồi mới thêm ảnh
//      trong Drawer. Nay upload ngay tại đây: đẩy file qua POST /upload/image
//      (Cloudinary) rồi gửi kèm mảng `images` trong payload tạo sản phẩm.
//   2) Ô "Danh mục" trống KHÔNG phải do bug select — do database backend chưa
//      có danh mục nào. Nay hiển thị cảnh báo + link sang trang Danh mục để
//      chủ shop biết phải tạo danh mục trước, thay vì thấy dropdown rỗng
//      không hiểu vì sao.
//
// Sửa 2026-08-07 theo swagger mới: thêm công tắc "Giá liên hệ"
// (priceOnRequest), bảng "Thông số" (specs) và danh sách "Cách dùng"
// (usageSteps) — dùng chung component trong ProductExtraFields.jsx.
export default function ProductFormModal({ open, onClose, categories = [], onCreated }) {
  const [form] = Form.useForm()
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      form.resetFields()
      setImages([])
    }
  }, [open, form])

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const res = await uploadImage(file)
      // Backend chưa chốt tên field trả về (api-docs chỉ ghi "trả về url") —
      // thử các tên phổ biến thay vì đoán cứng một cái.
      const url = res?.data?.url || res?.data?.secure_url || res?.data?.imageUrl || res?.url
      if (!url) throw new Error('Không đọc được URL ảnh từ phản hồi API')
      setImages((prev) => [...prev, url])
      message.success('Đã tải ảnh lên')
    } catch (err) {
      message.error(err?.response?.data?.message || err.message || 'Tải ảnh thất bại')
    } finally {
      setUploading(false)
    }
    return false // chặn Upload tự gửi request riêng của antd
  }

  const handleSubmit = async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      return // lỗi validate form, không phải lỗi API
    }
    setSubmitting(true)
    try {
      await createProduct({ ...values, ...(images.length ? { images } : {}) })
      message.success('Tạo sản phẩm thành công')
      onCreated?.()
      onClose()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Tạo sản phẩm thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      title="Thêm sản phẩm"
      okText="Tạo sản phẩm"
      cancelText="Huỷ"
      destroyOnClose
    >
      {categories.length === 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="Chưa có danh mục nào"
          description={
            <>
              Sản phẩm bắt buộc phải thuộc một danh mục. Hãy tạo danh mục trước tại{' '}
              <Link to="/admin/danh-muc" onClick={onClose}>
                Quản lý danh mục
              </Link>
              , rồi quay lại thêm sản phẩm.
            </>
          }
        />
      )}

      <Form form={form} layout="vertical" disabled={submitting}>
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
          <Input placeholder="Nhang trầm hương 3 tấc" />
        </Form.Item>

        <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
          <Select
            placeholder={categories.length ? 'Chọn danh mục' : 'Chưa có danh mục — tạo ở trang Danh mục trước'}
            disabled={categories.length === 0}
            options={categories.map((c) => ({ value: c._id || c.id, label: c.name }))}
          />
        </Form.Item>

        <PriceFields />

        <Form.Item name="stock" label="Tồn kho ban đầu" initialValue={0}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Ảnh sản phẩm">
          <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
            <Button icon={<UploadOutlined />} loading={uploading}>
              Tải ảnh lên
            </Button>
          </Upload>
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {images.map((url) => (
                <div key={url} style={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt=""
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                  />
                  <Button
                    size="small"
                    danger
                    type="text"
                    onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                    style={{ position: 'absolute', top: -6, right: -6, background: '#fff', borderRadius: '50%' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Mô tả sản phẩm..." />
        </Form.Item>

        <Divider style={{ margin: '4px 0 16px' }} />

        <SpecsField />
        <UsageStepsField />
      </Form>
    </Modal>
  )
}
