'use client'
// components/dashboard/PageBreakdownChart.tsx — Horizontal bar chart: views by page

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import type { PageViewsByPath } from '@/types/analytics'

interface Props {
  data: PageViewsByPath[]
}

const tickStyle = { fill: 'rgba(240,235,227,0.35)', fontSize: 11 }

function formatPath(path: string) {
  if (path === '/') return 'Home'
  return path.replace('/', '').replace(/-/g, ' ')
}

export default function PageBreakdownChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center">
        <p className="text-warm/25 text-sm">No data yet</p>
      </div>
    )
  }

  const formatted = data.map((d) => ({ ...d, label: formatPath(d.page_path) }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={formatted}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 0, left: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,235,227,0.05)" horizontal={false} />
        <XAxis type="number" tick={tickStyle} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          tick={tickStyle}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            background: '#2a2420',
            border: '1px solid rgba(196,112,63,0.3)',
            borderRadius: '8px',
            color: '#f0ebe3',
            fontSize: 12,
          }}
          cursor={{ fill: 'rgba(196,112,63,0.05)' }}
        />
        <Bar dataKey="views" radius={[0, 4, 4, 0]}>
          {formatted.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? '#c4703f' : 'rgba(196,112,63,0.4)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
