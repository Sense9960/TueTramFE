import { useState } from 'react'
import { Modal, Tabs, Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'

// Modal đăng nhập/đăng ký mở từ nút ở góc phải Header (xem openAuthModal()
// trong useAuth()). Render một lần duy nhất trong Header, điều khiển bằng
// AuthContext.authModalOpen nên có thể mở từ bất kỳ đâu trong app sau này
// (vd trang thanh toán yêu cầu đăng nhập trước khi đặt hàng).
export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login, register } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    closeAuthModal()
    loginForm.resetFields()
    registerForm.resetFields()
    setActiveTab('login')
  }

  const handleLogin = async (values) => {
    setSubmitting(true)
    try {
      await login(values)
      message.success('Đăng nhập thành công')
      handleClose()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Đăng nhập thất bại, kiểm tra lại thông tin')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (values) => {
    setSubmitting(true)
    try {
      await register(values)
      message.success('Đăng ký thành công, mời bạn đăng nhập')
      registerForm.resetFields()
      loginForm.setFieldsValue({ emailOrUsername: values.email })
      setActiveTab('login')
    } catch (err) {
      message.error(err?.response?.data?.message || 'Đăng ký thất bại, thử lại sau')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={authModalOpen}
      onCancel={handleClose}
      footer={null}
      title="Tài khoản Tuệ Trầm"
      destroyOnClose
      centered
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            key: 'login',
            label: 'Đăng nhập',
            children: (
              <Form form={loginForm} layout="vertical" onFinish={handleLogin} disabled={submitting}>
                <Form.Item
                  name="emailOrUsername"
                  label="Email hoặc tên đăng nhập"
                  rules={[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="email@example.com" autoComplete="username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" autoComplete="current-password" />
                </Form.Item>
                <Form.Item noStyle>
                  <Button type="primary" htmlType="submit" block loading={submitting}>
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'register',
            label: 'Đăng ký',
            children: (
              <Form form={registerForm} layout="vertical" onFinish={handleRegister} disabled={submitting}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>
                <Form.Item
                  name="username"
                  label="Tên đăng nhập"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="tendangnhap" autoComplete="username" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
                >
                  <Input prefix={<MailOutlined />} placeholder="email@example.com" autoComplete="email" />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại (không bắt buộc)">
                  <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" autoComplete="tel" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <Button type="primary" htmlType="submit" block loading={submitting}>
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Modal>
  )
}
