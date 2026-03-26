'use client'
// components/dashboard/KPICards.tsx

import type { AnalyticsData } from '@/types/analytics'

interface Props {
  data: AnalyticsData
}

interface KPICard {
  label: string
  value: string
  sub?: string
}

export default function KPICards({ data }: Props) {
  const topPage = data.page_views_by_path[0]
  const topPageLabel = topPage
    ? (topPage.page_path === '/' ? 'Home' : topPage.page_path.replace('/', ''))
    : '—'

  // Average time across all pages
  const allTimes = data.avg_time_by_path.map((p) => p.avg_seconds)
  const avgTime = allTimes.length
    ? Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length)
    : 0
  const avgTimeLabel = avgTime >= 60
    ? `${Math.floor(avgTime / 60)}m ${avgTime % 60}s`
    : `${avgTime}s`

  const totalEggs = data.easter_egg_counts.reduce((sum, e) => sum + e.count, 0)

  // Sessions that triggered at least one easter egg
  const eggSessions = new Set<string>()
  // (approximation: can't get per-session from aggregated data; use ratio)
  const discoveryRate = data.unique_sessions > 0
    ? Math.round((totalEggs / data.unique_sessions) * 100)
    : 0

  const cards: KPICard[] = [
    { label: 'Total Page Views', value: data.total_views.toLocaleString() },
    { label: 'Unique Sessions', value: data.unique_sessions.toLocaleString() },
    { label: 'Most Visited Page', value: topPageLabel, sub: topPage ? `${topPage.views.toLocaleString()} views` : undefined },
    { label: 'Avg Time on Site', value: avgTimeLabel },
    { label: 'Easter Eggs Found', value: totalEggs.toLocaleString(), sub: 'total triggers' },
    { label: 'Egg Discovery Rate', value: `${discoveryRate}%`, sub: 'triggers per session' },
  ]

  void eggSessions

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface border border-warm/5 rounded-2xl p-5 flex flex-col gap-2"
        >
          <p className="text-warm/40 text-[10px] tracking-widest uppercase leading-tight">
            {card.label}
          </p>
          <div className="h-px w-8 bg-terracotta/40" />
          <p className="font-serif text-2xl text-cream leading-none mt-1">{card.value}</p>
          {card.sub && (
            <p className="text-warm/30 text-[11px]">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
