'use client'
// ProgressStats.tsx — 4 KPI stat cards matching the site's dashboard card style.

import type { TrainingPlan, WorkoutLog } from '../types'
import { getCurrentWeek, daysUntilRace, weekActualMiles } from '../types'

interface Props {
  trainingPlan: TrainingPlan[]
  workoutLogs: WorkoutLog[]
}

interface StatCard {
  label: string
  value: string
  sub?: string
}

export default function ProgressStats({ trainingPlan, workoutLogs }: Props) {
  const currentWeek = getCurrentWeek(trainingPlan)
  const weekNum = currentWeek?.week_number ?? 0

  const totalMiles = workoutLogs
    .filter((l) => l.workout_type === 'run' && l.status === 'completed')
    .reduce((sum, l) => sum + (l.miles ?? 0), 0)

  const thisWeekLogs = workoutLogs.filter((l) => l.week_number === weekNum)
  const runsCompleted = thisWeekLogs.filter((l) => l.workout_type === 'run' && l.status === 'completed').length
  const liftsCompleted = thisWeekLogs.filter((l) => l.workout_type === 'lift' && l.status === 'completed').length
  const runsPlanned = currentWeek?.planned_runs.length ?? 0
  const liftsPlanned = currentWeek?.planned_lifts.length ?? 0

  const weeksToRace = trainingPlan.filter((w) => {
    const now = new Date()
    const start = new Date(w.week_start_date)
    return start > now
  }).length

  const _ = weekActualMiles // used elsewhere, silence unused import

  const cards: StatCard[] = [
    {
      label: 'Total Miles',
      value: totalMiles.toFixed(1),
      sub: 'all time',
    },
    {
      label: 'Runs This Week',
      value: weekNum === 0 ? '—' : `${runsCompleted} / ${runsPlanned}`,
      sub: 'completed',
    },
    {
      label: 'Lifts This Week',
      value: weekNum === 0 ? '—' : `${liftsCompleted} / ${liftsPlanned}`,
      sub: 'completed',
    },
    {
      label: 'Weeks to Race',
      value: String(weeksToRace),
      sub: 'remaining',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          {card.sub && <p className="text-warm/30 text-[11px]">{card.sub}</p>}
        </div>
      ))}
    </div>
  )
}
