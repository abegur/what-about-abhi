'use client'
// components/dashboard/SessionTable.tsx — Recent sessions explorer

import type { SessionSummary } from '@/types/analytics'

interface Props {
  sessions: SessionSummary[]
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso))
}

function formatDuration(first: string, last: string) {
  const secs = Math.round((new Date(last).getTime() - new Date(first).getTime()) / 1000)
  if (secs < 60) return `${secs}s`
  return `${Math.floor(secs / 60)}m ${secs % 60}s`
}

function formatPages(pages: string[]) {
  return pages
    .map((p) => (p === '/' ? 'Home' : p.replace('/', '')))
    .join(', ')
}

export default function SessionTable({ sessions }: Props) {
  if (sessions.length === 0) {
    return <p className="text-warm/25 text-sm py-4">No sessions yet</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-warm/5">
            {['Session', 'First Seen', 'Duration', 'Events', 'Pages'].map((h) => (
              <th
                key={h}
                className="text-left text-[10px] text-terracotta tracking-widest uppercase pb-3 pr-6 font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr
              key={s.session_id}
              className={`border-b border-warm/5 ${i % 2 === 0 ? '' : 'bg-surface/40'}`}
            >
              <td className="py-3 pr-6 text-warm/40 font-mono text-xs">
                {s.session_id.slice(0, 8)}…
              </td>
              <td className="py-3 pr-6 text-warm/60">{formatDate(s.first_seen)}</td>
              <td className="py-3 pr-6 text-warm/60">{formatDuration(s.first_seen, s.last_seen)}</td>
              <td className="py-3 pr-6 text-warm/60">{s.event_count}</td>
              <td className="py-3 text-warm/50 text-xs max-w-[200px] truncate">
                {formatPages(s.pages_visited)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
