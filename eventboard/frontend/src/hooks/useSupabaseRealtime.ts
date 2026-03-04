import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

type EventHandlers = {
  onNewPost?: (payload: unknown) => void
  onEnergyUpdate?: (payload: unknown) => void
  onEnergyMilestone?: (payload: unknown) => void
  onEnergyFull?: (payload: unknown) => void
  onSpinOpened?: (payload: unknown) => void
  onActivityStarted?: (payload: unknown) => void
  onPollStarted?: (payload: unknown) => void
  onPollUpdate?: (payload: unknown) => void
  onAnnouncement?: (payload: unknown) => void
}

/**
 * Subscribe to all Supabase Realtime broadcast events for an event.
 * Automatically cleans up on unmount.
 */
export function useSupabaseRealtime(eventId: string | undefined, handlers: EventHandlers) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!eventId) return

    const channel = supabase.channel(`event:${eventId}`)

    if (handlers.onNewPost) {
      channel.on('broadcast', { event: 'NEW_POST' }, ({ payload }) => handlers.onNewPost!(payload))
    }
    if (handlers.onEnergyUpdate) {
      channel.on('broadcast', { event: 'ENERGY_UPDATE' }, ({ payload }) => handlers.onEnergyUpdate!(payload))
    }
    if (handlers.onEnergyMilestone) {
      channel.on('broadcast', { event: 'ENERGY_MILESTONE' }, ({ payload }) => handlers.onEnergyMilestone!(payload))
    }
    if (handlers.onEnergyFull) {
      channel.on('broadcast', { event: 'ENERGY_FULL' }, ({ payload }) => handlers.onEnergyFull!(payload))
    }
    if (handlers.onSpinOpened) {
      channel.on('broadcast', { event: 'SPIN_OPENED' }, ({ payload }) => handlers.onSpinOpened!(payload))
    }
    if (handlers.onActivityStarted) {
      channel.on('broadcast', { event: 'ACTIVITY_STARTED' }, ({ payload }) => handlers.onActivityStarted!(payload))
    }
    if (handlers.onPollStarted) {
      channel.on('broadcast', { event: 'POLL_STARTED' }, ({ payload }) => handlers.onPollStarted!(payload))
    }
    if (handlers.onPollUpdate) {
      channel.on('broadcast', { event: 'POLL_UPDATE' }, ({ payload }) => handlers.onPollUpdate!(payload))
    }
    if (handlers.onAnnouncement) {
      channel.on('broadcast', { event: 'ANNOUNCEMENT' }, ({ payload }) => handlers.onAnnouncement!(payload))
    }

    channel.subscribe()
    channelRef.current = channel

    return () => {
      channel.unsubscribe()
      channelRef.current = null
    }
  }, [eventId]) // eslint-disable-line react-hooks/exhaustive-deps
}
