'use client'
// components/AnalyticsProvider.tsx
// A null-render "use client" component that mounts usePageView().
// Placed inside <body> in layout.tsx so page tracking works on every page
// without making layout.tsx a client component.

import { usePageView } from '@/hooks/usePageView'

export default function AnalyticsProvider() {
  usePageView()
  return null
}
