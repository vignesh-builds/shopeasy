import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children }) {
  const { user } = useAuth(); const loc = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />
}
export function RequireAdmin({ children }) {
  const { user, isAdmin } = useAuth()
  return !user ? <Navigate to="/login" replace /> : isAdmin ? children : <Navigate to="/" replace />
}
