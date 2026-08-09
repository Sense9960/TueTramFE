import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import { AuthProvider } from './store/AuthContext.jsx'
import { CartProvider } from './store/CartContext.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { antdTheme } from './constants/theme.js'
import './assets/styles/global.css'

// ErrorBoundary bọc NGOÀI CÙNG: nếu bất kỳ component nào ném lỗi lúc render,
// React 18 sẽ gỡ sạch cây và để lại màn hình trống trơn — có lưới này thì
// hiện thông báo + nút tải lại thay vì "trang tối thui không hiểu vì sao".
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider theme={antdTheme}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
