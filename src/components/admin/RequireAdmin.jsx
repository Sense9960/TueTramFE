import { Link, Navigate, useLocation } from 'react-router-dom'
import { Button, Result } from 'antd'
import { useAuth } from '../../hooks/useAuth'

// Chặn truy cập /admin/* nếu chưa đăng nhập hoặc không phải role Admin.
// user.role được kỳ vọng nằm trong object user trả về từ /auth/login
// (xem AuthContext.jsx) — nếu backend đặt tên field khác, sửa `user?.role` ở
// đây và trong Header.jsx (mục hiển thị link "Quản trị") là đủ.
export default function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Chưa đăng nhập -> đưa thẳng sang trang đăng nhập (/dang-nhap) và nhớ
  // trang đang muốn vào để đăng nhập xong quay lại đúng chỗ. Trước đây chỉ
  // hiện màn 403 với nút "Về trang chủ" — mà nút "Đăng nhập" ở Header đã ẩn
  // theo SHOP_MODE nên người dùng bị kẹt, không có lối đăng nhập.
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace state={{ from: location.pathname }} />
  }

  if (user?.role !== 'Admin') {
    return (
      <div style={{ padding: '48px 16px' }}>
        <Result
          status="403"
          title="Không có quyền truy cập"
          subTitle="Tài khoản của bạn không có quyền Admin."
          extra={
            <Link to="/">
              <Button type="primary">Về trang chủ</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return children
}
