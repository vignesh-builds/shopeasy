import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth(); const { count } = useCart(); const nav = useNavigate()
  return (
    <nav>
      <Link to="/" className="logo">🛒 ShopEasy</Link>
      <div className="links">
        <Link to="/cart">Cart ({count})</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        {user ? <>
          <Link to="/orders">Orders</Link><Link to="/profile">{user.name}</Link>
          <a href="#logout" onClick={e => { e.preventDefault(); logout(); nav('/') }}>Logout</a>
        </> : <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
      </div>
    </nav>
  )
}
