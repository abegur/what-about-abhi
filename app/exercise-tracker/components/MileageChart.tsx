'use client'
// MileageChart.tsx — Bar chart of weekly actual vs target mileage for the last 8 weeks.
// Uses Recharts (already installed). Phase-colored bars, target reference line.

import {
  ComposedChart,
  Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { TrainingPlan, WorkoutLog } from '../types'
import { PHASE_COLORS, parseLocalDate, weekActualMiles } from '../types'

interface Props {
  trainingPlan: TrainingPlan[]
  workoutLogs: WorkoutLog[]
}

const tickStyle = { fill: 'rgba(240,235,227,0.35)', fontSize: 11 }

export default function MileageChart({ trainingPlan, workoutLogs }: Props) {
  const now = new Date()

  // Include weeks that have started (week_start_date <= today), last 8 max
  const pastWeeks = trainingPlan
    .filter((w) => parseLocalDate(w.week_start_date) <= now)
    .slice(-8)

  if (pastWeeks.length === 0) {
    return (
      <div className="bg-surface border border-warm/5 rounded-2xl p-6">
        <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-5">Weekly Mileage</p>
        <div className="h-[240px] flex items-center justify-center">
          <p className="text-warm/25 text-sm">Mileage chart will appear once training begins.</p>
        </div>
      </div>
    )
  }

  const chartData = pastWeeks.map((w) => {
    const start = parseLocalDate(w.week_start_date)
    const label = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const actual = Math.round(weekActualMiles(w.week_number, workoutLogs) * 10) / 10
    return {
      label,
      actual,
      target: w.target_weekly_miles,
      phase: w.phase,
    }
  })

  return (
    <div className="bg-surface border border-warm/5 rounded-2xl p-6">
      <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-5">Weekly Mileage — Last 8 Weeks</p>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
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
            labelStyle={{ color: 'rgba(240,235,227,0.5)', marginBottom: 4 }}
            cursor={{ fill: 'rgba(240,235,227,0.03)' }}
            formatter={(value, name) => [
              value != null ? `${value} mi` : '—',
              name === 'actual' ? 'Logged' : 'Target',
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: 'rgba(240,235,227,0.35)', paddingTop: 12 }}
            formatter={(value) => (value === 'actual' ? 'Logged miles' : 'Target miles')}
          />
          <Bar dataKey="actual" radius={[3, 3, 0, 0]} maxBarSize={48}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={PHASE_COLORS[entry.phase as keyof typeof PHASE_COLORS] ?? '#c4703f'}
                fillOpacity={0.75}
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="target"
            stroke="rgba(240,235,227,0.25)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Phase legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(PHASE_COLORS).map(([phase, color]) => (
          <span key={phase} className="flex items-center gap-1.5 text-[11px] text-warm/40 capitalize">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: color, opacity: 0.75 }} />
            {phase}
          </span>
        ))}
      </div>
    </div>
  )
}
