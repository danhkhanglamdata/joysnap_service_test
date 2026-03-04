import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../lib/api'

interface Event {
  id: string
  title: string
  status: string
  event_date: string | null
  location: string | null
  color: string
  created_at: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('organizer_token')

  useEffect(() => {
    if (!token) { navigate('/organizer/login'); return }

    api.listEvents(token)
      .then(data => setEvents(data as Event[]))
      .catch(() => { navigate('/organizer/login') })
      .finally(() => setLoading(false))
  }, [token, navigate])

  function logout() {
    localStorage.removeItem('organizer_token')
    navigate('/organizer/login')
  }

  if (loading) return <div className="spinner">Đang tải...</div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, maxWidth: 900, margin: '0 auto 24px' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '1.6rem' }}>🎯 EventBoard</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/organizer/events/new">
            <button className="btn-primary">+ Tạo sự kiện</button>
          </Link>
          <button onClick={logout} style={{ background: 'var(--border)', color: 'var(--text)' }}>Đăng xuất</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 16 }}>Sự kiện của bạn</h2>

        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Chưa có sự kiện nào</p>
            <Link to="/organizer/events/new">
              <button className="btn-primary">Tạo sự kiện đầu tiên</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {events.map(event => (
              <div key={event.id} className="card" style={{ borderTop: `4px solid ${event.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{event.title}</h3>
                  <StatusBadge status={event.status} />
                </div>
                {event.event_date && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>
                    📅 {new Date(event.event_date).toLocaleDateString('vi-VN')}
                  </p>
                )}
                {event.location && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
                    📍 {event.location}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/organizer/events/${event.id}`} style={{ flex: 1 }}>
                    <button className="btn-secondary" style={{ width: '100%' }}>Quản lý</button>
                  </Link>
                  <Link to={`/organizer/events/${event.id}/analytics`} style={{ flex: 1 }}>
                    <button style={{ width: '100%', background: 'var(--border)', color: 'var(--text)' }}>Analytics</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: '#f59e0b',
    active: '#22c55e',
    ended: '#6b7280',
  }
  const labels: Record<string, string> = {
    draft: 'Nháp',
    active: '🟢 Đang diễn ra',
    ended: 'Đã kết thúc',
  }
  return (
    <span style={{
      background: colors[status] ?? '#e5e7eb',
      color: 'white',
      borderRadius: 999,
      padding: '2px 10px',
      fontSize: '0.75rem',
      fontWeight: 600,
    }}>
      {labels[status] ?? status}
    </span>
  )
}
