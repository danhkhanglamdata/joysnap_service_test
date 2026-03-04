import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export interface Session {
  id: string
  event_id: string
  session_token: string
  name: string | null
  phone: string | null
  email: string | null
  form_filled: boolean
  spin_used: boolean
  post_count: number
  points: number
}

const TOKEN_KEY = (eventId: string) => `tok_${eventId}`

/**
 * Manages attendee session lifecycle:
 * 1. Load token from localStorage
 * 2. Restore session from server (or create new)
 * 3. Persist token to localStorage + cookie
 */
export function useSession(eventId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initSession = useCallback(async () => {
    if (!eventId) return

    setLoading(true)
    setError(null)

    try {
      const storedToken = localStorage.getItem(TOKEN_KEY(eventId)) ?? undefined
      const deviceFp = await getDeviceFingerprint()

      const data = await api.createSession(eventId, storedToken, deviceFp) as Session

      // Persist token
      localStorage.setItem(TOKEN_KEY(eventId), data.session_token)
      document.cookie = `session_token=${data.session_token}; path=/; max-age=86400; SameSite=Strict`

      setSession(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Session error')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    initSession()
  }, [initSession])

  const recoverByPhone = useCallback(async (phone: string) => {
    if (!eventId) return
    try {
      const data = await api.recoverSession(eventId, phone) as Session
      localStorage.setItem(TOKEN_KEY(eventId), data.session_token)
      document.cookie = `session_token=${data.session_token}; path=/; max-age=86400; SameSite=Strict`
      setSession(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recovery failed')
    }
  }, [eventId])

  const updateSession = useCallback((updates: Partial<Session>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return { session, loading, error, recoverByPhone, updateSession }
}

/** Simple device fingerprint from navigator properties. */
async function getDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|')

  const encoder = new TextEncoder()
  const data = encoder.encode(components)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
}
