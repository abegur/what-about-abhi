'use client'
// components/dashboard/EasterEggCounts.tsx — Stat cards for each easter egg

import type { EasterEggCount } from '@/types/analytics'

interface Props {
  data: EasterEggCount[]
}

const eggMeta: Record<string, { label: string; icon: string; desc: string }> = {
  hover_name_trick: { label: 'Name Hover', icon: '👋', desc: '3-second hover on name' },
  hidden_dot:       { label: 'Hidden Dot', icon: '⚫', desc: 'Bottom-right dot click' },
  bottom_message:   { label: 'Bottom Scroll', icon: '✦', desc: 'Scrolled to footer' },
  what_is_this_visit: { label: 'What Is This?', icon: '🔍', desc: 'Visited /what-is-this' },
}

export default function EasterEggCounts({ data }: Props) {
  const allEggs = Object.keys(eggMeta).map((type) => ({
    type,
    count: data.find((d) => d.type === type)?.count ?? 0,
    ...eggMeta[type],
  }))

  return (
    <div className="grid grid-cols-2 gap-3">
      {allEggs.map((egg) => (
        <div
          key={egg.type}
          className="bg-background border border-warm/5 rounded-xl p-4 flex flex-col gap-1"
        >
          <span className="text-xl">{egg.icon}</span>
          <p className="font-serif text-2xl text-cream">{egg.count.toLocaleString()}</p>
          <p className="text-warm/50 text-xs font-medium">{egg.label}</p>
          <p className="text-warm/25 text-[10px]">{egg.desc}</p>
        </div>
      ))}
    </div>
  )
}
