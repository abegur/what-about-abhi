'use client'
// components/dashboard/ScrollDepthChart.tsx — Bar chart: scroll depth distribution on home page

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
import type { ScrollDepthData } from '@/types/analytics'

interface Props {
  data: ScrollDepthData[]
}

const tickStyle = { fill: 'rgba(240,235,227,0.35)', fontSize: 11 }

export default function ScrollDepthChart({ data }: Props) {
  if (data.every((d) => d.count === 0)) {
    return (
      <div className="h-[180px] flex items-center justify-center">
        <p className="text-warm/25 text-sm">No scroll data yet</p>
      </div>
    )
  }

  const formatted = data.map((d) => ({ ...d, label: `${d.depth}%` }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,235,227,0.05)" vertical={false} />
        <XAxis dataKey="label" tick={tickStyle} tickLine={false} axisLine={false} />
        <YAxis tick={tickStyle} tickLine={false} axisLine={false} allowDecimals={false} />
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
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {formatted.map((_, i) => (
            <Cell
              key={i}
              fill={`rgba(196,112,63,${0.4 + i * 0.15})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
