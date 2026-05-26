'use client'
// RecentLogs.tsx — Last 10 workout logs with owner edit and delete actions.

import { useState } from 'react'
import type { WorkoutLog } from '../types'
import LogRunForm from './LogRunForm'
import LogLiftForm from './LogLiftForm'

interface Props {
  workoutLogs: WorkoutLog[]
  isUnlocked: boolean | null
  onUpdate: () => void
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function RecentLogs({ workoutLogs, isUnlocked, onUpdate }: Props) {
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const recent = workoutLogs.slice(0, 10)

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/exercise-tracker/log/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setConfirmDeleteId(null)
      onUpdate()
    } catch {
      // silently reset — user can retry
    } finally {
      setDeleting(false)
    }
  }

  const handleEditClose = () => setEditingLog(null)
  const handleEditSubmit = () => {
    setEditingLog(null)
    onUpdate()
  }

  if (recent.length === 0) {
    return (
      <div className="bg-surface border border-warm/5 rounded-2xl p-6">
        <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-5">Recent Workouts</p>
        <p className="text-warm/25 text-sm">No workouts logged yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-surface border border-warm/5 rounded-2xl p-6">
        <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-5">Recent Workouts</p>

        <div className="space-y-2">
          {recent.map((log) => {
            const completed = log.status === 'completed'
            const isConfirmingDelete = confirmDeleteId === log.id

            const details =
              log.workout_type === 'run'
                ? completed && log.miles
                  ? `${log.miles} mi${log.pace ? ` · ${log.pace}/mi` : ''}`
                  : 'Skipped'
                : completed
                ? `Day ${log.lift_day}`
                : 'Skipped'

            return (
              <div
                key={log.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                  isConfirmingDelete
                    ? 'border-red-500/20 bg-red-500/5'
                    : 'border-warm/5 bg-background'
                } ${!completed ? 'opacity-50' : ''}`}
              >
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-warm/70 text-sm">{formatDate(log.log_date)}</span>
                    <span className="text-warm/25 text-xs">·</span>
                    <span className="text-warm/50 text-sm capitalize">{log.workout_type}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        completed
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-warm/5 text-warm/30'
                      }`}
                    >
                      {completed ? 'Completed' : 'Skipped'}
                    </span>
                  </div>
                  <p className="text-warm/40 text-xs mt-0.5">{details}</p>
                </div>

                {/* Right: owner actions */}
                {isUnlocked && (
                  <div className="flex items-center gap-2 shrink-0">
                    {isConfirmingDelete ? (
                      <>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-warm/40 px-2 py-1 rounded-lg border border-warm/10 hover:border-warm/20 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={deleting}
                          className="text-xs text-red-400 px-2 py-1 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {deleting ? '…' : 'Delete'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingLog(log)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-warm/10 text-warm/35 hover:border-terracotta/30 hover:text-terracotta transition-colors"
                          title="Edit"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(log.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-warm/10 text-warm/35 hover:border-red-500/30 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit modals */}
      {editingLog?.workout_type === 'run' && (
        <LogRunForm
          weekNumber={editingLog.week_number}
          logId={editingLog.id}
          initialValues={{
            date: editingLog.log_date,
            status: editingLog.status,
            miles: editingLog.miles != null ? String(editingLog.miles) : '',
            pace: editingLog.pace ?? '',
          }}
          onSubmit={handleEditSubmit}
          onClose={handleEditClose}
        />
      )}
      {editingLog?.workout_type === 'lift' && (
        <LogLiftForm
          weekNumber={editingLog.week_number}
          logId={editingLog.id}
          initialValues={{
            date: editingLog.log_date,
            status: editingLog.status,
            liftDay: (editingLog.lift_day as 'A' | 'B' | 'C') ?? 'A',
          }}
          onSubmit={handleEditSubmit}
          onClose={handleEditClose}
        />
      )}
    </>
  )
}
