import { useMemo, useReducer } from 'react'
import { CartContext } from '../hooks/useCart'

const initialState = {
  items: [], // { sku, name, price, image, qty }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, qty = 1 } = action.payload
      const existing = state.items.find((i) => i.sku === product.sku)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.sku === product.sku ? { ...i, qty: i.qty + qty } : i,
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          { sku: product.sku, name: product.name, price: product.price, image: product.image, qty },
        ],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.sku !== action.payload.sku) }
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.sku === action.payload.sku ? { ...i, qty: Math.max(1, action.payload.qty) } : i,
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const value = useMemo(() => {
    const cartCount = state.items.reduce((sum, i) => sum + i.qty, 0)
    const subtotal = state.items.reduce((sum, i) => sum + i.qty * i.price, 0)
    return {
      items: state.items,
      cartCount,
      subtotal,
      addItem: (product, qty) => dispatch({ type: 'ADD_ITEM', payload: { product, qty } }),
      removeItem: (sku) => dispatch({ type: 'REMOVE_ITEM', payload: { sku } }),
      setQty: (sku, qty) => dispatch({ type: 'SET_QTY', payload: { sku, qty } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
