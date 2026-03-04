import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime'

interface Analytics {
  total_sessions: number
  form_filled: number
  form_rate: number
  total_posts: number
  total_leads: number
}

interface QAQuestion {
  id: string
  question_text: string
  is_anonymous: boolean
  upvote_count: number
  status: string
  submitted_at: string
}

export default function Analytics() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const token = localStorage.getItem('organizer_token')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [questions, setQuestions] = useState<QAQuestion[]>([])
  const [announcement, setAnnouncement] = useState('')
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!token) { navigate('/organizer/login'); return }
    if (!eventId) return

    Promise.all([
      api.getAnalytics(token, eventId),
      api.listQA(token, eventId),
    ]).then(([a, q]) => {
      setAnalytics(a as Analytics)
      setQuestions(q as QAQuestion[])
    }).catch(console.error)
  }, [eventId, token, navigate])

  useSupabaseRealtime(eventId, {
    onNewPost: () => {
      // Refresh analytics on new post
      if (token && eventId) api.getAnalytics(token, eventId).then(a => setAnalytics(a as Analytics))
    },
    onNewQuestion: () => {
      // Refresh QA list on new question
      if (token && eventId) api.listQA(token, eventId).then(q => setQuestions(q as QAQuestion[]))
    },
    onQuestionUpvote: (payload) => {
      // Update upvote count in real-time
      const p = payload as { question_id: string; upvote_count: number }
      setQuestions(prev => prev.map(q => q.id === p.question_id ? { ...q, upvote_count: p.upvote_count } : q))
    },
  })

  async function moderate(qId: string, status: string) {
    if (!token || !eventId) return
    await api.moderateQA(token, eventId, qId, status)
    setQuestions(qs => qs.map(q => q.id === qId ? { ...q, status } : q))
  }

  async function sendAnnouncement() {
    if (!token || !eventId || !announcement.trim()) return
    setSending(true)
    try {
      await api.sendAnnouncement(token, eventId, announcement)
      setAnnouncement('')
      showToast('Thông báo đã được gửi đến tất cả người tham dự!')
    } catch (err) {
      showToast('Lỗi gửi thông báo')
    } finally {
      setSending(false)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function exportLeads() {
    if (!token || !eventId) return
    const res = await api.exportLeads(token, eventId)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${eventId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 20 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
          <Link to="/organizer/dashboard">
            <button style={{ background: 'var(--border)', color: 'var(--text)' }}>← Dashboard</button>
          </Link>
          <h2>Analytics</h2>
        </div>

        {/* Stats cards */}
        {analytics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
            <StatCard label="Người tham dự" value={analytics.total_sessions} icon="👥" />
            <StatCard label="Đã điền form" value={analytics.form_filled} icon="📋" />
            <StatCard label="Tỷ lệ form" value={`${analytics.form_rate}%`} icon="📈" />
            <StatCard label="Bài đăng" value={analytics.total_posts} icon="📸" />
            <StatCard label="Leads" value={analytics.total_leads} icon="🎯" />
          </div>
        )}

        {/* Send announcement */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 12 }}>📢 Gửi thông báo</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              placeholder="Nhập thông điệp gửi đến tất cả người tham dự..."
              onKeyDown={e => e.key === 'Enter' && sendAnnouncement()}
            />
            <button className="btn-primary" onClick={sendAnnouncement} disabled={sending || !announcement.trim()} style={{ whiteSpace: 'nowrap' }}>
              {sending ? '...' : 'Gửi'}
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>📥 Export Leads</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tải xuống danh sách leads dạng CSV</p>
          </div>
          <button className="btn-primary" onClick={exportLeads}>Tải CSV</button>
        </div>

        {/* Q&A moderation */}
        {questions.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>❓ Q&A — {questions.length} câu hỏi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {questions.map(q => (
                <div key={q.id} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8, opacity: q.status === 'hidden' ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <p style={{ fontWeight: 500 }}>
                      {q.is_anonymous ? '🎭 Ẩn danh' : '👤'} {q.question_text}
                    </p>
                    <span style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>👍 {q.upvote_count}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {q.status !== 'visible' && <button onClick={() => moderate(q.id, 'visible')} style={{ fontSize: '0.8rem', padding: '4px 10px', background: '#22c55e', color: 'white', borderRadius: 6 }}>Hiện</button>}
                    {q.status !== 'hidden' && <button onClick={() => moderate(q.id, 'hidden')} style={{ fontSize: '0.8rem', padding: '4px 10px', background: '#ef4444', color: 'white', borderRadius: 6 }}>Ẩn</button>}
                    {q.status !== 'featured' && <button onClick={() => moderate(q.id, 'featured')} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--primary)', color: 'white', borderRadius: 6 }}>⭐ Nổi bật</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
    </div>
  )
}
