import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errMsg, money } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart(); const { user } = useAuth(); const nav = useNavigate()
  const [f, setF] = useState({ shippingName: user.name, shippingPhone: '', shippingAddress: '', paymentMethod: 'COD' })
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })

  if (!items.length) return <p>Your cart is empty.</p>

  const submit = async e => {
    e.preventDefault(); setErr('')
    if (f.paymentMethod === 'ONLINE' && card.number.replace(/\s/g, '').length < 12) return setErr('Enter a valid card number (demo mode: any 12+ digits)')
    setBusy(true)
    try {
      await api.post('/orders', { ...f, items: items.map(i => ({ productId: i.id, quantity: i.qty })) })
      clear(); nav('/orders')
    } catch (ex) { setErr(errMsg(ex)) } finally { setBusy(false) }
  }
  return (
    <div className="two-col">
      <form className="card form wide" onSubmit={submit}>
        <h2>Shipping details</h2>
        <input placeholder="Full name" value={f.shippingName} onChange={set('shippingName')} required />
        <input placeholder="Phone number" value={f.shippingPhone} onChange={set('shippingPhone')} required pattern="[0-9+\- ]{10,15}" title="Enter a valid phone number" />
        <textarea placeholder="Full address (street, city, pincode)" rows="3" value={f.shippingAddress} onChange={set('shippingAddress')} required minLength={10} />
        <h3>Payment</h3>
        <label><input type="radio" checked={f.paymentMethod === 'COD'} onChange={() => setF({ ...f, paymentMethod: 'COD' })} /> Cash on Delivery</label>
        <label><input type="radio" checked={f.paymentMethod === 'ONLINE'} onChange={() => setF({ ...f, paymentMethod: 'ONLINE' })} /> Card / Online (demo)</label>
        {f.paymentMethod === 'ONLINE' && <>
          <input placeholder="Card number" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />
          <div className="inline"><input placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
            <input placeholder="CVV" type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} /></div>
          <small className="muted">Demo payment: no real charge. Card data is not sent to the server.</small></>}
        {err && <p className="err">{err}</p>}
        <button disabled={busy}>{busy ? 'Placing order...' : `Place order · ${money(total)}`}</button>
      </form>
      <div className="card"><h3>Order summary</h3>
        {items.map(i => <div className="between" key={i.id}><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
        <hr /><div className="between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="between"><span>Shipping</span><span>{shipping ? money(shipping) : 'FREE'}</span></div>
        <div className="between"><b>Total</b><b>{money(total)}</b></div></div>
    </div>
  )
}
