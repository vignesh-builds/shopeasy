import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api, { errMsg } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Auth({ mode }) {
  const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState('')
  const { login } = useAuth(); const nav = useNavigate(); const loc = useLocation()
  const submit = async e => {
    e.preventDefault(); setErr('')
    try { const { data } = await api.post(`/auth/${mode}`, f); login(data); nav(loc.state?.from || '/') }
    catch (ex) { setErr(errMsg(ex)) }
  }
  const set = k => e => setF({ ...f, [k]: e.target.value })
  return (
    <form className="card form" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
      {mode === 'register' && <input placeholder="Full name" value={f.name} onChange={set('name')} required />}
      <input type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
      <input type="password" placeholder="Password (min 6 chars)" value={f.password} onChange={set('password')} required minLength={6} />
      {err && <p className="err">{err}</p>}
      <button>{mode === 'login' ? 'Login' : 'Register'}</button>
      <small>{mode === 'login' ? <>New here? <Link to="/register">Create an account</Link></> : <>Have an account? <Link to="/login">Login</Link></>}</small>
    </form>
  )
}
