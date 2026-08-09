import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { AuthContext } from '../hooks/useAuth'
import * as authService from '../services/authService'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, IDLE_TIMEOUT_MS } from '../constants/auth'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Backend trả { status, message, data } cho mọi endpoint (xem ApiResponse
// trong api-docs). Shape chi tiết của `data` cho login/register chưa được
// tài liệu hoá — quy ước đang dùng: data = { user, token }. Nếu backend
// thật trả khác (vd token nằm trong `accessToken`, hoặc user nằm ở field
// khác), chỉ cần sửa hàm này, phần còn lại của app (Header, AuthModal,...)
// không cần đổi.
function extractAuthPayload(data) {
  if (!data) return { user: null, token: null }
  const token = data.token || data.accessToken || null
  const user = data.user || null
  return { token, user }
}

// Provider quản lý phiên đăng nhập: lưu token + user vào localStorage (đọc
// lại khi reload trang) và cung cấp login/register/logout + state điều
// khiển AuthModal (nút "Đăng nhập" ở Header gọi openAuthModal()).
// Đăng nhập Google đã bị gỡ theo yêu cầu (2026-08-06) — xem lịch sử git nếu
// cần khôi phục lại (authService.loginWithGoogle, GoogleLoginButton.jsx).
export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY))
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const persistAuth = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    if (nextUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const res = await authService.login(payload)
        const { token: t, user: u } = extractAuthPayload(res?.data)
        persistAuth(t, u)
        return res
      } finally {
        setLoading(false)
      }
    },
    [persistAuth],
  )

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      // API hiện không xác nhận đăng ký có trả kèm token hay không -> không
      // tự đăng nhập sau khi đăng ký, để AuthModal chuyển sang tab Login.
      return await authService.register(payload)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      if (token) await authService.logout()
    } catch {
      // JWT stateless (xem mô tả endpoint /auth/logout trong api-docs): dù
      // API lỗi/hết hạn vẫn xoá phiên phía client bình thường.
    } finally {
      persistAuth(null, null)
    }
  }, [token, persistAuth])

  // Tự động đăng xuất khi phiên KHÔNG hoạt động quá IDLE_TIMEOUT_MS (10 phút).
  // Chỉ chạy khi đã đăng nhập (có token). Bất kỳ thao tác nào của người dùng
  // đều làm mới bộ đếm; hết giờ thì xoá phiên (báo backend nhưng không chặn vì
  // JWT stateless) và đưa về trang chủ. Bảo vệ phiên Admin bị bỏ quên trên máy
  // dùng chung. Đăng xuất thủ công (nút "Đăng xuất") vẫn dùng logout() ở trên.
  const lastActivityRef = useRef(Date.now())
  useEffect(() => {
    if (!token) return undefined

    let timerId
    const handleIdle = () => {
      // Xoá phiên phía client ngay; gọi backend nhưng nuốt lỗi (token có thể
      // đã hết hạn). Không dùng logout() để tránh phụ thuộc `token` cũ trong
      // closure và để luôn điều hướng về trang chủ.
      authService.logout().catch(() => {})
      persistAuth(null, null)
      message.info('Phiên đăng nhập đã hết hạn do không hoạt động. Vui lòng đăng nhập lại.')
      navigate('/', { replace: true })
    }

    const resetTimer = () => {
      const now = Date.now()
      // Throttle: mousemove/scroll bắn liên tục — chỉ làm mới tối đa 1 lần/giây.
      if (now - lastActivityRef.current < 1000) return
      lastActivityRef.current = now
      clearTimeout(timerId)
      timerId = setTimeout(handleIdle, IDLE_TIMEOUT_MS)
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel']
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }))
    timerId = setTimeout(handleIdle, IDLE_TIMEOUT_MS)

    return () => {
      clearTimeout(timerId)
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer, { passive: true }))
    }
  }, [token, persistAuth, navigate])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
      authModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
    }),
    [user, token, loading, login, register, logout, authModalOpen],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
