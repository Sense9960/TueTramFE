import { createContext, useContext } from 'react'

// Context instance lives here (not in store/CartContext.jsx) so that file
// only exports the CartProvider component, per react-refresh/only-export-components.
export const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
