'use client'
// components/dashboard/PageViewsChart.tsx — Line chart: page views over last 30 days

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { PageViewsByDay } from '@/types/analytics'

interface Props {
  data: PageViewsByDay[]
}

const tickStyle = { fill: 'rgba(240,235,227,0.35)', fontSize: 11 }

export default function PageViewsChart({ data }: Props) {
  if (data.length === 0) {
    return <EmptyState label="No page view data yet" />
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,235,227,0.05)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={tickStyle}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const d = new Date(v)
            return `${d.getMonth() + 1}/${d.getDate()}`
          }}
        />
        <YAxis tick={tickStyle} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: '#2a2420',
            border: '1px solid rgba(196,112,63,0.3)',
            borderRadius: '8px',
            color: '#f0ebe3',
            fontSize: 12,
          }}
          labelStyle={{ color: 'rgba(240,235,227,0.5)', marginBottom: 4 }}
          cursor={{ stroke: 'rgba(196,112,63,0.3)' }}
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#c4703f"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#c4703f' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-[240px] flex items-center justify-center">
      <p className="text-warm/25 text-sm">{label}</p>
    </div>
  )
}
