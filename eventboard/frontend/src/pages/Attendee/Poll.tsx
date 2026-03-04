import { useState } from 'react'
import { api } from '../../lib/api'
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime'

interface Activity {
  id: string
  config: {
    question?: string
    options?: string[]
  }
}

interface Results {
  [key: number]: { count: number; pct: number }
}

interface PollProps {
  eventId: string
  activity: Activity
}

export default function Poll({ eventId, activity }: PollProps) {
  const [voted, setVoted] = useState<number | null>(null)
  const [results, setResults] = useState<Results>({})
  const [total, setTotal] = useState(0)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const question = activity.config.question ?? 'Bình chọn'
  const options = activity.config.options ?? []

  useSupabaseRealtime(eventId, {
    onPollUpdate: (payload) => {
      const p = payload as { poll_id: string; results: Results; total: number }
      if (p.poll_id === activity.id) {
        setResults(p.results)
        setTotal(p.total)
      }
    },
  })

  async function vote(index: number) {
    if (voted !== null || voting) return
    setVoting(true)
    setError(null)
    try {
      const data = await api.vote(eventId, activity.id, index) as { results: Results }
      setVoted(index)
      setResults(data.results)
    } catch (err) {
      if (err instanceof Error && err.message.includes('Already voted')) {
        setVoted(index)
      } else {
        setError(err instanceof Error ? err.message : 'Lỗi vote')
      }
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 4 }}>📊 Live Poll</h3>
      <p style={{ fontWeight: 600, marginBottom: 16 }}>{question}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt, i) => {
          const result = results[i]
          const pct = result?.pct ?? 0
          const isVoted = voted === i

          return (
            <button
              key={i}
              onClick={() => vote(i)}
              disabled={voted !== null || voting}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: '12px 16px',
                border: `2px solid ${isVoted ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 8,
                background: 'white',
                overflow: 'hidden',
              }}
            >
              {/* Progress fill */}
              {voted !== null && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isVoted ? 'rgba(108, 99, 255, 0.15)' : 'rgba(0,0,0,0.04)',
                    width: `${pct}%`,
                    transition: 'width 0.5s ease',
                  }}
                />
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: isVoted ? 700 : 400 }}>
                  {isVoted && '✓ '}{opt}
                </span>
                {voted !== null && (
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pct}%</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {error && <p style={{ color: 'var(--danger)', marginTop: 8, fontSize: '0.85rem' }}>{error}</p>}

      {total > 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 12, textAlign: 'right' }}>
          {total} người đã bình chọn
        </p>
      )}
    </div>
  )
}
