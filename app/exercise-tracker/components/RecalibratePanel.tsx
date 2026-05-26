'use client'
// RecalibratePanel.tsx — Owner-only AI recalibration panel.
// Disabled until 3+ workout logs exist for the current week.

import { useState } from 'react'
import type { TrainingPlan, WorkoutLog, RecalibrateResult } from '../types'
import { getCurrentWeek } from '../types'

interface Props {
  trainingPlan: TrainingPlan[]
  workoutLogs: WorkoutLog[]
  isUnlocked: boolean | null
  onRecalibrate: () => void
}

const STATUS_CONFIG = {
  on_track: { label: 'On Track', color: '#22c55e', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  slightly_behind: { label: 'Slightly Behind', color: '#eab308', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  behind: { label: 'Behind', color: '#ef4444', bg: 'bg-red-500/10 border-red-500/20' },
  ahead: { label: 'Ahead', color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20' },
}

export default function RecalibratePanel({ trainingPlan, workoutLogs, isUnlocked, onRecalibrate }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecalibrateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)

  const currentWeek = getCurrentWeek(trainingPlan)
  const weekNum = currentWeek?.week_number ?? 0
  const weekLogs = workoutLogs.filter((l) => l.week_number === weekNum)
  const logCount = weekLogs.length
  const canRecalibrate = logCount >= 3 && !!currentWeek

  if (!isUnlocked) return null

  const handleRecalibrate = async () => {
    if (!currentWeek || !canRecalibrate) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/recalibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: currentWeek.week_number,
          weekLogs,
          trainingPlan,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const aiResult: RecalibrateResult = await res.json()
      setResult(aiResult)

      // Apply adjustments to the database
      setApplying(true)
      const patchRes = await fetch('/api/exercise-tracker/plan-update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: currentWeek.week_number,
          updates: aiResult.adjustments,
          summaryInput: { weekLogs, currentWeek },
          aiResponse: JSON.stringify(aiResult),
          adjustmentsApplied: aiResult.adjustments,
        }),
      })

      if (!patchRes.ok) {
        const data = await patchRes.json()
        throw new Error(data.error ?? 'Failed to apply adjustments')
      }

      onRecalibrate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
      setApplying(false)
    }
  }

  const statusCfg = result ? STATUS_CONFIG[result.status] : null

  return (
    <div className="bg-surface border border-warm/5 rounded-2xl p-6 mb-6">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div>
          <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-1">AI Coach</p>
          <p className="text-warm/70 text-sm">Recalibrate based on this week&apos;s performance</p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={handleRecalibrate}
            disabled={!canRecalibrate || loading || applying}
            title={!canRecalibrate ? `Log ${3 - logCount} more workout${3 - logCount !== 1 ? 's' : ''} to unlock` : undefined}
            className={`text-sm px-5 py-2 rounded-full border transition-all duration-200 ${
              canRecalibrate && !loading && !applying
                ? 'border-terracotta/60 text-terracotta hover:bg-terracotta hover:text-background'
                : 'border-warm/10 text-warm/25 cursor-not-allowed'
            }`}
          >
            {loading ? 'Analyzing…' : applying ? 'Applying…' : 'Recalibrate My Plan'}
          </button>
          {!canRecalibrate && weekNum > 0 && (
            <p className="text-warm/25 text-[11px]">
              {logCount} / 3 workouts logged
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-red-400/70 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-8 flex items-center justify-center gap-3">
          <div className="w-4 h-4 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
          <p className="text-warm/40 text-sm">Analyzing your week…</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4 mt-4">
          {/* Status + summary */}
          <div className={`rounded-xl border p-4 ${statusCfg?.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ color: statusCfg?.color, background: `${statusCfg?.color}20` }}
              >
                {statusCfg?.label}
              </span>
            </div>
            <p className="text-warm/70 text-sm leading-relaxed">{result.summary}</p>
          </div>

          {/* Adjustments */}
          {result.adjustments.length > 0 && (
            <div>
              <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-3">Adjustments</p>
              <div className="space-y-2">
                {result.adjustments.map((adj, i) => (
                  <div key={i} className="bg-background rounded-xl p-3.5 border border-warm/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-terracotta text-xs font-medium">Week {adj.weekNumber}</span>
                      <span className="text-warm/25 text-xs">·</span>
                      <span className="text-warm/40 text-xs">{adj.field.replace(/_/g, ' ')}</span>
                      {adj.oldValue !== adj.newValue && (
                        <>
                          <span className="text-warm/25 text-xs">{adj.oldValue} →</span>
                          <span className="text-emerald-400 text-xs font-medium">{adj.newValue}</span>
                        </>
                      )}
                    </div>
                    <p className="text-warm/40 text-xs">{adj.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.adjustments.length === 0 && (
            <p className="text-warm/30 text-sm">No adjustments needed — plan stays as is.</p>
          )}

          {/* Coach note */}
          <div className="bg-terracotta/5 border border-terracotta/15 rounded-xl p-4">
            <p className="text-terracotta/70 text-[10px] tracking-widest uppercase mb-2">Coach&apos;s Note</p>
            <p className="text-warm/70 text-sm leading-relaxed">{result.coachNote}</p>
          </div>
        </div>
      )}
    </div>
  )
}
