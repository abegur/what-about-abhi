'use client'
// hooks/useScrollDepth.ts
// Fires scroll_depth events at 25/50/75/100% scroll thresholds.
// Each threshold fires only once per component mount (= once per page visit).

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

export function useScrollDepth(pagePath: string): void {
  const firedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    firedRef.current = new Set()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const pct = Math.round((scrollTop / docHeight) * 100)

      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold)
          track('scroll_depth', pagePath, { depth: threshold })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pagePath])
}
