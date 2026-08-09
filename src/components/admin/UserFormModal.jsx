import { useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { createUser, updateUser } from '../../services/userService'

// Modal dùng chung tạo + sửa tài khoản (Admin). Tạo mới cần đủ
// username/email/password/fullName (AdminCreateUserInput); sửa dùng
// AdminUpdateUserInput — không có username/email (đổi sau bằng field khác
// nếu backend hỗ trợ), password để trống nghĩa là không đổi mật khẩu.
export default function UserFormModal({ open, onClose, user, onSaved }) {
  const [form] = Form.useForm()
  const isEdit = Boolean(user)

  useEffect(() => {
    if (open) {
      form.resetFields()
      if (user) {
        form.setFieldsValue({
          fullName: user.fullName,
          phone: user.phone,
          address: user.address,
          role: user.role,
        })
      }
    }
  }, [open, user, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (isEdit) {
        // Không gửi password lên nếu để trống -> giữ nguyên mật khẩu cũ.
        const payload = { ...values }
        if (!payload.password) delete payload.password
        await updateUser(user._id || user.id, payload)
        message.success('Cập nhật tài khoản thành công')
      } else {
        await createUser(values)
        message.success('Tạo tài khoản thành công')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Lưu tài khoản thất bại')
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      title={isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản'}
      okText={isEdit ? 'Lưu' : 'Tạo tài khoản'}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {!isEdit && (
          <>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
              <Input autoComplete="off" />
            </Form.Item>
          </>
        )}
        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Quyền" initialValue="Customer">
          <Select
            options={[
              { value: 'Customer', label: 'Khách hàng' },
              { value: 'Admin', label: 'Admin' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={isEdit ? 'Đặt lại mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
          rules={isEdit ? [] : [{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
