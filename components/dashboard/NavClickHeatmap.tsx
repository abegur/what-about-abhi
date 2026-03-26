'use client'
// components/dashboard/NavClickHeatmap.tsx — Ranked list of nav link clicks

import type { NavClickData } from '@/types/analytics'

interface Props {
  data: NavClickData[]
}

function formatDest(dest: string) {
  if (dest === '/') return 'Home'
  return dest.replace('/', '').replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function NavClickHeatmap({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-warm/25 text-sm py-4">No nav click data yet</p>
  }

  const max = data[0]?.clicks ?? 1

  return (
    <div className="space-y-2.5">
      {data.map((item) => (
        <div key={item.destination} className="flex items-center gap-3">
          <span className="text-warm/50 text-xs w-24 shrink-0 truncate">
            {formatDest(item.destination)}
          </span>
          <div className="flex-1 h-1.5 bg-warm/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta rounded-full transition-all duration-500"
              style={{ width: `${(item.clicks / max) * 100}%` }}
            />
          </div>
          <span className="text-warm/40 text-xs w-8 text-right shrink-0">
            {item.clicks}
          </span>
        </div>
      ))}
    </div>
  )
}
