import { createContext, useContext, useEffect, useState } from 'react'
const Ctx = createContext()
export const useCart = () => useContext(Ctx)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items])

  const add = (p, qty = 1) => setItems(c => {
    const ex = c.find(i => i.id === p.id)
    const q = Math.min((ex?.qty || 0) + qty, p.stock)
    return ex ? c.map(i => i.id === p.id ? { ...i, qty: q, stock: p.stock } : i)
              : [...c, { id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, stock: p.stock, qty: q }]
  })
  const setQty = (id, qty) => setItems(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
  const remove = id => setItems(c => c.filter(i => i.id !== id))
  const clear = () => setItems([])
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : 50   // keep in sync with backend
  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, subtotal, shipping, total: subtotal + shipping }}>{children}</Ctx.Provider>
}
