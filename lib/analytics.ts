// lib/analytics.ts
// Fire-and-forget analytics client.
// Call track() from event handlers and useEffect — never during render.
// All calls are non-blocking and fail silently: the UX is never interrupted.

import type { EventName } from '@/types/analytics'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    const key = 'ab_session_id'
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return ''
  }
}

export function isTrackingPaused(): boolean {
  if (typeof window === 'undefined') return false
  try { return localStorage.getItem('ab_tracking_paused') === 'true' } catch { return false }
}

export function setTrackingPaused(paused: boolean): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem('ab_tracking_paused', String(paused)) } catch {}
}

export function track(
  event_name: EventName,
  page_path: string,
  metadata: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') return
  if (isTrackingPaused()) return
  const session_id = getSessionId()
  if (!session_id) return

  // Fire-and-forget: no await, swallow all errors
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_name, page_path, session_id, metadata }),
  }).catch(() => {})
}
