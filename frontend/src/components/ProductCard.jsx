import { Link } from 'react-router-dom'
import { money } from '../api'
import { useCart } from '../context/CartContext'

export const Stars = ({ value }) => <span className="stars">{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</span>

export default function ProductCard({ p }) {
  const { add } = useCart()
  return (
    <div className="card product">
      <Link to={`/product/${p.id}`}><img src={p.imageUrl} alt={p.name} /></Link>
      <small className="muted">{p.category?.name}</small>
      <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
      <div><Stars value={p.rating} /> <small className="muted">({p.reviewCount})</small></div>
      <div className="between"><b>{money(p.price)}</b>
        {p.stock > 0 && p.stock <= 10 && <small className="warn">Only {p.stock} left</small>}</div>
      <button disabled={p.stock < 1} onClick={() => add(p)}>{p.stock < 1 ? 'Out of stock' : 'Add to cart'}</button>
    </div>
  )
}
