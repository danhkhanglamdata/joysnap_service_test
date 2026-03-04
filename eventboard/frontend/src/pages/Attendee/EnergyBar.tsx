import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface Energy {
  current: number
  target: number
  pct: number
}

interface EnergyBarProps {
  energy: Energy
}

export default function EnergyBar({ energy }: EnergyBarProps) {
  const prevPctRef = useRef<number>(0)

  useEffect(() => {
    const prev = prevPctRef.current

    // Check milestone hits: 50%, 80%, 100%
    const milestones = [50, 80, 100]
    for (const m of milestones) {
      if (energy.pct >= m && prev < m) {
        const isFull = m === 100
        confetti({
          particleCount: isFull ? 150 : 80,
          spread: isFull ? 80 : 60,
          origin: { y: 0.6 },
          ...(isFull ? {} : { colors: ['#f59e0b', '#fbbf24', '#fb923c'] }),
        })
        break // Only one confetti per update
      }
    }

    prevPctRef.current = energy.pct
  }, [energy.pct])

  const color = energy.pct >= 100 ? '#22c55e' : energy.pct >= 80 ? '#f59e0b' : 'var(--primary)'

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3>⚡ Energy Bar</h3>
        <span style={{ fontWeight: 700, color }}>
          {energy.current}/{energy.target}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 24, background: 'var(--border)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(energy.pct, 100)}%`,
            background: color,
            borderRadius: 999,
            transition: 'width 0.5s ease, background 0.3s',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>0%</span>
        <span style={{ fontWeight: 600, color }}>
          {energy.pct >= 100 ? '🎉 Đạt mục tiêu!' : `${energy.pct.toFixed(1)}%`}
        </span>
        <span>100%</span>
      </div>

      {/* Milestone markers */}
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        {[50, 80, 100].map(m => (
          <span
            key={m}
            style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: 999,
              background: energy.pct >= m ? color : 'var(--border)',
              color: energy.pct >= m ? 'white' : 'var(--text-muted)',
              transition: 'background 0.3s',
            }}
          >
            {m}% {m === 50 ? '🔥' : m === 80 ? '💪' : '🏆'}
          </span>
        ))}
      </div>
    </div>
  )
}
