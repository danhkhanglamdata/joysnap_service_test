import { useState } from 'react'
import { api } from '../../lib/api'

interface QAQuestion {
  id: string
  question_text: string
  is_anonymous: boolean
  upvote_count: number
  status: string
  submitted_at: string
}

interface Activity {
  id: string
  config: {
    allow_anonymous?: boolean
    allow_upvote?: boolean
  }
}

interface QAProps {
  eventId: string
  activity: Activity
}

export default function QA({ eventId, activity }: QAProps) {
  const [questions, setQuestions] = useState<QAQuestion[]>([])
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set())

  const allowAnonymous = activity.config.allow_anonymous ?? true
  const allowUpvote = activity.config.allow_upvote ?? true

  // TODO: could load questions from state, for MVP we just show submitted ones
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const q = await api.submitQA(eventId, {
        activity_id: activity.id,
        question_text: text,
        is_anonymous: anonymous,
      }) as QAQuestion
      setQuestions(prev => [q, ...prev])
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi gửi câu hỏi')
    } finally {
      setSubmitting(false)
    }
  }

  async function upvote(qId: string) {
    if (upvoted.has(qId)) return
    try {
      const data = await api.upvoteQA(eventId, qId) as { upvote_count: number }
      setUpvoted(prev => new Set([...prev, qId]))
      setQuestions(prev => prev.map(q => q.id === qId ? { ...q, upvote_count: data.upvote_count } : q))
    } catch {
      // ignore
    }
  }

  const visibleQuestions = questions.filter(q => q.status !== 'hidden')

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 4 }}>❓ Q&A</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>Đặt câu hỏi cho diễn giả</p>

      <form onSubmit={submit} style={{ marginBottom: 16 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Câu hỏi của bạn..."
          rows={3}
          style={{ marginBottom: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {allowAnonymous && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
              🎭 Ẩn danh
            </label>
          )}
          <button type="submit" className="btn-primary" disabled={submitting || !text.trim()} style={{ marginLeft: 'auto' }}>
            {submitting ? '...' : 'Gửi câu hỏi'}
          </button>
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 6 }}>{error}</p>}
      </form>

      {visibleQuestions.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 10 }}>Câu hỏi đã gửi</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleQuestions.map(q => (
              <div key={q.id} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: q.status === 'featured' ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  {q.status === 'featured' && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', borderRadius: 4, padding: '1px 6px', marginBottom: 4, display: 'inline-block' }}>⭐ Nổi bật</span>}
                  <p style={{ fontSize: '0.9rem' }}>{q.question_text}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {q.is_anonymous ? '🎭 Ẩn danh' : '👤 Bạn'}
                  </p>
                </div>
                {allowUpvote && (
                  <button
                    onClick={() => upvote(q.id)}
                    disabled={upvoted.has(q.id)}
                    style={{
                      background: upvoted.has(q.id) ? 'var(--primary)' : 'var(--border)',
                      color: upvoted.has(q.id) ? 'white' : 'var(--text)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    👍 {q.upvote_count}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
