import { createContext, useContext, useState } from 'react'
const Ctx = createContext()
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const login = d => {
    localStorage.setItem('token', d.token)
    const u = { name: d.name, email: d.email, role: d.role }
    localStorage.setItem('user', JSON.stringify(u)); setUser(u)
  }
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) }
  return <Ctx.Provider value={{ user, login, logout, isAdmin: user?.role === 'ADMIN' }}>{children}</Ctx.Provider>
}
