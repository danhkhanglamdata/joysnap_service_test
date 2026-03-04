import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../lib/api'

type Step = 1 | 2 | 3 | 4

interface EventData {
  title: string
  description: string
  event_date: string
  location: string
  color: string
  settings: {
    features_enabled: Record<string, boolean>
    form_fields: string[]
    form_gate: string
  }
}

const FEATURES = [
  { key: 'moment_wall', label: 'Moment Wall', icon: '📸', desc: 'Feed khoảnh khắc text + emoji real-time' },
  { key: 'energy_bar', label: 'Energy Bar', icon: '⚡', desc: 'Thanh tiến trình tập thể' },
  { key: 'lucky_spin', label: 'Lucky Spin', icon: '🎰', desc: 'Vòng quay may mắn' },
  { key: 'live_poll', label: 'Live Poll', icon: '📊', desc: 'Bình chọn real-time' },
  { key: 'qa_session', label: 'Q&A Ẩn Danh', icon: '❓', desc: 'Câu hỏi + upvote' },
]

const FORM_FIELDS = ['name', 'phone', 'email', 'custom']
const FIELD_LABELS: Record<string, string> = { name: 'Họ tên', phone: 'Số điện thoại', email: 'Email', custom: 'Câu hỏi tùy chỉnh' }

export default function EventSetup() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('organizer_token')
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(eventId ?? null)
  const [qr, setQR] = useState<{ qr_base64: string; url: string } | null>(null)
  const [toast, setToast] = useState('')

  const [data, setData] = useState<EventData>({
    title: '',
    description: '',
    event_date: '',
    location: '',
    color: '#6C63FF',
    settings: {
      features_enabled: {
        moment_wall: true,
        energy_bar: true,
        lucky_spin: false,
        live_poll: true,
        qa_session: true,
      },
      form_fields: ['name', 'phone'],
      form_gate: 'on_entry',
    },
  })

  useEffect(() => {
    if (!token) { navigate('/organizer/login'); return }
    if (eventId) {
      api.getEvent(token, eventId)
        .then(ev => {
          const e = ev as EventData & { settings: EventData['settings'] }
          setData({
            title: (e as unknown as Record<string, string>).title ?? '',
            description: (e as unknown as Record<string, string>).description ?? '',
            event_date: (e as unknown as Record<string, string>).event_date?.slice(0, 16) ?? '',
            location: (e as unknown as Record<string, string>).location ?? '',
            color: (e as unknown as Record<string, string>).color ?? '#6C63FF',
            settings: e.settings ?? data.settings,
          })
        })
        .catch(() => {})
    }
  }, [eventId, token]) // eslint-disable-line react-hooks/exhaustive-deps

  async function saveAndContinue() {
    if (!token) return
    setSaving(true)
    try {
      const payload = {
        ...data,
        event_date: data.event_date ? new Date(data.event_date).toISOString() : undefined,
      }

      if (savedId) {
        await api.updateEvent(token, savedId, payload)
      } else {
        const ev = await api.createEvent(token, payload) as { id: string }
        setSavedId(ev.id)
      }

      if (step < 4) {
        setStep(s => (s + 1) as Step)
      } else {
        // Step 4: publish + get QR
        await api.updateEvent(token, savedId!, { status: 'active' })
        const qrData = await api.getEventQR(token, savedId!)
        setQR(qrData)
        showToast('Sự kiện đã được xuất bản! 🎉')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi lưu sự kiện')
    } finally {
      setSaving(false)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function toggleFeature(key: string) {
    setData(d => ({
      ...d,
      settings: {
        ...d.settings,
        features_enabled: { ...d.settings.features_enabled, [key]: !d.settings.features_enabled[key] },
      },
    }))
  }

  function toggleFormField(field: string) {
    setData(d => {
      const fields = d.settings.form_fields.includes(field)
        ? d.settings.form_fields.filter(f => f !== field)
        : [...d.settings.form_fields, field]
      return { ...d, settings: { ...d.settings, form_fields: fields } }
    })
  }

  if (qr) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h2 style={{ color: 'var(--primary)', marginBottom: 8 }}>Sự kiện đã xuất bản!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Chia sẻ QR code này với người tham dự</p>
          <img src={qr.qr_base64} alt="QR Code" style={{ width: 240, height: 240, margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, wordBreak: 'break-all' }}>{qr.url}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigator.clipboard.writeText(qr.url).then(() => showToast('Đã copy link!'))}>
              Copy Link
            </button>
            <button onClick={() => navigate('/organizer/dashboard')} style={{ background: 'var(--border)', color: 'var(--text)' }}>
              Về Dashboard
            </button>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 20 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {([1, 2, 3, 4] as Step[]).map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= s ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
          ))}
        </div>

        <h2 style={{ marginBottom: 4 }}>
          {step === 1 && '📋 Bước 1: Thông tin cơ bản'}
          {step === 2 && '🎨 Bước 2: Cấu hình tính năng'}
          {step === 3 && '🔒 Bước 3: Gate Config'}
          {step === 4 && '🚀 Bước 4: Xem lại & Xuất bản'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Bước {step}/4</p>

        <div className="card" style={{ marginBottom: 20 }}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FormField label="Tên sự kiện *">
                <input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} placeholder="VD: YEP 2026 Company Party" required />
              </FormField>
              <FormField label="Mô tả">
                <textarea value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} placeholder="Giới thiệu ngắn về sự kiện" rows={3} />
              </FormField>
              <FormField label="Ngày giờ">
                <input type="datetime-local" value={data.event_date} onChange={e => setData(d => ({ ...d, event_date: e.target.value }))} />
              </FormField>
              <FormField label="Địa điểm">
                <input value={data.location} onChange={e => setData(d => ({ ...d, location: e.target.value }))} placeholder="VD: GEM Center, TP.HCM" />
              </FormField>
              <FormField label="Màu chủ đạo">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input type="color" value={data.color} onChange={e => setData(d => ({ ...d, color: e.target.value }))} style={{ width: 48, height: 40, padding: 2 }} />
                  <input value={data.color} onChange={e => setData(d => ({ ...d, color: e.target.value }))} placeholder="#6C63FF" style={{ flex: 1 }} />
                </div>
              </FormField>
            </div>
          )}

          {/* Step 2: Features */}
          {step === 2 && (
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Bật/tắt các tính năng cho sự kiện</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FEATURES.map(f => (
                  <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '2px solid', borderColor: data.settings.features_enabled[f.key] ? 'var(--primary)' : 'var(--border)', borderRadius: 8, cursor: 'pointer', background: data.settings.features_enabled[f.key] ? '#f0eeff' : 'transparent' }}>
                    <input type="checkbox" checked={!!data.settings.features_enabled[f.key]} onChange={() => toggleFeature(f.key)} style={{ width: 18, height: 18 }} />
                    <span style={{ fontSize: 24 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{f.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Gate Config */}
          {step === 3 && (
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Cấu hình form thu thập thông tin người tham dự</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 10 }}>Trường thông tin cần thu thập</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {FORM_FIELDS.map(f => (
                    <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" checked={data.settings.form_fields.includes(f)} onChange={() => toggleFormField(f)} style={{ width: 16, height: 16 }} />
                      {FIELD_LABELS[f]}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Thời điểm hiện form</label>
                <select value={data.settings.form_gate} onChange={e => setData(d => ({ ...d, settings: { ...d.settings, form_gate: e.target.value } }))}>
                  <option value="on_entry">Khi vào sự kiện</option>
                  <option value="before_post">Trước khi đăng bài</option>
                  <option value="before_spin">Trước khi quay thưởng</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Tên sự kiện</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{data.title}</div>
              </div>
              {data.event_date && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Ngày giờ</div>
                  <div>{new Date(data.event_date).toLocaleString('vi-VN')}</div>
                </div>
              )}
              {data.location && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Địa điểm</div>
                  <div>{data.location}</div>
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Tính năng được bật</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FEATURES.filter(f => data.settings.features_enabled[f.key]).map(f => (
                    <span key={f.key} style={{ background: 'var(--primary)', color: 'white', borderRadius: 999, padding: '4px 12px', fontSize: '0.85rem' }}>
                      {f.icon} {f.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, padding: 12, fontSize: '0.9rem' }}>
                ⚠️ Sau khi xuất bản, sự kiện sẽ chuyển sang trạng thái <strong>active</strong> và người tham dự có thể tham gia.
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => (s - 1) as Step)} style={{ background: 'var(--border)', color: 'var(--text)' }}>
              ← Quay lại
            </button>
          )}
          <button className="btn-primary" style={{ flex: 1 }} onClick={saveAndContinue} disabled={saving || (step === 1 && !data.title)}>
            {saving ? 'Đang lưu...' : step === 4 ? '🚀 Xuất bản & Lấy QR Code' : 'Tiếp theo →'}
          </button>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}
