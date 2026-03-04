import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { useSession } from '../../hooks/useSession'
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime'
import Wall from './Wall'
import EnergyBar from './EnergyBar'
import LuckySpin from './LuckySpin'
import Poll from './Poll'
import QA from './QA'

interface EventInfo {
  id: string
  title: string
  description: string | null
  color: string
  logo_url: string | null
  status: string
  settings: {
    features_enabled?: Record<string, boolean>
    form_fields?: string[]
    form_gate?: string
  }
}

interface Activity {
  id: string
  type: string
  title: string | null
  status: string
  config: Record<string, unknown>
  gate_config: Record<string, unknown>
}

interface Post {
  id: string
  author_name: string
  content: string
  vibe_emoji: string
  created_at: string
}

interface Energy {
  current: number
  target: number
  pct: number
}

export default function EventEntry() {
  const { eventId } = useParams<{ eventId: string }>()
  const { session, loading: sessionLoading, updateSession } = useSession(eventId)

  const [event, setEvent] = useState<EventInfo | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [energy, setEnergy] = useState<Energy | null>(null)
  const [activePoll, setActivePoll] = useState<Activity | null>(null)
  const [activeQA, setActiveQA] = useState<Activity | null>(null)
  const [spinActivity, setSpinActivity] = useState<Activity | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [announcement, setAnnouncement] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Load event info
  useEffect(() => {
    if (!eventId) return
    api.getEventInfo(eventId)
      .then(data => setEvent(data as EventInfo))
      .catch(() => {})
  }, [eventId])

  // Load full state after session is ready
  useEffect(() => {
    if (!eventId || !session) return
    api.getEventState(eventId).then((state: unknown) => {
      const s = state as { activities: Activity[]; posts: Post[]; energy: Energy | null }
      setActivities(s.activities ?? [])
      setPosts(s.posts ?? [])
      setEnergy(s.energy)

      // Find active activities
      const poll = s.activities.find((a: Activity) => a.type === 'LIVE_POLL' && a.status === 'active')
      const qa = s.activities.find((a: Activity) => a.type === 'QA_SESSION' && a.status === 'active')
      const spin = s.activities.find((a: Activity) => a.type === 'LUCKY_SPIN' && a.status === 'active')
      if (poll) setActivePoll(poll)
      if (qa) setActiveQA(qa)
      if (spin) setSpinActivity(spin)
    }).catch(() => {})
  }, [eventId, session])

  // Check if form should show
  useEffect(() => {
    if (!session || !event) return
    const gate = event.settings?.form_gate ?? 'on_entry'
    if (gate === 'on_entry' && !session.form_filled) {
      setShowForm(true)
    }
  }, [session, event])

  // Realtime handlers
  const onNewPost = useCallback((payload: unknown) => {
    const p = payload as { post: Post; energy?: Energy }
    setPosts(prev => [p.post, ...prev.slice(0, 49)])
    if (p.energy) setEnergy(p.energy)
  }, [])

  const onEnergyUpdate = useCallback((payload: unknown) => {
    setEnergy(payload as Energy)
  }, [])

  const onEnergyFull = useCallback((payload: unknown) => {
    const p = payload as { message: string }
    showToast(p.message || '🎉 Đạt mục tiêu!')
  }, [])

  const onEnergyMilestone = useCallback((payload: unknown) => {
    const p = payload as { pct: number; message: string }
    showToast(p.message || `🎯 Đạt ${p.pct}%!`)
  }, [])

  const onSpinOpened = useCallback((payload: unknown) => {
    const p = payload as { msg: string }
    showToast(p.msg || '🎰 Vòng quay đã mở!')
  }, [])

  const onActivityStarted = useCallback((payload: unknown) => {
    const act = (payload as { activity: Activity }).activity
    setActivities(prev => prev.map(a => a.id === act.id ? act : a))
    if (act.type === 'LUCKY_SPIN') setSpinActivity(act)
    if (act.type === 'QA_SESSION') setActiveQA(act)
  }, [])

  const onPollStarted = useCallback((payload: unknown) => {
    const poll = (payload as { poll?: Activity }).poll
    if (poll) setActivePoll(poll)
  }, [])

  const onAnnouncement = useCallback((payload: unknown) => {
    const p = payload as { msg: string }
    setAnnouncement(p.msg)
    setTimeout(() => setAnnouncement(null), 6000)
  }, [])

  useSupabaseRealtime(eventId, {
    onNewPost,
    onEnergyUpdate,
    onEnergyFull,
    onEnergyMilestone,
    onSpinOpened,
    onActivityStarted,
    onPollStarted,
    onAnnouncement,
  })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  if (sessionLoading) return <div className="spinner">⚡ Đang tham gia sự kiện...</div>
  if (!event) return <div className="spinner">Đang tải thông tin sự kiện...</div>
  if (event.status !== 'active') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <h2>Sự kiện chưa bắt đầu</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Vui lòng chờ organizer mở sự kiện</p>
        </div>
      </div>
    )
  }

  const features = event.settings?.features_enabled ?? {}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
      {/* Event header */}
      <div style={{ background: event.color, color: 'white', padding: '20px 16px', textAlign: 'center' }}>
        {event.logo_url && <img src={event.logo_url} alt="logo" style={{ height: 48, marginBottom: 8, objectFit: 'contain' }} />}
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{event.title}</h1>
        {event.description && <p style={{ opacity: 0.85, marginTop: 4, fontSize: '0.9rem' }}>{event.description}</p>}
      </div>

      {/* Lead form modal */}
      {showForm && session && (
        <LeadForm
          event={event}
          eventId={eventId!}
          onDone={() => {
            setShowForm(false)
            updateSession({ form_filled: true })
          }}
        />
      )}

      {/* Announcement banner */}
      {announcement && (
        <div style={{ background: '#1a1a2e', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 600 }}>
          📢 {announcement}
        </div>
      )}

      <div style={{ padding: '16px', maxWidth: 600, margin: '0 auto' }}>
        {/* Energy Bar */}
        {features.energy_bar && energy && (
          <EnergyBar energy={energy} />
        )}

        {/* Moment Wall */}
        {features.moment_wall && session && (
          <Wall eventId={eventId!} posts={posts} session={session} />
        )}

        {/* Lucky Spin */}
        {features.lucky_spin && spinActivity && session && (
          <LuckySpin eventId={eventId!} activity={spinActivity} session={session} />
        )}

        {/* Live Poll */}
        {features.live_poll && activePoll && session && (
          <Poll eventId={eventId!} activity={activePoll} session={session} />
        )}

        {/* Q&A */}
        {features.qa_session && activeQA && session && (
          <QA eventId={eventId!} activity={activeQA} session={session} />
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

// Lead form component
function LeadForm({ event, eventId, onDone }: { event: EventInfo; eventId: string; onDone: () => void }) {
  const fields = event.settings?.form_fields ?? ['name', 'phone']
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const LABELS: Record<string, string> = {
    name: 'Họ và tên',
    phone: 'Số điện thoại',
    email: 'Email',
    custom: 'Câu hỏi',
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.submitForm(eventId, {
        name: values.name,
        phone: values.phone,
        email: values.email,
        custom_ans: values.custom,
      })
      onDone()
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h3 style={{ marginBottom: 4, color: event.color }}>👋 Chào mừng bạn!</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>Điền thông tin để tham gia đầy đủ</p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(field => (
            <div key={field}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>{LABELS[field]}</label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                value={values[field] ?? ''}
                onChange={e => setValues(v => ({ ...v, [field]: e.target.value }))}
                placeholder={LABELS[field]}
              />
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Tham gia ngay!'}
          </button>
        </form>
      </div>
    </div>
  )
}
