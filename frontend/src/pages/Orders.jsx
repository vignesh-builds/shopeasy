import { useEffect, useState } from 'react'
import api, { errMsg, money } from '../api'
import StatusBadge from '../components/StatusBadge'

export default function Orders() {
  const [list, setList] = useState(null); const [err, setErr] = useState('')
  const load = () => api.get('/orders').then(r => setList(r.data))
  useEffect(() => { load() }, [])
  const cancel = async id => {
    if (!confirm('Cancel this order?')) return
    try { await api.put(`/orders/${id}/cancel`); load() } catch (ex) { setErr(errMsg(ex)) }
  }
  if (!list) return <p>Loading...</p>
  return (
    <div>
      <h2>My Orders</h2>{err && <p className="err">{err}</p>}
      {!list.length && <p>No orders yet.</p>}
      {list.map(o => (
        <div className="card" key={o.id}>
          <div className="between"><b>Order #{o.id}</b><StatusBadge s={o.status} /></div>
          <small className="muted">{new Date(o.createdAt).toLocaleString()} · {o.paymentMethod} · Payment: {o.paymentStatus}</small>
          {o.items.map(i => <div className="between" key={i.id}><span>{i.productName} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span></div>)}
          <hr /><div className="between"><span>Shipping to: {o.shippingName}, {o.shippingAddress}</span><b>{money(o.total)}</b></div>
          {(o.status === 'PLACED' || o.status === 'PAID') && <button className="danger" onClick={() => cancel(o.id)}>Cancel order</button>}
        </div>))}
    </div>
  )
}
