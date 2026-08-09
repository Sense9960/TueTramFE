import { useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { createCategory, updateCategory } from '../../services/categoryService'

const { TextArea } = Input

// Modal dùng chung cho tạo + sửa danh mục (CategoryInput trong api-docs: chỉ
// `name` bắt buộc). `category` = null -> chế độ tạo mới, có giá trị -> sửa.
export default function CategoryFormModal({ open, onClose, category, onSaved }) {
  const [form] = Form.useForm()
  const isEdit = Boolean(category)

  useEffect(() => {
    if (open) {
      form.resetFields()
      if (category) form.setFieldsValue(category)
    }
  }, [open, category, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (isEdit) {
        await updateCategory(category._id || category.id, values)
        message.success('Cập nhật danh mục thành công')
      } else {
        await createCategory(values)
        message.success('Tạo danh mục thành công')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Lưu danh mục thất bại')
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
      okText={isEdit ? 'Lưu' : 'Tạo danh mục'}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}>
          <Input placeholder="Trầm miếng" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name="image" label="URL ảnh (tuỳ chọn)">
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
