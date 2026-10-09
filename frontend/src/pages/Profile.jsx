import { useState } from 'react'
import api, { errMsg } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth(); const [pw, setPw] = useState({ currentPassword: '', newPassword: '' }); const [msg, setMsg] = useState(null)
  const submit = async e => {
    e.preventDefault(); setMsg(null)
    try { await api.put('/users/me/password', pw); setMsg({ ok: true, t: 'Password updated' }); setPw({ currentPassword: '', newPassword: '' }) }
    catch (ex) { setMsg({ ok: false, t: errMsg(ex) }) }
  }
  return (
    <div className="form">
      <div className="card"><h2>My Profile</h2><p><b>Name:</b> {user.name}</p><p><b>Email:</b> {user.email}</p><p><b>Role:</b> {user.role}</p></div>
      <form className="card form" onSubmit={submit}>
        <h3>Change password</h3>
        <input type="password" placeholder="Current password" value={pw.currentPassword} onChange={e => setPw({ ...pw, currentPassword: e.target.value })} required />
        <input type="password" placeholder="New password" minLength={6} value={pw.newPassword} onChange={e => setPw({ ...pw, newPassword: e.target.value })} required />
        {msg && <p className={msg.ok ? 'ok' : 'err'}>{msg.t}</p>}<button>Update password</button>
      </form>
    </div>
  )
}
