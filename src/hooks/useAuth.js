import { createContext, useContext } from 'react'

// Context instance lives here (not in store/AuthContext.jsx) so that file
// only exports the AuthProvider component, per react-refresh/only-export-components
// (same pattern as hooks/useCart.js + store/CartContext.jsx).
export const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
