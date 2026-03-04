import { useState, useRef } from 'react'
import { api } from '../../lib/api'
import type { Session } from '../../hooks/useSession'

interface Prize {
  id: string
  label: string
  prob: number
}

interface Activity {
  id: string
  config: {
    prizes?: Prize[]
  }
  gate_config: Record<string, unknown>
}

interface LuckySpinProps {
  eventId: string
  activity: Activity
  session: Session
}

export default function LuckySpin({ eventId, activity, session }: LuckySpinProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{ id: string; label: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const hasSpun = session.spin_used

  const prizes = activity.config.prizes ?? []

  async function spin() {
    if (spinning || hasSpun || result) return
    setError(null)
    setSpinning(true)

    // Start animation — spin fast then slow down
    const spins = 5 + Math.random() * 3 // 5-8 full rotations
    const targetRotation = rotation + spins * 360

    setRotation(targetRotation)

    // Wait for animation (2.5s) then call server
    await new Promise(r => setTimeout(r, 2500))

    try {
      const data = await api.spin(eventId, activity.id)
      setResult(data.prize)
    } catch (err) {
      if (err instanceof Error && err.message.includes('Already spun')) {
        setError('Bạn đã quay rồi!')
      } else if (err instanceof Error && err.message.includes('Gate')) {
        setError('Bạn chưa đủ điều kiện để quay. Hãy điền form trước!')
      } else {
        setError(err instanceof Error ? err.message : 'Lỗi quay thưởng')
      }
    } finally {
      setSpinning(false)
    }
  }

  const segmentAngle = prizes.length > 0 ? 360 / prizes.length : 360
  const colors = ['#6C63FF', '#FF6584', '#43E97B', '#F7971E', '#5B86E5', '#FC5C7D']

  return (
    <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
      <h3 style={{ marginBottom: 4 }}>🎰 Lucky Spin</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
        {hasSpun ? 'Bạn đã quay rồi!' : 'Chỉ được quay 1 lần duy nhất'}
      </p>

      {/* Wheel */}
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 20px' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            border: '4px solid var(--primary)',
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 2.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {prizes.length > 0 ? (
            prizes.map((prize, i) => (
              <WheelSegment key={prize.id} label={prize.label} index={i} total={prizes.length} color={colors[i % colors.length]} />
            ))
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              🎁
            </div>
          )}
        </div>

        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '24px solid var(--primary)',
          zIndex: 10,
        }} />
      </div>

      {result && (
        <div style={{ background: '#fef9c3', border: '2px solid #fde68a', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🎁</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Chúc mừng!</div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.3rem', marginTop: 4 }}>{result.label}</div>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>
      )}

      <button
        className="btn-primary"
        onClick={spin}
        disabled={spinning || hasSpun || !!result}
        style={{ fontSize: '1.1rem', padding: '12px 32px' }}
      >
        {spinning ? '🌀 Đang quay...' : hasSpun || result ? '✅ Đã quay' : '🎰 QUAY NGAY'}
      </button>
    </div>
  )
}

function WheelSegment({ label, index, total, color }: { label: string; index: number; total: number; color: string }) {
  const angle = 360 / total
  const startAngle = index * angle

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        transformOrigin: '50% 50%',
        transform: `rotate(${startAngle}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '50%',
          height: '50%',
          transformOrigin: '0% 100%',
          background: color,
          clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: 700, transform: `rotate(${angle / 2}deg) translateX(20px)`, maxWidth: 60, textAlign: 'center', lineHeight: 1.2 }}>
          {label.length > 12 ? label.slice(0, 12) + '…' : label}
        </span>
      </div>
    </div>
  )
}
