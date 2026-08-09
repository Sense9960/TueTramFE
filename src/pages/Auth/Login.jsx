import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ConfigProvider, Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { colors, fontFamily, storefrontTheme } from '../../constants/theme'
import logo from '../../assets/images/logo.png'

// TRANG ĐĂNG NHẬP BẰNG ĐƯỜNG LINK — route `/dang-nhap` (và alias `/login`).
//
// Vì sao cần: từ 2026-08-07 website chạy chế độ landing page (SHOP_MODE=false)
// nên nút "Đăng nhập" ở Header bị ẩn, mà trước đó đăng nhập CHỈ mở được qua
// modal từ nút đó => không còn cách nào vào /admin. Trang này là lối vào cố
// định cho chủ shop, KHÔNG phụ thuộc SHOP_MODE và không có link trỏ tới từ
// menu (khách vãng lai không thấy, chỉ ai biết địa chỉ mới vào).
//
// Đăng nhập xong sẽ quay lại trang đã định (state.from do RequireAdmin gửi
// sang), mặc định là /admin.
export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from || '/admin'

  // Đã đăng nhập rồi thì không cần xem form nữa.
  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  const handleLogin = async (values) => {
    setSubmitting(true)
    try {
      await login(values)
      message.success('Đăng nhập thành công')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      message.error(err?.response?.data?.message || 'Đăng nhập thất bại, kiểm tra lại thông tin')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ConfigProvider theme={storefrontTheme}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 18px',
          background: colors.textDark2,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: colors.neutral800,
            borderRadius: 24,
            padding: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <img src={logo} alt="Tuệ Trầm" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
            <span
              style={{
                fontFamily: fontFamily.display,
                fontWeight: fontFamily.headingWeight,
                fontSize: 20,
                color: colors.accentPeachLight,
              }}
            >
              Tuệ Trầm
            </span>
          </div>

          <div
            style={{
              fontFamily: fontFamily.display,
              fontWeight: fontFamily.headingWeight,
              fontSize: 24,
              marginTop: 12,
              color: colors.bgCreamAlt,
            }}
          >
            Đăng nhập quản trị
          </div>
          <p style={{ margin: '6px 0 20px', fontSize: 13, lineHeight: 1.6, color: colors.neutral500 }}>
            Dành cho tài khoản Admin của cửa hàng.
          </p>

          <Form layout="vertical" onFinish={handleLogin} disabled={submitting}>
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

          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: colors.neutral500 }}>
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}
