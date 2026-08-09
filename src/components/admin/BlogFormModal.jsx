import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { createPost, updatePost } from '../../services/blogService'
import { uploadImage } from '../../services/uploadService'

const { TextArea } = Input

// Modal dùng chung tạo + sửa bài viết.
//
// Schema BlogPostInput (swagger cập nhật 2026-08-07): `title` + `content` bắt
// buộc; `excerpt`, `status` tuỳ chọn; và HAI loại ảnh TÁCH RIÊNG:
//   - `thumbnail` (chuỗi)  : ảnh nền/hero hiện NGOÀI đầu bài — dùng cho thẻ ở
//                            trang danh sách /bai-viet.
//   - `images`   (mảng)    : các ảnh chèn BÊN TRONG nội dung bài viết.
// Trước bản cập nhật này form chỉ có `thumbnail`.
export default function BlogFormModal({ open, onClose, post, onSaved }) {
  const [form] = Form.useForm()
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingContent, setUploadingContent] = useState(false)
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(post)

  useEffect(() => {
    if (open) {
      form.resetFields()
      if (post) {
        form.setFieldsValue(post)
        setImages(Array.isArray(post.images) ? post.images : [])
      } else {
        setImages([])
      }
    }
  }, [open, post, form])

  /** Đọc URL ảnh từ phản hồi upload — backend chưa chốt tên field. */
  const urlFromUploadRes = (res) =>
    res?.data?.url || res?.data?.imageUrl || res?.data?.secure_url || res?.url

  const handleThumbnailUpload = async ({ file }) => {
    setUploadingThumb(true)
    try {
      const url = urlFromUploadRes(await uploadImage(file))
      if (!url) throw new Error('Không lấy được URL ảnh sau khi upload')
      form.setFieldsValue({ thumbnail: url })
      message.success('Đã tải ảnh nền lên')
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || 'Upload ảnh thất bại')
    } finally {
      setUploadingThumb(false)
    }
  }

  const handleContentImageUpload = async ({ file }) => {
    setUploadingContent(true)
    try {
      const url = urlFromUploadRes(await uploadImage(file))
      if (!url) throw new Error('Không lấy được URL ảnh sau khi upload')
      setImages((prev) => [...prev, url])
      message.success('Đã thêm ảnh vào bài viết')
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || 'Upload ảnh thất bại')
    } finally {
      setUploadingContent(false)
    }
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
      const payload = { ...values, images }
      if (isEdit) {
        await updatePost(post._id || post.id, payload)
        message.success('Cập nhật bài viết thành công')
      } else {
        await createPost(payload)
        message.success('Tạo bài viết thành công')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Lưu bài viết thất bại')
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
      title={isEdit ? 'Sửa bài viết' : 'Thêm bài viết'}
      okText={isEdit ? 'Lưu' : 'Tạo bài viết'}
      cancelText="Huỷ"
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" disabled={submitting}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Cách chọn trầm hương chuẩn" />
        </Form.Item>
        <Form.Item name="excerpt" label="Mô tả ngắn">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
          <TextArea rows={8} />
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label="Ảnh nền / ảnh đầu bài (URL)"
          extra="Ảnh này hiện ngoài đầu bài và trên thẻ ở trang danh sách bài viết."
        >
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item>
          <Upload showUploadList={false} customRequest={handleThumbnailUpload} accept="image/*">
            <Button icon={<UploadOutlined />} loading={uploadingThumb}>
              Tải ảnh nền lên
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Ảnh chèn trong nội dung" extra="Các ảnh minh hoạ nằm bên trong bài viết.">
          <Upload showUploadList={false} customRequest={handleContentImageUpload} accept="image/*">
            <Button icon={<UploadOutlined />} loading={uploadingContent}>
              Thêm ảnh vào bài
            </Button>
          </Upload>
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {images.map((url) => (
                <div key={url} style={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt=""
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, display: 'block' }}
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

        <Form.Item name="status" label="Trạng thái" initialValue="Draft">
          <Select
            options={[
              { value: 'Draft', label: 'Bản nháp' },
              { value: 'Published', label: 'Đã đăng' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
