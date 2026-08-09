import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import RequireAdmin from './components/admin/RequireAdmin'
import Home from './pages/Home'
import ProductList from './pages/Products/ProductList'
import ProductDetail from './pages/Products/ProductDetail'
import BlogList from './pages/Blog/BlogList'
import BlogDetail from './pages/Blog/BlogDetail'
import Founder from './pages/Blog/Founder'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import OrderSuccess from './pages/Checkout/OrderSuccess'
import NotFound from './pages/NotFound'
import Login from './pages/Auth/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/Products'
import AdminCategories from './pages/Admin/Categories'
import AdminUsers from './pages/Admin/Users'
import AdminBlog from './pages/Admin/Blog'
import AdminOrders from './pages/Admin/Orders'
import AdminCoupons from './pages/Admin/Coupons'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/san-pham" element={<ProductList />} />
        <Route path="/san-pham/:sku" element={<ProductDetail />} />
        <Route path="/bai-viet" element={<BlogList />} />
        <Route path="/bai-viet/:slug" element={<BlogDetail />} />
        <Route path="/nguoi-sang-lap" element={<Founder />} />
        <Route path="/lien-he" element={<Contact />} />
        {/* Prototype gộp giỏ hàng + thanh toán vào CHUNG 1 màn (`isCart`) —
            không có trang thanh toán riêng. Giữ /thanh-toan chỉ để link cũ
            không gãy, chuyển hướng về /gio-hang. Xem Cart/index.jsx. */}
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/thanh-toan" element={<Navigate to="/gio-hang" replace />} />
        <Route path="/dat-hang-thanh-cong" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Đăng nhập bằng ĐƯỜNG LINK — đặt NGOÀI MainLayout để không có
          Header/Footer/nav của trang khách. Có vì nút "Đăng nhập" ở Header đã
          ẩn theo SHOP_MODE=false, không còn lối vào /admin. `/login` là alias
          cho ai quen gõ tiếng Anh. Xem pages/Auth/Login.jsx. */}
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/login" element={<Navigate to="/dang-nhap" replace />} />

      {/* Khu vực quản trị — layout + guard riêng, không dùng Header/Footer
          của trang khách hàng (xem RequireAdmin.jsx + AdminLayout.jsx). */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        {/* 6 màn theo bộ thiết kế Admin (2026-08-06): Tổng quan / Người dùng /
            Đơn hàng / Bài đăng / Sản phẩm / Mã voucher. Route "danh-muc" giữ
            thêm ngoài thiết kế vì vẫn cần để gán danh mục cho sản phẩm. */}
        <Route index element={<AdminDashboard />} />
        <Route path="nguoi-dung" element={<AdminUsers />} />
        <Route path="don-hang" element={<AdminOrders />} />
        <Route path="bai-viet" element={<AdminBlog />} />
        <Route path="san-pham" element={<AdminProducts />} />
        <Route path="voucher" element={<AdminCoupons />} />
        <Route path="danh-muc" element={<AdminCategories />} />
      </Route>
    </Routes>
  )
}
