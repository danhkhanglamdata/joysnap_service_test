/** Thin wrapper for calling the EventBoard backend API. */

const BASE = '/api'

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const sessionToken = getSessionToken()
  if (sessionToken) {
    headers['x-session-token'] = sessionToken
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }

  return res.json() as Promise<T>
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; user: { id: string; email: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),

  register: (email: string, password: string, full_name: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    }),

  me: (token: string) => request('/auth/me', {}, token),

  // Events
  createEvent: (token: string, data: object) =>
    request('/events', { method: 'POST', body: JSON.stringify(data) }, token),

  listEvents: (token: string) => request('/events', {}, token),

  getEvent: (token: string, id: string) => request(`/events/${id}`, {}, token),

  updateEvent: (token: string, id: string, data: object) =>
    request(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),

  getEventQR: (token: string, id: string) =>
    request<{ qr_base64: string; url: string }>(`/events/${id}/qr`, {}, token),

  getAnalytics: (token: string, id: string) =>
    request(`/events/${id}/analytics`, {}, token),

  exportLeads: (token: string, id: string) =>
    fetch(`${BASE}/events/${id}/leads/export`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  sendAnnouncement: (token: string, id: string, message: string) =>
    request(`/events/${id}/announce`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }, token),

  // Activities
  createActivity: (token: string, eventId: string, data: object) =>
    request(`/events/${eventId}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  listActivities: (token: string, eventId: string) =>
    request(`/events/${eventId}/activities`, {}, token),

  updateActivity: (token: string, eventId: string, actId: string, data: object) =>
    request(`/events/${eventId}/activities/${actId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),

  reorderActivities: (token: string, eventId: string, items: { id: string; position: number }[]) =>
    request(`/events/${eventId}/activities/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ items }),
    }, token),

  startActivity: (token: string, eventId: string, actId: string) =>
    request(`/events/${eventId}/activities/${actId}/start`, { method: 'POST' }, token),

  endActivity: (token: string, eventId: string, actId: string) =>
    request(`/events/${eventId}/activities/${actId}/end`, { method: 'POST' }, token),

  // Q&A (organizer)
  listQA: (token: string, eventId: string) =>
    request(`/events/${eventId}/qa`, {}, token),

  moderateQA: (token: string, eventId: string, qId: string, status: string) =>
    request(`/events/${eventId}/qa/${qId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, token),

  // Attendee
  getEventInfo: (eventId: string) => request(`/e/${eventId}`, {}),

  createSession: (eventId: string, token?: string, device_fp?: string) =>
    request(`/e/${eventId}/session`, {
      method: 'POST',
      body: JSON.stringify({ token, device_fp }),
    }),

  recoverSession: (eventId: string, phone: string) =>
    request(`/e/${eventId}/session/recover`, {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  getEventState: (eventId: string) => request(`/e/${eventId}/state`, {}),

  submitForm: (eventId: string, data: object) =>
    request(`/e/${eventId}/form`, { method: 'POST', body: JSON.stringify(data) }),

  createPost: (eventId: string, data: object) =>
    request(`/e/${eventId}/posts`, { method: 'POST', body: JSON.stringify(data) }),

  checkGate: (eventId: string, activity_id: string) =>
    request<{ allowed: boolean; missing: string[] }>(`/e/${eventId}/check-gate`, {
      method: 'POST',
      body: JSON.stringify({ activity_id }),
    }),

  spin: (eventId: string, activity_id: string) =>
    request<{ prize: { id: string; label: string } }>(`/e/${eventId}/spin`, {
      method: 'POST',
      body: JSON.stringify({ activity_id }),
    }),

  vote: (eventId: string, activity_id: string, option_index: number) =>
    request(`/e/${eventId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ activity_id, option_index }),
    }),

  submitQA: (eventId: string, data: object) =>
    request(`/e/${eventId}/qa`, { method: 'POST', body: JSON.stringify(data) }),

  upvoteQA: (eventId: string, qId: string) =>
    request(`/e/${eventId}/qa/${qId}/upvote`, { method: 'POST' }),
}

function getSessionToken(): string | null {
  // Extract event_id from URL to get the right token
  const match = window.location.pathname.match(/\/e\/([^/]+)/)
  if (match) {
    return localStorage.getItem(`tok_${match[1]}`)
  }
  return null
}
