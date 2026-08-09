import { Outlet } from 'react-router-dom'
import { ConfigProvider, Layout } from 'antd'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import ContactWidget from '../components/common/ContactWidget'
import useIsMobile from '../hooks/useIsMobile'
import { storefrontTheme } from '../constants/theme'

const { Content } = Layout

// Single responsive layout (not two separate apps): the same routes/pages
// render on desktop and mobile, only the header/nav chrome swaps based on
// useIsMobile() (breakpoint = 768px, matching the mobile mockup).
//
// Bọc riêng <ConfigProvider theme={storefrontTheme}> ở đây (không đặt ở
// main.jsx) để theme TỐI theo mockup chỉ áp dụng cho trang khách hàng —
// AdminLayout (route /admin/*, ngoài MainLayout) vẫn dùng theme sáng gốc từ
// ConfigProvider ở main.jsx, tránh vỡ giao diện Admin. Xem constants/theme.js.
export default function MainLayout() {
  const isMobile = useIsMobile()

  return (
    <ConfigProvider theme={storefrontTheme}>
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Header />
        <Content className={isMobile ? 'page-with-bottom-nav' : undefined}>
          <Outlet />
        </Content>
        <Footer />
        {/* Nút "Liên hệ" nổi (bấm mới sổ ra Zalo / Gọi ngay) — hiện ở mọi
            trang khách hàng, không có ở /admin. */}
        <ContactWidget />
        {isMobile && <MobileBottomNav />}
      </Layout>
    </ConfigProvider>
  )
}
