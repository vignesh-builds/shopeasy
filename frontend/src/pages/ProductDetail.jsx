import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api, { errMsg, money } from '../api'
import { Stars } from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams(); const { add } = useCart(); const { user } = useAuth()
  const [p, setP] = useState(null); const [reviews, setReviews] = useState([]); const [qty, setQty] = useState(1)
  const [form, setForm] = useState({ rating: 5, comment: '' }); const [msg, setMsg] = useState('')

  const load = () => {
    api.get(`/products/${id}`).then(r => setP(r.data)).catch(() => setP(false))
    api.get(`/products/${id}/reviews`).then(r => setReviews(r.data))
  }
  useEffect(load, [id])

  const submit = async e => {
    e.preventDefault(); setMsg('')
    try { await api.post(`/products/${id}/reviews`, form); setForm({ rating: 5, comment: '' }); load() }
    catch (ex) { setMsg(errMsg(ex)) }
  }
  if (p === false) return <p>Product not found.</p>
  if (!p) return <p>Loading...</p>
  return (
    <>
      <div className="detail card">
        <img src={p.imageUrl} alt={p.name} />
        <div>
          <small className="muted">{p.category?.name}</small>
          <h2>{p.name}</h2>
          <div><Stars value={p.rating} /> <small className="muted">{p.rating} ({p.reviewCount} reviews)</small></div>
          <p>{p.description}</p>
          <h3>{money(p.price)}</h3>
          <p className={p.stock > 0 ? 'ok' : 'err'}>{p.stock > 0 ? `In stock (${p.stock})` : 'Out of stock'}</p>
          {p.stock > 0 && <div className="inline">
            <input type="number" min="1" max={p.stock} value={qty} onChange={e => setQty(Math.max(1, +e.target.value))} style={{ width: 70 }} />
            <button onClick={() => add(p, qty)}>Add to cart</button></div>}
        </div>
      </div>
      <h3>Reviews</h3>
      {user && <form className="card inline-form" onSubmit={submit}>
        <select value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })}>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}</select>
        <input placeholder="Write a review (optional)" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
        <button>Submit</button>{msg && <span className="err">{msg}</span>}
      </form>}
      {!reviews.length && <p className="muted">No reviews yet.</p>}
      {reviews.map(r => <div className="card" key={r.id}><b>{r.userName}</b> <Stars value={r.rating} />
        <small className="muted"> {new Date(r.createdAt).toLocaleDateString()}</small><p>{r.comment}</p></div>)}
    </>
  )
}
