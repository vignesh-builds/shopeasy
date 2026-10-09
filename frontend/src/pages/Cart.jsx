import { Link, useNavigate } from 'react-router-dom'
import { money } from '../api'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, setQty, remove, subtotal, shipping, total } = useCart(); const nav = useNavigate()
  if (!items.length) return <div className="card"><p>Your cart is empty.</p><Link to="/">Continue shopping</Link></div>
  return (
    <div className="card">
      <h2>Shopping Cart</h2>
      {items.map(i => (
        <div className="row" key={i.id}>
          <img src={i.imageUrl} alt="" className="thumb" />
          <Link to={`/product/${i.id}`} className="grow">{i.name}</Link>
          <span className="inline"><button onClick={() => setQty(i.id, i.qty - 1)}>-</button>{i.qty}<button onClick={() => setQty(i.id, i.qty + 1)}>+</button></span>
          <b className="w100">{money(i.price * i.qty)}</b>
          <button className="danger" onClick={() => remove(i.id)}>✕</button>
        </div>))}
      <div className="summary">
        <div className="between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="between"><span>Shipping</span><span>{shipping ? money(shipping) : 'FREE'}</span></div>
        <div className="between"><b>Total</b><b>{money(total)}</b></div>
        {subtotal < 1000 && <small className="muted">Free shipping on orders above ₹1,000</small>}
        <button onClick={() => nav('/checkout')}>Proceed to checkout</button>
      </div>
    </div>
  )
}
