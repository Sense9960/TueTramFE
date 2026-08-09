import { useEffect, useState } from 'react'
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Switch,
  Divider,
  Space,
  Popconfirm,
  Upload,
  message,
} from 'antd'
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  updateProduct,
  updateProductStock,
  updateProductFlags,
  addProductImage,
  removeProductImage,
} from '../../services/productService'
import { uploadImage } from '../../services/uploadService'
import { formatVnd } from '../../utils/format'
import { PriceFields, SpecsField, UsageStepsField } from './ProductExtraFields'

const { TextArea } = Input

function categoryIdOf(category) {
  return typeof category === 'object' && category ? category._id : category
}

// Drawer sửa sản phẩm — API tách thao tác sản phẩm thành nhiều endpoint riêng
// (PUT /products/:id cho thông tin cơ bản, PATCH /stock, PATCH /flags, POST +
// DELETE /images), nên drawer này chia thành từng khối lưu độc lập thay vì 1
// form submit duy nhất, khớp đúng với cách backend chia nhỏ API.
export default function ProductEditDrawer({ open, onClose, product, categories, onUpdated }) {
  const [form] = Form.useForm()
  const [savingInfo, setSavingInfo] = useState(false)
  const [stock, setStock] = useState(0)
  const [savingStock, setSavingStock] = useState(false)
  const [uploading, setUploading] = useState(false)

  const productId = product?._id || product?.id

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        category: categoryIdOf(product.category),
        status: product.status || 'Active',
        // Field theo swagger cập nhật 2026-08-07 — xem ProductExtraFields.jsx
        priceOnRequest: Boolean(product.priceOnRequest),
        specs: Array.isArray(product.specs) ? product.specs : [],
        usageSteps: Array.isArray(product.usageSteps) ? product.usageSteps : [],
      })
      setStock(product.stock ?? 0)
    }
  }, [product, form])

  if (!product) return null

  const handleSaveInfo = async () => {
    setSavingInfo(true)
    try {
      const values = await form.validateFields()
      await updateProduct(productId, values)
      message.success('Cập nhật sản phẩm thành công')
      onUpdated?.()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setSavingInfo(false)
    }
  }

  const handleSaveStock = async () => {
    setSavingStock(true)
    try {
      await updateProductStock(productId, stock)
      message.success('Cập nhật tồn kho thành công')
      onUpdated?.()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Cập nhật tồn kho thất bại')
    } finally {
      setSavingStock(false)
    }
  }

  const handleToggleFlag = async (key, checked) => {
    try {
      await updateProductFlags(productId, { [key]: checked })
      message.success('Đã cập nhật')
      onUpdated?.()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const handleUpload = async ({ file }) => {
    setUploading(true)
    try {
      const uploadRes = await uploadImage(file)
      const imageUrl = uploadRes?.data?.url || uploadRes?.data?.imageUrl || uploadRes?.data?.secure_url
      if (!imageUrl) throw new Error('Không lấy được URL ảnh sau khi upload')
      await addProductImage(productId, imageUrl)
      message.success('Thêm ảnh thành công')
      onUpdated?.()
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || 'Upload ảnh thất bại')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageUrl) => {
    try {
      await removeProductImage(productId, imageUrl)
      message.success('Đã xoá ảnh')
      onUpdated?.()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Xoá ảnh thất bại')
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={`Sửa sản phẩm: ${product.name || ''}`} width={480} destroyOnClose>
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
          <Select options={categories.map((c) => ({ value: c._id, label: c.name }))} />
        </Form.Item>
        <PriceFields />
        <Form.Item name="status" label="Trạng thái">
          <Select
            options={[
              { value: 'Active', label: 'Đang bán' },
              { value: 'Inactive', label: 'Ngừng bán' },
            ]}
          />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} />
        </Form.Item>
        <SpecsField />
        <UsageStepsField />
        <Button type="primary" onClick={handleSaveInfo} loading={savingInfo} block>
          Lưu thông tin
        </Button>
      </Form>

      <Divider />

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Tồn kho</div>
        <Space>
          <InputNumber min={0} value={stock} onChange={(v) => setStock(v ?? 0)} />
          <Button onClick={handleSaveStock} loading={savingStock}>
            Cập nhật tồn kho
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Đánh dấu</div>
        <Space size="large">
          <Space>
            <Switch defaultChecked={Boolean(product.isFeatured)} onChange={(c) => handleToggleFlag('isFeatured', c)} />
            <span>Nổi bật</span>
          </Space>
          <Space>
            <Switch defaultChecked={Boolean(product.isNew)} onChange={(c) => handleToggleFlag('isNew', c)} />
            <span>Sản phẩm mới</span>
          </Space>
        </Space>
      </div>

      <Divider />

      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Ảnh sản phẩm</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {(product.images || []).map((url) => (
            <div key={url} style={{ position: 'relative', width: 72, height: 72 }}>
              <img
                src={url}
                alt="Ảnh sản phẩm"
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
              />
              <Popconfirm title="Xoá ảnh này?" onConfirm={() => handleRemoveImage(url)} okText="Xoá" cancelText="Huỷ">
                <Button
                  danger
                  size="small"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  style={{ position: 'absolute', top: -8, right: -8 }}
                />
              </Popconfirm>
            </div>
          ))}
          <Upload showUploadList={false} customRequest={handleUpload} accept="image/*">
            <div
              style={{
                width: 72,
                height: 72,
                border: '1px dashed #d9d9d9',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            </div>
          </Upload>
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>
          Giá hiện tại: {product.priceOnRequest ? 'Liên hệ (bán theo yêu cầu)' : formatVnd(product.price || 0)}
        </div>
      </div>
    </Drawer>
  )
}
