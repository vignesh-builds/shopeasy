import { useEffect, useState } from 'react'
import api, { errMsg, money } from '../api'
import StatusBadge from '../components/StatusBadge'

const STATUSES = ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function Dashboard() {
  const [s, setS] = useState(null)
  useEffect(() => { api.get('/admin/stats').then(r => setS(r.data)) }, [])
  if (!s) return <p>Loading...</p>
  return (
    <>
      <div className="stats">
        <div className="card"><small>Revenue</small><h2>{money(s.totalRevenue)}</h2></div>
        <div className="card"><small>Orders</small><h2>{s.totalOrders}</h2></div>
        <div className="card"><small>Products</small><h2>{s.totalProducts}</h2></div>
        <div className="card"><small>Users</small><h2>{s.totalUsers}</h2></div>
      </div>
      <div className="two-col">
        <div className="card"><h3>Orders by status</h3>
          {Object.entries(s.ordersByStatus).map(([k, v]) => <div className="between" key={k}><StatusBadge s={k} /><b>{v}</b></div>)}</div>
        <div className="card"><h3>Low stock (≤ 10)</h3>
          {!s.lowStock.length && <p className="muted">All good.</p>}
          {s.lowStock.map(p => <div className="between" key={p.id}><span>{p.name}</span><b className="warn">{p.stock}</b></div>)}</div>
      </div>
    </>
  )
}

const empty = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

function Products() {
  const [list, setList] = useState([]); const [cats, setCats] = useState([])
  const [f, setF] = useState(empty); const [editId, setEditId] = useState(null); const [err, setErr] = useState('')
  const load = () => { api.get('/products', { params: { size: 100 } }).then(r => setList(r.data.content)); api.get('/categories').then(r => setCats(r.data)) }
  useEffect(load, [])
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const save = async e => {
    e.preventDefault(); setErr('')
    const body = { ...f, price: +f.price, stock: +f.stock, categoryId: f.categoryId ? +f.categoryId : null }
    try { editId ? await api.put(`/products/${editId}`, body) : await api.post('/products', body); setF(empty); setEditId(null); load() }
    catch (ex) { setErr(errMsg(ex)) }
  }
  const edit = p => { setEditId(p.id); setF({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, imageUrl: p.imageUrl || '', categoryId: p.category?.id || '' }); window.scrollTo(0, 0) }
  const del = async p => { if (confirm(`Delete "${p.name}"?`)) { await api.delete(`/products/${p.id}`); load() } }

  return (
    <>
      <form className="card grid-form" onSubmit={save}>
        <h3>{editId ? 'Edit product' : 'Add product'}</h3>
        <input placeholder="Name" value={f.name} onChange={set('name')} required />
        <input placeholder="Image URL" value={f.imageUrl} onChange={set('imageUrl')} />
        <input type="number" step="0.01" min="0.01" placeholder="Price" value={f.price} onChange={set('price')} required />
        <input type="number" min="0" placeholder="Stock" value={f.stock} onChange={set('stock')} required />
        <select value={f.categoryId} onChange={set('categoryId')}><option value="">No category</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input placeholder="Description" value={f.description} onChange={set('description')} />
        <div className="inline"><button>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="danger" onClick={() => { setEditId(null); setF(empty) }}>Cancel</button>}</div>
        {err && <p className="err">{err}</p>}
      </form>
      <table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>{list.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.category?.name}</td><td>{money(p.price)}</td>
          <td className={p.stock <= 10 ? 'warn' : ''}>{p.stock}</td>
          <td className="inline"><button onClick={() => edit(p)}>Edit</button><button className="danger" onClick={() => del(p)}>Delete</button></td></tr>)}</tbody></table>
    </>
  )
}

function Categories() {
  const [list, setList] = useState([]); const [name, setName] = useState(''); const [err, setErr] = useState('')
  const load = () => api.get('/categories').then(r => setList(r.data)); useEffect(() => { load() }, [])
  const add = async e => { e.preventDefault(); setErr(''); try { await api.post('/categories', { name }); setName(''); load() } catch (ex) { setErr(errMsg(ex)) } }
  const del = async c => { setErr(''); try { await api.delete(`/categories/${c.id}`); load() } catch (ex) { setErr(errMsg(ex)) } }
  return (
    <div className="form">
      <form className="card inline-form" onSubmit={add}><input placeholder="New category" value={name} onChange={e => setName(e.target.value)} required /><button>Add</button></form>
      {err && <p className="err">{err}</p>}
      {list.map(c => <div className="card between" key={c.id}><span>{c.name}</span><button className="danger" onClick={() => del(c)}>Delete</button></div>)}
    </div>
  )
}

function Orders() {
  const [list, setList] = useState([]); const [err, setErr] = useState('')
  const load = () => api.get('/admin/orders').then(r => setList(r.data)); useEffect(() => { load() }, [])
  const change = async (id, status) => { setErr(''); try { await api.put(`/admin/orders/${id}/status`, { status }); } catch (ex) { setErr(errMsg(ex)) } load() }
  return (
    <>
      {err && <p className="err">{err}</p>}
      <table><thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>{list.map(o => <tr key={o.id}><td>{o.id}</td>
          <td>{o.shippingName}<br /><small className="muted">{o.userEmail}<br />{o.shippingPhone}</small></td>
          <td>{o.items.map(i => <div key={i.id}>{i.productName} × {i.quantity}</div>)}</td>
          <td>{money(o.total)}</td><td>{o.paymentMethod}<br /><small>{o.paymentStatus}</small></td>
          <td><StatusBadge s={o.status} />{o.status !== 'CANCELLED' && o.status !== 'DELIVERED' &&
            <select value="" onChange={e => e.target.value && change(o.id, e.target.value)}><option value="">Change...</option>
              {STATUSES.filter(s => s !== o.status).map(s => <option key={s}>{s}</option>)}</select>}</td></tr>)}</tbody></table>
    </>
  )
}

function Users() {
  const [list, setList] = useState([]); useEffect(() => { api.get('/admin/users').then(r => setList(r.data)) }, [])
  return <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
    <tbody>{list.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>
}

const TABS = { Dashboard, Products, Categories, Orders, Users }
export default function Admin() {
  const [tab, setTab] = useState('Dashboard'); const Tab = TABS[tab]
  return (
    <div>
      <h2>Admin Panel</h2>
      <div className="tabs">{Object.keys(TABS).map(t => <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      <Tab />
    </div>
  )
}
