import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const data = await api.login(email, password) as { access_token: string }
        localStorage.setItem('organizer_token', data.access_token)
        navigate('/organizer/dashboard')
      } else {
        await api.register(email, password, fullName)
        setMode('login')
        setError('Đăng ký thành công! Vui lòng đăng nhập.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>EventBoard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {mode === 'login' ? 'Đăng nhập tài khoản Organizer' : 'Tạo tài khoản mới'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="organizer@email.com"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', color: 'var(--primary)', textDecoration: 'underline', padding: 0 }}
          >
            {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}
