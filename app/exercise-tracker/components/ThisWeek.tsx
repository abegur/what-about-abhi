'use client'
// ThisWeek.tsx — Current week's planned sessions with status badges and log forms.

import { useState } from 'react'
import type { TrainingPlan, WorkoutLog, PlannedRun, PlannedLift } from '../types'
import { getCurrentWeek, parseLocalDate } from '../types'
import LogRunForm from './LogRunForm'
import LogLiftForm from './LogLiftForm'

interface Props {
  trainingPlan: TrainingPlan[]
  workoutLogs: WorkoutLog[]
  isUnlocked: boolean | null
  onLog: () => void
}

type SessionStatus = 'planned' | 'completed' | 'skipped'

const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
}

const RUN_TYPE_LABELS: Record<string, string> = {
  easy: 'Easy Run',
  tempo: 'Tempo Run',
  long: 'Long Run',
  race_pace: 'Race Pace',
}

function runStatus(run: PlannedRun, weekLogs: WorkoutLog[]): { status: SessionStatus; log?: WorkoutLog } {
  const match = weekLogs.find((l) => {
    if (l.workout_type !== 'run') return false
    if (l.run_type) return l.run_type === run.type
    // fallback for logs created before run_type was added
    const logDate = parseLocalDate(l.log_date)
    return logDate.getDay() === DAY_INDEX[run.day]
  })
  if (!match) return { status: 'planned' }
  return { status: match.status as SessionStatus, log: match }
}

function liftStatus(lift: PlannedLift, weekLogs: WorkoutLog[]): { status: SessionStatus; log?: WorkoutLog } {
  const match = weekLogs.find((l) => l.workout_type === 'lift' && l.lift_day === lift.workout)
  if (!match) return { status: 'planned' }
  return { status: match.status as SessionStatus, log: match }
}

function StatusBadge({ status }: { status: SessionStatus }) {
  if (status === 'completed') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
        Completed
      </span>
    )
  }
  if (status === 'skipped') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
        Skipped
      </span>
    )
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm/5 text-warm/35">
      Planned
    </span>
  )
}

function SessionCard({
  title,
  subtitle,
  detail,
  status,
  logDetail,
}: {
  title: string
  subtitle: string
  detail: string
  status: SessionStatus
  logDetail?: string
}) {
  return (
    <div
      className={`bg-background rounded-xl p-4 border transition-colors ${
        status === 'completed'
          ? 'border-emerald-500/15'
          : status === 'skipped'
          ? 'border-red-500/10'
          : 'border-warm/5'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-warm/40 text-[10px] tracking-widest uppercase">{title}</p>
        <StatusBadge status={status} />
      </div>
      <p className="text-warm/90 text-sm font-medium">{subtitle}</p>
      <p className="text-warm/40 text-xs mt-1">{detail}</p>
      {logDetail && <p className="text-warm/50 text-xs mt-1.5 italic">{logDetail}</p>}
    </div>
  )
}

export default function ThisWeek({ trainingPlan, workoutLogs, isUnlocked, onLog }: Props) {
  const [showRunForm, setShowRunForm] = useState(false)
  const [showLiftForm, setShowLiftForm] = useState(false)

  const currentWeek = getCurrentWeek(trainingPlan)

  if (!currentWeek) {
    const firstWeek = trainingPlan[0]
    const daysToStart = firstWeek
      ? Math.ceil(
          (parseLocalDate(firstWeek.week_start_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        )
      : null

    return (
      <div className="bg-surface border border-warm/5 rounded-2xl p-6 mb-6">
        <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-3">This Week</p>
        <p className="text-warm/60 text-sm">
          Training begins June 2, 2026
          {daysToStart !== null && daysToStart > 0 && ` — ${daysToStart} day${daysToStart !== 1 ? 's' : ''} away`}.
        </p>
      </div>
    )
  }

  const weekLogs = workoutLogs.filter((l) => l.week_number === currentWeek.week_number)

  const handleLogSubmit = () => {
    setShowRunForm(false)
    setShowLiftForm(false)
    onLog()
  }

  const weekStart = parseLocalDate(currentWeek.week_start_date)
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
  const fmtDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="bg-surface border border-warm/5 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-1">This Week</p>
          <p className="text-warm/60 text-xs">
            {fmtDate(weekStart)} – {fmtDate(weekEnd)} · Week {currentWeek.week_number}
          </p>
        </div>

        {isUnlocked && (
          <div className="flex gap-2">
            <button
              onClick={() => { setShowRunForm(true); setShowLiftForm(false) }}
              className="text-sm px-4 py-2 border border-warm/10 text-warm/50 rounded-full hover:border-terracotta/40 hover:text-terracotta transition-all duration-200 active:scale-95"
            >
              + Log Run
            </button>
            <button
              onClick={() => { setShowLiftForm(true); setShowRunForm(false) }}
              className="text-sm px-4 py-2 border border-warm/10 text-warm/50 rounded-full hover:border-terracotta/40 hover:text-terracotta transition-all duration-200 active:scale-95"
            >
              + Log Lift
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Runs */}
        <div>
          <p className="text-warm/30 text-[10px] tracking-widest uppercase mb-3">Runs</p>
          <div className="space-y-2">
            {currentWeek.planned_runs.map((run) => {
              const { status, log } = runStatus(run, weekLogs)
              const logDetail =
                status === 'completed' && log?.miles
                  ? `${log.miles} mi${log.pace ? ` · ${log.pace}/mi` : ''}`
                  : undefined
              return (
                <SessionCard
                  key={`${run.day}-${run.type}`}
                  title={run.day}
                  subtitle={RUN_TYPE_LABELS[run.type] ?? run.type}
                  detail={`${run.miles} mi · ${run.pace_zone}/mi`}
                  status={status}
                  logDetail={logDetail}
                />
              )
            })}
            {currentWeek.planned_runs.length === 0 && (
              <p className="text-warm/25 text-sm">No runs this week.</p>
            )}
          </div>
        </div>

        {/* Lifts */}
        <div>
          <p className="text-warm/30 text-[10px] tracking-widest uppercase mb-3">Lifts</p>
          <div className="space-y-2">
            {currentWeek.planned_lifts.map((lift) => {
              const { status } = liftStatus(lift, weekLogs)
              const liftLabels: Record<string, string> = { A: 'Day A — Power', B: 'Day B — Strength', C: 'Day C — Hypertrophy' }
              return (
                <SessionCard
                  key={`${lift.day}-${lift.workout}`}
                  title={lift.day}
                  subtitle={liftLabels[lift.workout] ?? `Day ${lift.workout}`}
                  detail=""
                  status={status}
                />
              )
            })}
            {currentWeek.planned_lifts.length === 0 && (
              <p className="text-warm/25 text-sm">No lifts this week.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal forms — fixed overlays, rendered outside the card flow */}
      {showRunForm && (
        <LogRunForm
          weekNumber={currentWeek.week_number}
          plannedRuns={currentWeek.planned_runs}
          onSubmit={handleLogSubmit}
          onClose={() => setShowRunForm(false)}
        />
      )}
      {showLiftForm && (
        <LogLiftForm
          weekNumber={currentWeek.week_number}
          onSubmit={handleLogSubmit}
          onClose={() => setShowLiftForm(false)}
        />
      )}
    </div>
  )
}
