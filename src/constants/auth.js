// Keys used to persist the auth session in localStorage. Centralised here so
// apiClient.js (reads token) and AuthContext.jsx (reads/writes token + user)
// never drift apart.
export const AUTH_TOKEN_KEY = 'tuetram_auth_token'
export const AUTH_USER_KEY = 'tuetram_auth_user'

// Tự động đăng xuất sau 10 phút KHÔNG có thao tác nào của người dùng
// (di chuột / gõ phím / chạm / cuộn). Dùng trong AuthContext.jsx để bảo vệ
// phiên Admin bỏ quên trên máy công cộng. Đổi số phút ở đây là đủ.
export const IDLE_TIMEOUT_MS = 10 * 60 * 1000
