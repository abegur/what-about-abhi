'use client'
// TrainingPlanTable.tsx — Full 24-week plan overview with sticky header.
// Current week: terracotta border. Past weeks: actual vs planned miles.
// Recalibrated weeks: "↻ Adjusted" badge.

import type { TrainingPlan, WorkoutLog } from '../types'
import { getCurrentWeek, parseLocalDate, weekActualMiles, PHASE_LABELS, PHASE_COLORS } from '../types'

interface Props {
  trainingPlan: TrainingPlan[]
  workoutLogs: WorkoutLog[]
}

function formatWeekDates(startDateStr: string): string {
  const start = parseLocalDate(startDateStr)
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  const fmtShort = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmtShort(start)} – ${fmtShort(end)}`
}

export default function TrainingPlanTable({ trainingPlan, workoutLogs }: Props) {
  const now = new Date()
  const currentWeek = getCurrentWeek(trainingPlan)
  const currentWeekNum = currentWeek?.week_number ?? 0

  return (
    <div className="bg-surface border border-warm/5 rounded-2xl overflow-hidden">
      <div className="p-6 pb-0">
        <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-5">24-Week Training Plan</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead className="sticky top-0 bg-surface z-10">
            <tr className="border-b border-warm/5">
              {['Wk', 'Dates', 'Phase', 'Target', 'Runs', 'Lifts', 'Miles'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] text-warm/30 tracking-widest uppercase px-4 py-3 font-normal whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainingPlan.map((week) => {
              const isCurrent = week.week_number === currentWeekNum
              const weekStart = parseLocalDate(week.week_start_date)
              const isPast = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) < now && !isCurrent
              const phaseColor = PHASE_COLORS[week.phase]
              const actual = weekActualMiles(week.week_number, workoutLogs)
              const runDays = week.planned_runs.map((r) => r.day.slice(0, 3)).join('/')
              const liftDays = week.planned_lifts.map((l) => l.workout).join('/')

              return (
                <tr
                  key={week.week_number}
                  className={`border-b border-warm/5 last:border-0 transition-colors ${
                    isCurrent
                      ? 'bg-terracotta/5'
                      : isPast
                      ? 'opacity-50'
                      : 'hover:bg-warm/[0.02]'
                  }`}
                >
                  {/* Week number */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${isCurrent ? 'text-terracotta' : 'text-warm/60'}`}
                      >
                        {week.week_number}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-terracotta/30 text-terracotta/70 leading-none">
                          NOW
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="px-4 py-3 text-warm/50 text-xs whitespace-nowrap">
                    {formatWeekDates(week.week_start_date)}
                  </td>

                  {/* Phase */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ color: phaseColor, background: `${phaseColor}18` }}
                    >
                      {PHASE_LABELS[week.phase]}
                    </span>
                  </td>

                  {/* Target miles */}
                  <td className="px-4 py-3 text-warm/70 whitespace-nowrap">
                    {week.target_weekly_miles} mi
                    {week.is_recalibrated && (
                      <span className="ml-1.5 text-[9px] text-orange-400/80 border border-orange-400/20 px-1 py-0.5 rounded">
                        ↻ Adjusted
                      </span>
                    )}
                  </td>

                  {/* Planned runs */}
                  <td className="px-4 py-3 text-warm/40 text-xs whitespace-nowrap">
                    {runDays || '—'}
                  </td>

                  {/* Planned lifts */}
                  <td className="px-4 py-3 text-warm/40 text-xs whitespace-nowrap">
                    {liftDays || '—'}
                  </td>

                  {/* Miles actual / planned */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isPast || isCurrent ? (
                      <span className={actual > 0 ? 'text-warm/70' : 'text-warm/25'}>
                        {actual > 0 ? actual.toFixed(1) : '—'}
                        <span className="text-warm/25 text-xs"> / {week.target_weekly_miles}</span>
                      </span>
                    ) : (
                      <span className="text-warm/20 text-xs">{week.target_weekly_miles}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
