import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { RequireAuth, RequireAdmin } from './components/Guards'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Admin from './admin/Admin'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
      <footer>© ShopEasy · Spring Boot + React + PostgreSQL</footer>
    </>
  )
}
