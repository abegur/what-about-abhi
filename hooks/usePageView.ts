'use client'
// hooks/usePageView.ts
// Fires page_view on mount and page_exit with time-on-page when the route changes.
// Use via AnalyticsProvider — do not call directly in layout.tsx (Server Component).

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'

const EXCLUDED_PATHS = ['/exercise-tracker']

export function usePageView(): void {
  const pathname = usePathname()
  const entryTime = useRef<number>(0)

  useEffect(() => {
    if (EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) return

    entryTime.current = Date.now()
    track('page_view', pathname, { referrer: document.referrer })

    return () => {
      const seconds = Math.round((Date.now() - entryTime.current) / 1000)
      track('page_exit', pathname, { time_spent_seconds: seconds })
    }
  }, [pathname])
}
